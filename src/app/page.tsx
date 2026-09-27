"use client";

import { useState } from "react";
import CoastalScene from "@/components/scene/CoastalScene";
import Header from "@/components/ui/Header";
import SceneHint from "@/components/ui/SceneHint";
import RpgQuestModal from "@/components/ui/RpgQuestModal";
import ScrollsVerticalModal from "@/components/ui/ScrollsVerticalModal";
import {
  CharacterReaction,
  MerchantSkillQuest,
  SkillQuestOption,
} from "@/data/dialogueData";
import { sounds } from "@/lib/sound";

export default function Home() {
  const [reaction, setReaction] = useState<CharacterReaction>("wave");
  const [xp, setXp] = useState(0);
  const [xpGain, setXpGain] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isScrollsModalOpen, setIsScrollsModalOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<MerchantSkillQuest | null>(null);

  // Sound Toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick();
  };

  // Open the vertical scrolls modal when clicking on the grimoire / scroll on the desk
  const handleOpenScrollsModal = () => {
    sounds.playBell();
    setReaction("happy");
    setIsScrollsModalOpen(true);
  };

  // Selecting a quest from the vertical modal
  const handleSelectQuestFromModal = (quest: MerchantSkillQuest) => {
    setIsScrollsModalOpen(false);
    sounds.playClick();
    setReaction("think");
    setActiveQuest(quest);
  };

  // Completion of an option inside the RPG Quest Modal
  const handleCompleteSkillQuest = (option: SkillQuestOption) => {
    sounds.playSuccess();
    setXp((prev) => prev + option.xp);
    setXpGain(option.xp);
    setTimeout(() => setXpGain(null), 1400);
    setReaction("celebrate");
  };

  // Restart
  const handleRestart = () => {
    sounds.playClick();
    setXp(0);
    setReaction("wave");
    setIsScrollsModalOpen(false);
    setActiveQuest(null);
  };

  // Click on Character
  const handleCharacterClick = () => {
    sounds.playPop();
    setReaction((prev) => (prev === "celebrate" ? "wave" : "celebrate"));
  };

  // Click on Counter Bell
  const handleBellClick = () => {
    sounds.playBell();
    setReaction("celebrate");
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-sky-200 select-none">
      {/* 1. 3D WebGL Layer (Balcão com Grimório Central + Mercador RPG + Balão 3D Centralizado e Ampliado) */}
      <CoastalScene
        reaction={reaction}
        onCharacterClick={handleCharacterClick}
        onBellClick={handleBellClick}
        onOpenScrollsModal={handleOpenScrollsModal}
      />

      {/* 2. Interactive Overlay (Top Header com XP + Atalho Pergaminhos + Hint) */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5 md:p-6 z-10">
        <Header
          xp={xp}
          xpGain={xpGain}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onRestart={handleRestart}
          onOpenScrolls={handleOpenScrollsModal}
        />

        <SceneHint />
      </div>

      {/* 3. Modal Vertical com os 4 Grandes Pergaminhos */}
      <ScrollsVerticalModal
        isOpen={isScrollsModalOpen}
        onClose={() => setIsScrollsModalOpen(false)}
        onSelectQuest={handleSelectQuestFromModal}
      />

      {/* 4. RPG Quest Modal ao selecionar uma das habilidades */}
      <RpgQuestModal
        quest={activeQuest}
        onClose={() => setActiveQuest(null)}
        onCompleteOption={handleCompleteSkillQuest}
      />
    </main>
  );
}
