import { z, ZodType } from "zod";
import { Tables } from "../../types";

const userShape = {
  username: z.string().min(1).max(20),
  email: z.string().email(),
  password: z.string().min(3).max(20),
  confirm: z.string().min(1).max(20),
} satisfies Record<
  keyof Pick<Tables<"users">, "username" | "email" | "password">,
  ZodType
> &
  Record<"confirm", ZodType>;

export const UserSchema = z.object(userShape);

export const RegisterSchema = UserSchema.pick({
  username: true,
  email: true,
  password: true,
});

export const SignupSchema = UserSchema.pick({
  username: true,
  email: true,
  password: true,
  confirm: true,
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

export const LoginSchema = UserSchema.pick({ email: true, password: true });

export const ForgotPasswordSchema = UserSchema.pick({ email: true });

export const ResetPasswordSchema = UserSchema.pick({ password: true });
