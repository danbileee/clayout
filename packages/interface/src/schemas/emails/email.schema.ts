import { z, ZodType } from "zod";
import { Tables } from "../../types";

const emailShape = {
  to: z.string().email(),
  subject: z.string(),
  template: z.string(),
  context: z.record(z.string(), z.string()).optional(),
} satisfies Record<
  keyof Pick<Tables<"emails">, "to" | "subject" | "template" | "context">,
  ZodType
>;

export const SendEmailSchema = z.object(emailShape);

const emailClickEventShape = {
  link: z.string(),
  buttonText: z.string(),
} satisfies Record<
  keyof Pick<Tables<"email_click_events">, "link" | "buttonText">,
  ZodType
>;

export const RecordEmailClickSchema = z.object(emailClickEventShape);
