"use client";

import { DialogueStep, DialogueOption } from "@/data/dialogueData";

interface QuestionBoxProps {
  step: DialogueStep;
  currentIndex: number;
  totalSteps: number;
  onSelectOption: (option: DialogueOption) => void;
  onCharacterInteraction: () => void;
}

export default function QuestionBox({
  step,
  currentIndex,
  totalSteps,
  onSelectOption,
  onCharacterInteraction,
}: QuestionBoxProps) {
  // const progressPercent = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className="pointer-events-auto w-full max-w-2xl mx-auto mt-2">
      {/* Floating Caixa de Pergunta (Question Box) */}
      <div className="relative bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl shadow-sky-950/15 border-2 border-white/80 dark:border-zinc-700/80 transition-all duration-300 max-h-[65vh] flex flex-col">
        {/* Progress Bar inside Top Border */}
        {/* <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mb-3.5 overflow-hidden shrink-0">
          <div
            className="bg-gradient-to-r from-sky-400 via-indigo-500 to-amber-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div> 

        {/* Question Box Header */}
        <div className="flex items-center justify-between gap-3 mb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onCharacterInteraction}
              title="Clique para chamar o atendente do balcão!"
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-sm shadow hover:scale-105 active:scale-95 transition"
            >
              🛎️
            </button>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-sky-600 dark:text-sky-400 block">
                {step.badge}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Atendente da Ilha
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
            {currentIndex + 1} de {totalSteps}
          </span>
        </div>
        {/* Question Text */}
        <div className="mb-3 sm:mb-4 shrink-0">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-zinc-800 dark:text-zinc-100 leading-snug">
            {step.question}
          </h2>
        </div>{" "}
        *{/* Options List */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-0.5">
          {step.options.map((option, i) => (
            <button
              key={i}
              onClick={() => onSelectOption(option)}
              className="group relative flex items-center justify-between w-full text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-zinc-50/90 dark:bg-zinc-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-zinc-200/80 dark:border-zinc-700/80 hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-150 active:scale-[0.99] shadow-sm hover:shadow"
            >
              <span className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-200 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                {option.text}
              </span>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                {option.xp > 0 && (
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/50">
                    +{option.xp} XP
                  </span>
                )}
                <span className="text-zinc-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all text-xs sm:text-sm font-bold">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
