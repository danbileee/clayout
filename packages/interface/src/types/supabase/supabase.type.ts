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
      assets: {
        Row: {
          createdAt: Date
          id: number
          order: number
          path: string
          targetId: number
          targetType: Database["public"]["Enums"]["asset_types_enum"]
          updatedAt: Date
        }
        Insert: {
          createdAt: Date
          id: number
          order?: number
          path: string
          targetId: number
          targetType: Database["public"]["Enums"]["asset_types_enum"]
          updatedAt: Date
        }
        Update: {
          createdAt?: Date
          id: number
          order?: number
          path?: string
          targetId?: number
          targetType?: Database["public"]["Enums"]["asset_types_enum"]
          updatedAt?: Date
        }
        Relationships: []
      }
      counters: {
        Row: {
          count: number
          createdAt: Date
          id: number
          updatedAt: Date
          value: string | null
        }
        Insert: {
          count?: number
          createdAt: Date
          id: number
          updatedAt: Date
          value?: string | null
        }
        Update: {
          count?: number
          createdAt?: Date
          id: number
          updatedAt?: Date
          value?: string | null
        }
        Relationships: []
      }
      email_click_events: {
        Row: {
          buttonText: string
          clickedAt: Date
          createdAt: Date
          emailId: number | null
          id: number
          link: string
          updatedAt: Date
        }
        Insert: {
          buttonText: string
          clickedAt: Date
          createdAt: Date
          emailId?: number | null
          id: number
          link: string
          updatedAt: Date
        }
        Update: {
          buttonText?: string
          clickedAt?: Date
          createdAt?: Date
          emailId?: number | null
          id: number
          link?: string
          updatedAt?: Date
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
          createdAt: Date
          emailId: number | null
          id: number
          openedAt: Date
          updatedAt: Date
        }
        Insert: {
          createdAt: Date
          emailId?: number | null
          id: number
          openedAt: Date
          updatedAt: Date
        }
        Update: {
          createdAt?: Date
          emailId?: number | null
          id: number
          openedAt?: Date
          updatedAt?: Date
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
          createdAt: Date
          errorLog: string | null
          failedAt: Date | null
          id: number
          sentAt: Date | null
          subject: string
          template: string
          to: string
          updatedAt: Date
          userId: number | null
        }
        Insert: {
          context?: Json | null
          createdAt: Date
          errorLog?: string | null
          failedAt?: Date | null
          id: number
          sentAt?: Date | null
          subject: string
          template: string
          to: string
          updatedAt: Date
          userId?: number | null
        }
        Update: {
          context?: Json | null
          createdAt?: Date
          errorLog?: string | null
          failedAt?: Date | null
          id: number
          sentAt?: Date | null
          subject?: string
          template?: string
          to?: string
          updatedAt?: Date
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
          containerStyle: Json | null
          createdAt: Date
          data: Json | null
          id: number
          name: string
          pageId: number
          siteId: number
          slug: string
          style: Json | null
          type: Database["public"]["Enums"]["site_blocks_type_enum"]
          updatedAt: Date
        }
        Insert: {
          containerStyle?: Json | null
          createdAt: Date
          data?: Json | null
          id: number
          name: string
          pageId: number
          siteId: number
          slug: string
          style?: Json | null
          type?: Database["public"]["Enums"]["site_blocks_type_enum"]
          updatedAt: Date
        }
        Update: {
          containerStyle?: Json | null
          createdAt?: Date
          data?: Json | null
          id: number
          name?: string
          pageId?: number
          siteId?: number
          slug?: string
          style?: Json | null
          type?: Database["public"]["Enums"]["site_blocks_type_enum"]
          updatedAt?: Date
        }
        Relationships: [
          {
            foreignKeyName: "FK_site_blocks_page"
            columns: ["pageId"]
            isOneToOne: false
            referencedRelation: "site_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FK_site_blocks_site"
            columns: ["siteId"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_domains: {
        Row: {
          createdAt: Date
          hostname: string
          id: number
          isVerified: boolean
          siteId: number
          updatedAt: Date
        }
        Insert: {
          createdAt: Date
          hostname: string
          id: number
          isVerified?: boolean
          siteId: number
          updatedAt: Date
        }
        Update: {
          createdAt?: Date
          hostname?: string
          id: number
          isVerified?: boolean
          siteId?: number
          updatedAt?: Date
        }
        Relationships: [
          {
            foreignKeyName: "FK_site_domains_site"
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
          createdAt: Date
          id: number
          meta: Json | null
          name: string
          siteId: number
          slug: string
          updatedAt: Date
        }
        Insert: {
          category?: Database["public"]["Enums"]["site_pages_category_enum"]
          createdAt: Date
          id: number
          meta?: Json | null
          name: string
          siteId: number
          slug: string
          updatedAt: Date
        }
        Update: {
          category?: Database["public"]["Enums"]["site_pages_category_enum"]
          createdAt?: Date
          id: number
          meta?: Json | null
          name?: string
          siteId?: number
          slug?: string
          updatedAt?: Date
        }
        Relationships: [
          {
            foreignKeyName: "FK_site_pages_site"
            columns: ["siteId"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_releases: {
        Row: {
          createdAt: Date
          htmlSnapshot: string
          id: number
          publishedAt: string | null
          siteId: number
          updatedAt: Date
          version: string
        }
        Insert: {
          createdAt: Date
          htmlSnapshot: string
          id: number
          publishedAt?: string | null
          siteId: number
          updatedAt: Date
          version: string
        }
        Update: {
          createdAt?: Date
          htmlSnapshot?: string
          id: number
          publishedAt?: string | null
          siteId?: number
          updatedAt?: Date
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "FK_site_releases_site"
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
          createdAt: Date
          id: number
          lastPublishedAt: Date | null
          meta: Json | null
          name: string
          slug: string
          status: Database["public"]["Enums"]["sites_status_enum"]
          updatedAt: Date
        }
        Insert: {
          authorId: number
          category?: Database["public"]["Enums"]["sites_category_enum"]
          createdAt: Date
          id: number
          lastPublishedAt?: Date | null
          meta?: Json | null
          name: string
          slug: string
          status?: Database["public"]["Enums"]["sites_status_enum"]
          updatedAt: Date
        }
        Update: {
          authorId?: number
          category?: Database["public"]["Enums"]["sites_category_enum"]
          createdAt?: Date
          id: number
          lastPublishedAt?: Date | null
          meta?: Json | null
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["sites_status_enum"]
          updatedAt?: Date
        }
        Relationships: [
          {
            foreignKeyName: "FK_sites_author"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          createdAt: Date
          email: string
          id: number
          password: string
          role: Database["public"]["Enums"]["users_role_enum"]
          updatedAt: Date
          username: string
        }
        Insert: {
          createdAt: Date
          email: string
          id: number
          password: string
          role?: Database["public"]["Enums"]["users_role_enum"]
          updatedAt: Date
          username: string
        }
        Update: {
          createdAt?: Date
          email?: string
          id: number
          password?: string
          role?: Database["public"]["Enums"]["users_role_enum"]
          updatedAt?: Date
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
      asset_types_enum: "Site" | "SitePage" | "SiteBlock"
      site_blocks_type_enum: "None" | "Text" | "Image" | "Button"
      site_pages_category_enum: "Static" | "List" | "Article"
      sites_category_enum:
        | "None"
        | "Blog"
        | "Landing Page"
        | "Newsletter"
        | "Portfolio"
        | "Hyperlink"
        | "Commerce"
      sites_status_enum:
        | "Draft"
        | "Published"
        | "Reviewing"
        | "Updating"
        | "Error"
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
      asset_types_enum: ["Site", "SitePage", "SiteBlock"],
      site_blocks_type_enum: ["None", "Text", "Image", "Button"],
      site_pages_category_enum: ["Static", "List", "Article"],
      sites_category_enum: [
        "None",
        "Blog",
        "Landing Page",
        "Newsletter",
        "Portfolio",
        "Hyperlink",
        "Commerce",
      ],
      sites_status_enum: [
        "Draft",
        "Published",
        "Reviewing",
        "Updating",
        "Error",
      ],
      users_role_enum: ["None", "Guest", "Registrant", "User", "Admin"],
    },
  },
} as const

