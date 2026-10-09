import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faCube,
  faWater,
  faCar,
  faMicrophone,
  faCheck,
  faFlask,
  faFaceSurprise,
  faTv,
} from "@fortawesome/free-solid-svg-icons";

interface SelectVideoStyleProps {
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

export const stylesList = [
  {
    id: "subway",
    name: "Subway Surfers",
    icon: faGamepad,
    badge: "Most Popular",
    gradient: "from-sky-500/20 to-blue-600/30",
  },
  {
    id: "minecraft",
    name: "Minecraft Parkour",
    icon: faCube,
    badge: "Trending",
    gradient: "from-emerald-500/20 to-green-600/30",
  },
  {
    id: "slime",
    name: "Satisfying Slime",
    icon: faWater,
    badge: "Relaxing",
    gradient: "from-pink-500/20 to-purple-600/30",
  },
  {
    id: "gta",
    name: "GTA Ramp Stunts",
    icon: faCar,
    badge: "High Energy",
    gradient: "from-amber-500/20 to-orange-600/30",
  },
];

export interface VoiceItem {
  id: string;
  name: string;
  accent: string;
  icon: any;
  badge?: string;
}

export const standardVoices: VoiceItem[] = [
  {
    id: "Matthew",
    name: "Matthew",
    accent: "US English (Male)",
    icon: faMicrophone,
  },
  {
    id: "Joanna",
    name: "Joanna",
    accent: "US English (Female)",
    icon: faMicrophone,
  },
  {
    id: "Brian",
    name: "Brian",
    accent: "British (Male)",
    icon: faMicrophone,
  },
  {
    id: "Amy",
    name: "Amy",
    accent: "British (Female)",
    icon: faMicrophone,
  },
];

export const characterVoices: VoiceItem[] = [
  {
    id: "rick_sanchez",
    name: "Rick Sanchez",
    accent: "Mad Scientist • Rick & Morty",
    icon: faFlask,
    badge: "Iconic",
  },
  {
    id: "morty_smith",
    name: "Morty Smith",
    accent: "Anxious Sidekick • Rick & Morty",
    icon: faFaceSurprise,
    badge: "Animated",
  },
  {
    id: "peter_griffin",
    name: "Peter Griffin",
    accent: "Family Guy",
    icon: faTv,
    badge: "Pop Culture",
  },
];

export const voicesList = [...standardVoices, ...characterVoices];

export const SelectVideoStyle: React.FC<SelectVideoStyleProps> = ({
  selectedStyle,
  setSelectedStyle,
  selectedVoice,
  setSelectedVoice,
}) => {
  const isSelectedCharacter = characterVoices.some(
    (v) => v.id === selectedVoice
  );
  const [voiceCategory, setVoiceCategory] = useState<"standard" | "character">(
    isSelectedCharacter ? "character" : "standard"
  );

  const displayedVoices =
    voiceCategory === "standard" ? standardVoices : characterVoices;

  return (
    <div className="w-full flex flex-col gap-6 my-4">
      {/* Background Style Picker */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
            <span className="text-[var(--highlight-text)]">1.</span> Select Background
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stylesList.map((style) => {
            const isSelected = selectedStyle === style.id;
            return (
              <div
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "border-[var(--highlight-text)] bg-[var(--highlight-bg)] ring-1 ring-[var(--highlight-text)] shadow-lg shadow-[var(--highlight-text)]/10"
                    : "border-[var(--primary-border)] bg-[var(--secondary-bg)] hover:border-gray-500 hover:bg-[var(--secondary-bg-hvr)]"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--highlight-text)] text-black flex items-center justify-center text-xs">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FontAwesomeIcon
                      icon={style.icon}
                      className={isSelected ? "text-[var(--highlight-text)]" : "text-gray-400"}
                    />
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-300 font-medium">
                      {style.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-gray-100">{style.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Narrator Picker */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
            <span className="text-[var(--highlight-text)]">2.</span> Choose Voice Narrator
          </h2>

          {/* Voice Category Segmented Tabs */}
          <div className="flex p-0.5 rounded-xl bg-black/40 border border-white/10">
            <button
              type="button"
              onClick={() => setVoiceCategory("standard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                voiceCategory === "standard"
                  ? "bg-[var(--secondary-bg)] text-white shadow-sm border border-white/10"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setVoiceCategory("character")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                voiceCategory === "character"
                  ? "bg-[var(--secondary-bg)] text-white shadow-sm border border-white/10"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Custom Characters
            </button>
          </div>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            voiceCategory === "standard" ? "lg:grid-cols-4" : "lg:grid-cols-3"
          } gap-3`}
        >
          {displayedVoices.map((voice) => {
            const isSelected = selectedVoice === voice.id;
            return (
              <div
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
                className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-[var(--highlight-text)] bg-[var(--highlight-bg)] ring-1 ring-[var(--highlight-text)] shadow-lg shadow-[var(--highlight-text)]/10"
                    : "border-[var(--primary-border)] bg-[var(--secondary-bg)] hover:border-gray-500 hover:bg-[var(--secondary-bg-hvr)]"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--highlight-text)] text-black flex items-center justify-center text-xs">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <FontAwesomeIcon
                    icon={voice.icon}
                    className={isSelected ? "text-[var(--highlight-text)]" : "text-gray-400"}
                  />
                  <h3 className="font-semibold text-sm text-gray-100">{voice.name}</h3>
                  {voice.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium border border-cyan-500/20 ml-auto mr-5">
                      {voice.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--highlight-text)] font-medium">
                  {voice.accent}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
