"use client";

import Image from "next/image";

interface QuestIconProps {
  icon?: any;
  className?: string;
  size?: number;
  alt?: string;
}

export default function QuestIcon({
  icon,
  className = "",
  size = 48,
  alt = "Ícone da Missão",
}: QuestIconProps) {
  if (!icon) {
    return null;
  }

  if (typeof icon === "string") {
    return <span className={className}>{icon}</span>;
  }

  const src = icon?.src || icon;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="w-full h-full object-contain hover:scale-110 hover:-rotate-3 cursor-pointer"
      />
    </div>
  );
}
