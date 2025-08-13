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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      email_open_events: {
        Row: {
          created_at: string
          emailId: number | null
          id: number
          opened_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          emailId?: number | null
          id?: number
          opened_at: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          emailId?: number | null
          id?: number
          opened_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_b24da482ee134d7532fd27c747d"
            columns: ["emailId"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          context: Json | null
          created_at: string
          error_log: string | null
          failed_at: string | null
          id: number
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
      site_blocks: {
        Row: {
          created_at: string
          data: Json | null
          id: number
          name: string
          pageId: number
          slug: string
          type: Database["public"]["Enums"]["site_blocks_type_enum"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: number
          name: string
          pageId: number
          slug: string
          type?: Database["public"]["Enums"]["site_blocks_type_enum"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: number
          name?: string
          pageId?: number
          slug?: string
          type?: Database["public"]["Enums"]["site_blocks_type_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_04adc5fbb09eb32db0c746eee20"
            columns: ["pageId"]
            isOneToOne: false
            referencedRelation: "site_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      site_domains: {
        Row: {
          created_at: string
          hostname: string
          id: number
          is_verified: boolean
          siteId: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          hostname: string
          id?: number
          is_verified?: boolean
          siteId: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          hostname?: string
          id?: number
          is_verified?: boolean
          siteId?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_b64cc9e1f0a969eea87380c462d"
            columns: ["siteId"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_pages: {
        Row: {
          category: Database["public"]["Enums"]["site_pages_category_enum"]
          created_at: string
          id: number
          name: string
          siteId: number
          slug: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["site_pages_category_enum"]
          created_at?: string
          id?: number
          name: string
          siteId: number
          slug: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["site_pages_category_enum"]
          created_at?: string
          id?: number
          name?: string
          siteId?: number
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_4029d13e5c69a098b2076c761c3"
            columns: ["siteId"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_releases: {
        Row: {
          created_at: string
          html_snapshot: string
          id: number
          published_at: string | null
          siteId: number
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          html_snapshot: string
          id?: number
          published_at?: string | null
          siteId: number
          updated_at?: string
          version: number
        }
        Update: {
          created_at?: string
          html_snapshot?: string
          id?: number
          published_at?: string | null
          siteId?: number
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "FK_5c72a2f81f04dd6c238771c591f"
            columns: ["siteId"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          authorId: number
          category: Database["public"]["Enums"]["sites_category_enum"]
          created_at: string
          id: number
          last_published_at: string | null
          meta: Json | null
          name: string
          slug: string
          status: Database["public"]["Enums"]["sites_status_enum"]
          updated_at: string
        }
        Insert: {
          authorId: number
          category?: Database["public"]["Enums"]["sites_category_enum"]
          created_at?: string
          id?: number
          last_published_at?: string | null
          meta?: Json | null
          name: string
          slug: string
          status?: Database["public"]["Enums"]["sites_status_enum"]
          updated_at?: string
        }
        Update: {
          authorId?: number
          category?: Database["public"]["Enums"]["sites_category_enum"]
          created_at?: string
          id?: number
          last_published_at?: string | null
          meta?: Json | null
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["sites_status_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_a5c4bd58c29138cf04e170dfa67"
            columns: ["authorId"]
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
      site_blocks_type_enum: "None" | "Text" | "Image" | "Button"
      site_pages_category_enum: "Static" | "List" | "Article"
      sites_category_enum:
        | "None"
        | "Blog"
        | "Newsletter"
        | "Portfolio"
        | "Hyperlink"
        | "Commerce"
      sites_status_enum: "Draft" | "Published" | "Reviewing" | "Fixing"
      users_role_enum: "None" | "Guest" | "Registrant" | "User" | "Admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      site_blocks_type_enum: ["None", "Text", "Image", "Button"],
      site_pages_category_enum: ["Static", "List", "Article"],
      sites_category_enum: [
        "None",
        "Blog",
        "Newsletter",
        "Portfolio",
        "Hyperlink",
        "Commerce",
      ],
      sites_status_enum: ["Draft", "Published", "Reviewing", "Fixing"],
      users_role_enum: ["None", "Guest", "Registrant", "User", "Admin"],
    },
  },
} as const

