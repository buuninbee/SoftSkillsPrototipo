"use client";

import { MERCHANT_SKILL_QUESTS, MerchantSkillQuest } from "@/data/dialogueData";
import QuestIcon from "@/components/ui/QuestIcon";

interface ScrollsVerticalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuest: (quest: MerchantSkillQuest) => void;
  userName?: string;
}

export default function ScrollsVerticalModal({
  isOpen,
  onClose,
  onSelectQuest,
  userName,
}: ScrollsVerticalModalProps) {
  if (!isOpen) return null;

  const questList = Object.values(MERCHANT_SKILL_QUESTS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#fffdf5] border-2 border-amber-600 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-800">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-amber-200 bg-amber-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📜</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Os 4 Pergaminhos de Autoconhecimento
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold transition-all shadow-sm active:scale-95"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Subtitle invitation */}
        <div className="px-5 sm:px-6 pt-3 pb-1">
          <p className="text-xs sm:text-sm text-slate-600 italic">
            Ei, {userName || "aventureiro"}! Escolha um pergaminho sagrado na
            vertical para realizar seu desafio e descobrir o seu estilo de
            atuação no trabalho
          </p>
        </div>

        {/* Scrollable vertical list of 4 large scrolls */}
        <div className="p-4 sm:p-6 flex flex-col gap-3.5 overflow-y-auto max-h-[60vh] pr-2">
          {questList.map((quest, index) => (
            <button
              key={quest.key}
              onClick={() => onSelectQuest(quest)}
              className="group relative text-left p-4 sm:p-5 rounded-2xl border-2 border-amber-300/80 hover:to-white hover:border-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 "
            >
              {/* Left Side: Icon & Titles */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl  shrink-0 group-hover:scale-105 transition-transform overflow-hidden p-1.5">
                  <QuestIcon icon={quest.icon} alt={quest.title} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-md">
                      Caminho {["I", "II", "III", "IV"][index]}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-amber-900 transition-colors mt-0.5">
                    {quest.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-md">
                    {quest.intro}
                  </p>
                </div>
              </div>

              {/* Right Side: Action Button */}
              <div className="shrink-0 w-full sm:w-auto flex justify-end">
                <span className="w-full sm:w-auto text-center px-4 py-2.5 bg-[#AB4C06] group-hover:from-amber-700 group-hover:to-amber-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5">
                  <span>Abrir Pergaminho</span>
                  <span>📜</span>
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-amber-200 bg-amber-50/70 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            Voltar ao Balcão
          </button>
        </div>
      </div>
    </div>
  );
}
