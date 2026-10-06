"use client";

import { useState } from "react";
import { MerchantSkillQuest, SkillQuestOption } from "@/data/dialogueData";
import QuestIcon from "@/components/ui/QuestIcon";

interface RpgQuestModalProps {
  quest: MerchantSkillQuest | null;
  onClose: () => void;
  onCompleteOption: (option: SkillQuestOption) => void;
  userName?: string;
}

export default function RpgQuestModal({
  quest,
  onClose,
  onCompleteOption,
  userName,
}: RpgQuestModalProps) {
  const [selectedOption, setSelectedOption] = useState<SkillQuestOption | null>(
    null
  );

  if (!quest) return null;

  const handleChoose = (opt: SkillQuestOption) => {
    setSelectedOption(opt);
    onCompleteOption(opt);
  };

  const handleClose = () => {
    setSelectedOption(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#fffdf5] border-2 border-amber-600/80 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7 text-slate-800">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold transition-all shadow-sm active:scale-95"
          aria-label="Fechar"
        >
          ✕
        </button>

        {/* Quest Badge & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-2xl flex items-center justify-center text-3xl overflow-hidden p-1.5">
            <QuestIcon icon={quest.icon} alt={quest.title} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              {quest.title}
            </h2>
          </div>
        </div>

        {/* Merchant Dialogue / Intro Speech Bubble */}
        <div className="relative bg-amber-50/80 border border-amber-300/80 rounded-xl p-4 mb-5 shadow-sm">
          <div className="flex items-start gap-2.5">
            <span className="text-xl">🧝</span>
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                Mercador de RPG diz:
              </p>
              <p className="text-sm text-slate-700 italic mt-0.5 leading-relaxed">
                &ldquo;
                {userName
                  ? quest.intro.replace(/aventureiro/gi, userName)
                  : quest.intro}
                &rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Challenge / Dilemma */}
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <span>📜</span> Desafio de Autoconhecimento
          </h3>
          <p className="text-base font-semibold text-slate-900 leading-snug">
            {quest.question}
          </p>
        </div>

        {/* Options List */}
        {!selectedOption ? (
          <div className="flex flex-col gap-2.5 mb-2">
            {quest.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoose(opt)}
                className="group w-full text-left p-3.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 hover:border-amber-400 transition-all duration-150 shadow-xs hover:shadow-md flex flex-col gap-1 active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 group-hover:text-amber-900">
                    {opt.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 group-hover:text-slate-700 leading-relaxed">
                  {opt.description}
                </p>
              </button>
            ))}
          </div>
        ) : (
          /* Result Card after answering */
          <div className="relative p-5 bg-gradient-to-b from-amber-50 to-amber-100/70 border-2 border-amber-500 rounded-2xl mb-4 text-center shadow-lg shadow-amber-950/10 ring-1 ring-amber-300/50 animate-pop-in-rpg">
            <div className="text-3xl mb-1.5 inline-block animate-celebrate-badge">
              🎉
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900/90">
              Estilo Revelado
            </h4>
            <p className="text-lg font-black text-amber-950 mt-1">Gênio</p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-2" />
            <p className="text-xs font-medium text-amber-800/90 mt-1">
              Você conquistou e impressionou o Mercador!
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-between">
          <span className="text-xs text-slate-500 italic">
            Toque nos outros pergaminhos para desvendar mais estilos.
          </span>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            {selectedOption ? "Continuar Jornada ⚔️" : "Voltar ao Balcão 📜"}
          </button>
        </div>
      </div>
    </div>
  );
}
