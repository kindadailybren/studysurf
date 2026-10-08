import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faCube,
  faWater,
  faCar,
  faMicrophone,
  faCheck,
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
    subtitle: "Fast-paced neon dodge",
    icon: faGamepad,
    badge: "Most Popular",
    gradient: "from-sky-500/20 to-blue-600/30",
  },
  {
    id: "minecraft",
    name: "Minecraft Parkour",
    subtitle: "Satisfying block jumps",
    icon: faCube,
    badge: "Trending",
    gradient: "from-emerald-500/20 to-green-600/30",
  },
  {
    id: "slime",
    name: "Satisfying Slime",
    subtitle: "Calm tactile ASMR visual",
    icon: faWater,
    badge: "Relaxing",
    gradient: "from-pink-500/20 to-purple-600/30",
  },
  {
    id: "gta",
    name: "GTA Ramp Stunts",
    subtitle: "High speed kinetic loop",
    icon: faCar,
    badge: "High Energy",
    gradient: "from-amber-500/20 to-orange-600/30",
  },
];

export const voicesList = [
  {
    id: "Matthew",
    name: "Matthew",
    accent: "US English (Male)",
    description: "Deep, focused & authoritative",
  },
  {
    id: "Joanna",
    name: "Joanna",
    accent: "US English (Female)",
    description: "Crisp, energetic & articulate",
  },
  {
    id: "Brian",
    name: "Brian",
    accent: "British (Male)",
    description: "Calm, narrative & academic",
  },
  {
    id: "Amy",
    name: "Amy",
    accent: "British (Female)",
    description: "Upbeat, warm & conversational",
  },
];

export const SelectVideoStyle: React.FC<SelectVideoStyleProps> = ({
  selectedStyle,
  setSelectedStyle,
  selectedVoice,
  setSelectedVoice,
}) => {
  return (
    <div className="w-full flex flex-col gap-6 my-4">
      {/* Background Style Picker */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
            <span className="text-[var(--highlight-text)]">1.</span> Select Background Aesthetics
          </h2>
          <span className="text-xs text-gray-400">Word-synced shorts background</span>
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
                  <p className="text-xs text-gray-400 mt-1">{style.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Narrator Picker */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
            <span className="text-[var(--highlight-text)]">2.</span> Choose Voice Narrator
          </h2>
          <span className="text-xs text-gray-400">Amazon Polly Neural Speech</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {voicesList.map((voice) => {
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
                    icon={faMicrophone}
                    className={isSelected ? "text-[var(--highlight-text)]" : "text-gray-400"}
                  />
                  <h3 className="font-semibold text-sm text-gray-100">{voice.name}</h3>
                </div>
                <p className="text-xs text-[var(--highlight-text)] font-medium mb-1">
                  {voice.accent}
                </p>
                <p className="text-xs text-gray-400">{voice.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
