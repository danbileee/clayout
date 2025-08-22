import { Tables } from "./supabase";

export interface SendEmailDto
  extends Pick<Tables<"emails">, "to" | "subject" | "template"> {
  context?: Record<string, string>;
}

export interface RecordEmailOpenDto
  extends Pick<Tables<"email_open_events">, "emailId"> {}

export interface RecordEmailClickDto
  extends Pick<Tables<"email_click_events">, "link" | "buttonText"> {}
