"use client";

import { useEffect, useState } from "react";
import CoastalScene from "@/components/scene/CoastalScene";
import RpgQuestModal from "@/components/ui/RpgQuestModal";
import ScrollsVerticalModal from "@/components/ui/ScrollsVerticalModal";
import UserRegistrationModal, {
  UserData,
} from "@/components/ui/UserRegistrationModal";
import {
  CharacterReaction,
  MerchantSkillQuest,
  SkillQuestOption,
} from "@/data/dialogueData";
import { sounds } from "@/lib/sound";

export default function Home() {
  const [reaction, setReaction] = useState<CharacterReaction>("wave");

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [xp, setXp] = useState(0);
  const [xpGain, setXpGain] = useState<number | null>(null);
  const [isScrollsModalOpen, setIsScrollsModalOpen] = useState(false);
  const [activeQuest, setActiveQuest] = useState<MerchantSkillQuest | null>(
    null
  );
  const [user, setUser] = useState<UserData | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem("softskills_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.name && parsed?.email) {
            setUser(parsed);
            return;
          }
        }
      } catch {
        // ignore storage errors
      }
      setIsRegisterModalOpen(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleRegisterUser = (data: UserData) => {
    try {
      localStorage.setItem("softskills_user", JSON.stringify(data));
    } catch {
      // ignore storage errors
    }
    setUser(data);
    setIsRegisterModalOpen(false);
    sounds.playSuccess();
    setReaction("celebrate");
  };

  // Open the vertical scrolls modal when clicking on the grimoire / scroll on the desk
  const handleOpenScrollsModal = () => {
    if (!user) {
      setIsRegisterModalOpen(true);
      return;
    }
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
    const xp = option.xp;
    if (typeof xp === "number") {
      setXp((prev) => prev + xp);
      setXpGain(xp);
      setTimeout(() => setXpGain(null), 1400);
    }
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

      {/* 2. Modal Inicial de Registro do Usuário */}
      <UserRegistrationModal
        isOpen={isRegisterModalOpen}
        onSubmit={handleRegisterUser}
      />

      {/* 3. Modal Vertical com os 4 Grandes Pergaminhos */}
      <ScrollsVerticalModal
        isOpen={isScrollsModalOpen}
        onClose={() => setIsScrollsModalOpen(false)}
        onSelectQuest={handleSelectQuestFromModal}
        userName={user?.name}
      />

      {/* 4. RPG Quest Modal ao selecionar uma das habilidades */}
      <RpgQuestModal
        quest={activeQuest}
        onClose={() => setActiveQuest(null)}
        onCompleteOption={handleCompleteSkillQuest}
        userName={user?.name}
      />
    </main>
  );
}
