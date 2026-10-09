import os
import re
import struct
import httpx
from typing import List, Dict, Any, Optional


class FishAudioService:
    FISH_AUDIO_API_URL = "https://api.fish.audio/v1/tts"

    # Default Voice Model IDs for characters
    DEFAULT_MODELS = {
        "rick_sanchez": "d2e75a3e3fd6419893057c02a375a113",
        "morty_smith": "377e4ac186da47faa3b644d033775954",
        "peter_griffin": "d75c270eaee14c8aa1e9e980cc37cf1b",
    }

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = (api_key or os.environ.get("FISH_AUDIO_API_KEY", "")).strip()

    def is_custom_character(self, voice_id: Optional[str]) -> bool:
        if not voice_id:
            return False
        clean_id = voice_id.strip().lower()
        return clean_id in self.DEFAULT_MODELS or clean_id.startswith("fish_")

    def get_reference_id(self, voice_id: str) -> Optional[str]:
        clean_id = voice_id.strip().lower()
        # Allow environment overrides if configured
        env_map = {
            "rick_sanchez": os.environ.get("FISH_AUDIO_MODEL_RICK"),
            "morty_smith": os.environ.get("FISH_AUDIO_MODEL_MORTY"),
            "peter_griffin": os.environ.get("FISH_AUDIO_MODEL_PETER"),
        }
        if clean_id in env_map and env_map[clean_id]:
            return env_map[clean_id].strip()
        if clean_id in self.DEFAULT_MODELS:
            return self.DEFAULT_MODELS[clean_id]
        if clean_id.startswith("fish_"):
            return clean_id.replace("fish_", "")
        return None

    def synthesize_audio_bytes(self, text: str, voice_id: str = "rick_sanchez") -> bytes:
        if not self.api_key:
            raise ValueError(
                "FISH_AUDIO_API_KEY is not configured in environment or secrets."
            )

        reference_id = self.get_reference_id(voice_id)
        if not reference_id:
            raise ValueError(f"Unknown Fish Audio character voice: {voice_id}")

        clean_text = text.strip()
        if not clean_text:
            raise ValueError("No text provided for Fish Audio speech synthesis")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "text": clean_text,
            "reference_id": reference_id,
            "format": "mp3",
        }

        with httpx.Client(timeout=60.0) as client:
            response = client.post(
                self.FISH_AUDIO_API_URL,
                headers=headers,
                json=payload,
            )

        if response.status_code != 200:
            error_body = response.text[:200]
            raise RuntimeError(
                f"Fish Audio API returned status {response.status_code}: {error_body}"
            )

        audio_bytes = response.content
        if not audio_bytes:
            raise RuntimeError("Fish Audio API returned empty audio content")

        return audio_bytes

    def calculate_mp3_duration(self, data: bytes) -> float:
        """
        Pure-Python MP3 duration calculator parsing MPEG-1 Layer III sync frames.
        Falls back to 128kbps bitrate estimate if frame sync is unavailable.
        """
        if not data or len(data) < 10:
            return 2.0

        offset = 0
        if data.startswith(b"ID3"):
            size = 0
            for b in data[6:10]:
                size = (size << 7) | (b & 0x7F)
            offset = 10 + size

        bitrates_v1_l3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
        sample_rates_v1 = [44100, 48000, 32000, 0]

        total_samples = 0
        sample_rate = 44100
        frames = 0
        i = offset
        length = len(data)

        while i < length - 4:
            if data[i] == 0xFF and (data[i + 1] & 0xE0) == 0xE0:
                header = struct.unpack(">I", data[i : i + 4])[0]
                version = (header >> 19) & 3
                layer = (header >> 17) & 3
                bitrate_idx = (header >> 12) & 15
                sr_idx = (header >> 10) & 3
                padding = (header >> 9) & 1

                if version == 3 and layer == 1 and sr_idx < 3 and 0 < bitrate_idx < 15:
                    sample_rate = sample_rates_v1[sr_idx]
                    bitrate = bitrates_v1_l3[bitrate_idx] * 1000
                    frame_len = (144 * bitrate) // sample_rate + padding
                    if frame_len > 0:
                        total_samples += 1152
                        frames += 1
                        i += frame_len
                        continue
            i += 1

        if frames > 0 and sample_rate > 0:
            return max(0.5, total_samples / sample_rate)

        # Fallback approximation assuming standard 128kbps MP3
        usable_bytes = max(len(data) - offset, 100)
        return max(1.0, usable_bytes / (128000 / 8))

    def gen_speech_marks(self, text: str, audio_bytes: bytes) -> List[Dict[str, Any]]:
        """
        Generates proportional word-level speech marks matching Amazon Polly's schema.
        Weights words by length and punctuation pauses to create realistic subtitle timings.
        """
        raw_words = text.strip().split()
        if not raw_words:
            return []

        total_duration_sec = self.calculate_mp3_duration(audio_bytes)
        total_duration_ms = max(500, int(total_duration_sec * 1000))

        # Calculate weights for each word based on character length and punctuation
        word_weights = []
        clean_words = []
        for w in raw_words:
            clean = re.sub(r"[^\w'-]", "", w)
            clean_words.append(clean if clean else w)

            # Base weight: length of word (minimum 2)
            weight = max(2.0, float(len(clean)))
            # Punctuation pause additions
            if w.endswith((".", "!", "?")):
                weight += 4.5
            elif w.endswith((",", ";", ":")):
                weight += 2.5
            elif w.endswith(("-", "—")):
                weight += 1.5
            word_weights.append(weight)

        total_weight = sum(word_weights) or 1.0

        speech_marks = []
        current_time_ms = 40  # Slight 40ms lead-in for human speech onset
        available_time_ms = max(100, total_duration_ms - 80)

        for i, word in enumerate(clean_words):
            fraction = word_weights[i] / total_weight
            word_duration_ms = int(fraction * available_time_ms)

            speech_marks.append({
                "time": int(current_time_ms),
                "type": "word",
                "start": i,
                "end": i + len(word),
                "value": word,
            })
            current_time_ms += word_duration_ms

        return speech_marks
