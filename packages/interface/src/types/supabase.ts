export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          extensions?: Json
          variables?: Json
          query?: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      counters: {
        Row: {
          count: number
          created_at: string
          id: number
          updated_at: string
          value: string | null
        }
        Insert: {
          count?: number
          created_at?: string
          id?: number
          updated_at?: string
          value?: string | null
        }
        Update: {
          count?: number
          created_at?: string
          id?: number
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      email_click_events: {
        Row: {
          button_text: string
          clicked_at: string
          created_at: string
          emailId: number | null
          id: number
          link: string
          updated_at: string
        }
        Insert: {
          button_text: string
          clicked_at: string
          created_at?: string
          emailId?: number | null
          id?: number
          link: string
          updated_at?: string
        }
        Update: {
          button_text?: string
          clicked_at?: string
          created_at?: string
          emailId?: number | null
          id?: number
          link?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_0481f77b1f72ae9917dc4032169"
            columns: ["emailId"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      email_clicks: {
        Row: {
          buttonText: string
          clickedAt: string
          created_at: string
          id: number
          link: string
          updated_at: string
        }
        Insert: {
          buttonText: string
          clickedAt: string
          created_at?: string
          id?: number
          link: string
          updated_at?: string
        }
        Update: {
          buttonText?: string
          clickedAt?: string
          created_at?: string
          id?: number
          link?: string
          updated_at?: string
        }
        Relationships: []
      }
      emails: {
        Row: {
          context: Json | null
          created_at: string
          error_log: string | null
          failed_at: string | null
          id: number
          opened_at: string | null
          sent_at: string | null
          subject: string
          template: string
          to: string
          updated_at: string
          userId: number | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          error_log?: string | null
          failed_at?: string | null
          id?: number
          opened_at?: string | null
          sent_at?: string | null
          subject: string
          template: string
          to: string
          updated_at?: string
          userId?: number | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          error_log?: string | null
          failed_at?: string | null
          id?: number
          opened_at?: string | null
          sent_at?: string | null
          subject?: string
          template?: string
          to?: string
          updated_at?: string
          userId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "FK_1c41bc3d329b0edc905b6409dba"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: number
          password: string
          role: Database["public"]["Enums"]["users_role_enum"]
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          password: string
          role?: Database["public"]["Enums"]["users_role_enum"]
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          password?: string
          role?: Database["public"]["Enums"]["users_role_enum"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_entity_role_enum: "User" | "Admin"
      users_role_enum: "None" | "Guest" | "Registrant" | "User" | "Admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      user_entity_role_enum: ["User", "Admin"],
      users_role_enum: ["None", "Guest", "Registrant", "User", "Admin"],
    },
  },
} as const

