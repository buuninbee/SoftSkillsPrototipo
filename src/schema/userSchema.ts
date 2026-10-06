import { z } from "zod";

export const userRegistrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome de aventureiro deve ter no mínimo 2 caracteres"),
  email: z
    .string()
    .trim()
    .email("Por favor, informe um endereço de e-mail válido"),
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
export type UserData = UserRegistrationData;
