"use client";

interface HeaderProps {
  xp: number;
  xpGain: number | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onOpenScrolls?: () => void;
}

export default function Header({
  xp,
  xpGain,
  soundEnabled,
  onToggleSound,
  onRestart,
  onOpenScrolls,
}: HeaderProps) {
  return (
    <header className="pointer-events-auto flex items-center justify-between gap-3 w-full max-w-5xl mx-auto">
      {/* Brand Island Pill */}
      <div className="flex items-center gap-2.5 sm:gap-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl shadow-lg border border-sky-100 dark:border-zinc-800">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-base shadow-sm">
          🧝‍♂️
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
            Guilda RPG
          </span>
          <h1 className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-100 leading-none">
            Mercador de Soft Skills
          </h1>
        </div>
      </div>

      {/* Right Controls: Scrolls CTA, XP, Sound, Restart */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Button to open the 4 Vertical Scrolls Modal */}
        {onOpenScrolls && (
          <button
            onClick={onOpenScrolls}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs px-3 sm:px-3.5 py-2 rounded-2xl shadow-lg transition-all active:scale-95 border border-amber-400/50"
            title="Abrir os 4 Pergaminhos Sagrados"
          >
            <span>📜</span>
            <span className="hidden sm:inline">Pergaminhos</span>
          </button>
        )}

        {/* XP Counter Pill */}
        <div className="relative flex items-center gap-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 sm:px-3.5 py-2 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-900/40">
          <span className="text-sm sm:text-base">⭐</span>
          <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 tracking-wide">
            {xp} XP
          </span>

          {xpGain !== null && (
            <span className="absolute -bottom-6 right-2 animate-bounce text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-white/95 dark:bg-zinc-800/95 px-2 py-0.5 rounded-full shadow border border-emerald-200">
              +{xpGain} XP
            </span>
          )}
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          aria-label="Alternar áudio"
          title={soundEnabled ? "Desativar sons" : "Ativar sons"}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-300 shadow-lg border border-sky-100 dark:border-zinc-800 hover:bg-sky-50 dark:hover:bg-zinc-800 transition active:scale-95"
        >
          {soundEnabled ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-2 0L6.71 8H3v8h3.71L12 20.77V3.23zm4 8.77c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-zinc-400" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          )}
        </button>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          title="Reiniciar jornada no balcão"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-300 shadow-lg border border-sky-100 dark:border-zinc-800 hover:bg-sky-50 dark:hover:bg-zinc-800 transition active:scale-95"
        >
          <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </header>
  );
}
