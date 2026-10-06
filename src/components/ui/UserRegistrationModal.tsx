"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userRegistrationSchema,
  UserRegistrationData,
  UserData,
} from "@/schema/userSchema";
import BonecoCadastro from "@/assets/Boneco-cadastro.svg";
import Image from "next/image";

export type { UserData, UserRegistrationData };

interface UserRegistrationModalProps {
  isOpen: boolean;
  onSubmit: (data: UserData) => void;
}

export default function UserRegistrationModal({
  isOpen,
  onSubmit,
}: UserRegistrationModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationSchema),
    mode: "onTouched",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#fffdf5] border-2 border-amber-600 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-800">
        {/* Top Gold Gradient Bar */}
        <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-500" />

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-18 h-18 rounded-2xl flex items-center justify-center text-3xl ">
            <Image
              src={BonecoCadastro}
              width={80}
              height={80}
              alt="Um boneco carregando uma tocha"
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Registro do Aventureiro
            </h2>
          </div>
        </div>

        {/* Narrative Intro */}
        <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 italic">
          Saudações, aventureiro(a)! Antes de dares o primeiro passo na tua
          jornada de despertar e revelares os teus verdadeiros atributos, deves
          selar o teu destino. Grava o teu nome no Tomo Sagrado da Guilda e
          prepara-te para forjar a tua lenda!
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit((data) => onSubmit(data))}
          noValidate
          className="flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Nome do Aventureiro <span className="text-amber-600">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Ex: Alex"
              className={`w-full bg-amber-50/50 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-inner ${
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                  : "border-amber-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              E-mail de Contato <span className="text-amber-600">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="alex@guilda.com"
              className={`w-full bg-amber-50/50 border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all shadow-inner ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
                  : "border-amber-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full py-3 px-5 bg-[#AB4C06] hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Iniciar Jornada</span>
          </button>
        </form>
      </div>
    </div>
  );
}
