import { TablesInsert } from "./supabase";

export interface SendEmailDto
  extends Pick<TablesInsert<"emails">, "to" | "subject" | "template"> {
  context?: Record<string, string>;
}

export interface RecordEmailOpenDto
  extends Pick<TablesInsert<"email_open_events">, "emailId"> {}

export interface RecordEmailClickDto
  extends Pick<TablesInsert<"email_click_events">, "link" | "buttonText"> {}
