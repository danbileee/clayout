import { z } from "zod";

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
});
