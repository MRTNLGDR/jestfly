export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      demo_submissions: {
        Row: {
          artist_name: string
          biography: string | null
          created_at: string
          email: string
          file_path: string
          genre: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          social_links: string | null
          status: string
        }
        Insert: {
          artist_name: string
          biography?: string | null
          created_at?: string
          email: string
          file_path: string
          genre?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          social_links?: string | null
          status?: string
        }
        Update: {
          artist_name?: string
          biography?: string | null
          created_at?: string
          email?: string
          file_path?: string
          genre?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          social_links?: string | null
          status?: string
        }
        Relationships: []
      }
      models: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          model_type: Database["public"]["Enums"]["model_type"]
          name: string
          params: Json | null
          thumbnail_url: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          model_type: Database["public"]["Enums"]["model_type"]
          name: string
          params?: Json | null
          thumbnail_url?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          model_type?: Database["public"]["Enums"]["model_type"]
          name?: string
          params?: Json | null
          thumbnail_url?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_archived: boolean | null
          is_pinned: boolean | null
          links: string[] | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          is_pinned?: boolean | null
          links?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean | null
          is_pinned?: boolean | null
          links?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_at_time: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_at_time: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_at_time?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          status: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      press_contacts: {
        Row: {
          created_at: string
          date_requested: string
          email: string
          id: string
          name: string
          outlet: string | null
          role: Database["public"]["Enums"]["press_role"] | null
          verified: boolean
        }
        Insert: {
          created_at?: string
          date_requested: string
          email: string
          id?: string
          name: string
          outlet?: string | null
          role?: Database["public"]["Enums"]["press_role"] | null
          verified?: boolean
        }
        Update: {
          created_at?: string
          date_requested?: string
          email?: string
          id?: string
          name?: string
          outlet?: string | null
          role?: Database["public"]["Enums"]["press_role"] | null
          verified?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          metadata: Json | null
          price: number
          stock: number | null
          title: string
          type: Database["public"]["Enums"]["product_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          price: number
          stock?: number | null
          title: string
          type: Database["public"]["Enums"]["product_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          price?: number
          stock?: number | null
          title?: string
          type?: Database["public"]["Enums"]["product_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          is_verified: boolean | null
          last_login: string | null
          permissions: string[] | null
          preferences: Json | null
          profile_type: Database["public"]["Enums"]["profile_type"]
          roles: string[] | null
          social_links: Json | null
          two_factor_enabled: boolean | null
          updated_at: string
          username: string
          wallet_address: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          email: string
          id: string
          is_verified?: boolean | null
          last_login?: string | null
          permissions?: string[] | null
          preferences?: Json | null
          profile_type?: Database["public"]["Enums"]["profile_type"]
          roles?: string[] | null
          social_links?: Json | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          username: string
          wallet_address?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          is_verified?: boolean | null
          last_login?: string | null
          permissions?: string[] | null
          preferences?: Json | null
          profile_type?: Database["public"]["Enums"]["profile_type"]
          roles?: string[] | null
          social_links?: Json | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          username?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      system_config: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string
          id: string
          level: string
          message: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          level: string
          message: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_type: string
          timestamp: string
          value: number
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_type: string
          timestamp?: string
          value: number
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_type?: string
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      system_tasks: {
        Row: {
          created_at: string
          data: Json | null
          error: string | null
          id: string
          result: Json | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          error?: string | null
          id?: string
          result?: Json | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          error?: string | null
          id?: string
          result?: Json | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "creator" | "user"
      model_type: "diamond" | "sphere" | "torus" | "crystal" | "sketchfab"
      press_role: "journalist" | "blogger" | "editor" | "podcaster" | "other"
      product_type: "nft" | "music" | "merch" | "collectible"
      profile_type: "fan" | "artist" | "admin" | "collaborator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
