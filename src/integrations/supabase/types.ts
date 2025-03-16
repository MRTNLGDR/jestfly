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
      achievements: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          level: number | null
          name: string
          requirement_count: number | null
          requirement_type: string | null
          reward_amount: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          level?: number | null
          name: string
          requirement_count?: number | null
          requirement_type?: string | null
          reward_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          level?: number | null
          name?: string
          requirement_count?: number | null
          requirement_type?: string | null
          reward_amount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      affiliate_program: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string | null
          referred_id: string
          referrer_id: string
          reward_amount: number | null
          reward_claimed: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code?: string | null
          referred_id: string
          referrer_id: string
          reward_amount?: number | null
          reward_claimed?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string | null
          referred_id?: string
          referrer_id?: string
          reward_amount?: number | null
          reward_claimed?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_program_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_program_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      airdrop_submissions: {
        Row: {
          created_at: string | null
          id: string
          proof_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reward_paid: boolean | null
          status: string | null
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          proof_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reward_paid?: boolean | null
          status?: string | null
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          proof_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reward_paid?: boolean | null
          status?: string | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "airdrop_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "airdrop_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "airdrop_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "airdrop_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      airdrop_tasks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          platform: string | null
          proof_required: boolean | null
          reward_amount: number
          task_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          platform?: string | null
          proof_required?: boolean | null
          reward_amount: number
          task_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          platform?: string | null
          proof_required?: boolean | null
          reward_amount?: number
          task_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_aggregates: {
        Row: {
          dimension: string | null
          dimension_value: string | null
          id: string
          metric_name: string
          period_end: string
          period_start: string
          updated_at: string | null
          value: number
        }
        Insert: {
          dimension?: string | null
          dimension_value?: string | null
          id?: string
          metric_name: string
          period_end: string
          period_start: string
          updated_at?: string | null
          value: number
        }
        Update: {
          dimension?: string | null
          dimension_value?: string | null
          id?: string
          metric_name?: string
          period_end?: string
          period_start?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          client_info: Json | null
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          path: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          client_info?: Json | null
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          path?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          client_info?: Json | null
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          path?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      availability: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          is_available: boolean | null
          resource_id: string
          resource_type: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          is_available?: boolean | null
          resource_id: string
          resource_type: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          resource_id?: string
          resource_type?: string
          start_time?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_type: string
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          details: string | null
          end_time: string
          id: string
          location: string | null
          notes: string | null
          price: number
          resource_id: string | null
          resource_type: string | null
          start_time: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_type: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          details?: string | null
          end_time: string
          id?: string
          location?: string | null
          notes?: string | null
          price: number
          resource_id?: string | null
          resource_type?: string | null
          start_time: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_type?: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          details?: string | null
          end_time?: string
          id?: string
          location?: string | null
          notes?: string | null
          price?: number
          resource_id?: string | null
          resource_type?: string | null
          start_time?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_calendar_events: {
        Row: {
          all_day: boolean | null
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string
          id: string
          location: string | null
          metadata: Json | null
          project_id: string
          start_time: string
          task_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          all_day?: boolean | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          metadata?: Json | null
          project_id: string
          start_time: string
          task_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          all_day?: boolean | null
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          metadata?: Json | null
          project_id?: string
          start_time?: string
          task_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canvas_calendar_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "canvas_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canvas_calendar_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "canvas_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_connections: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          label: string | null
          metadata: Json | null
          project_id: string
          source_id: string
          style: Json | null
          target_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          label?: string | null
          metadata?: Json | null
          project_id: string
          source_id: string
          style?: Json | null
          target_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          label?: string | null
          metadata?: Json | null
          project_id?: string
          source_id?: string
          style?: Json | null
          target_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canvas_connections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "canvas_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canvas_connections_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "canvas_elements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canvas_connections_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "canvas_elements"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_elements: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          element_type: Database["public"]["Enums"]["canvas_element_type"]
          id: string
          metadata: Json | null
          position: Json
          project_id: string
          size: Json | null
          style: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          element_type: Database["public"]["Enums"]["canvas_element_type"]
          id?: string
          metadata?: Json | null
          position?: Json
          project_id: string
          size?: Json | null
          style?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          element_type?: Database["public"]["Enums"]["canvas_element_type"]
          id?: string
          metadata?: Json | null
          position?: Json
          project_id?: string
          size?: Json | null
          style?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canvas_elements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "canvas_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_history: {
        Row: {
          comment: string | null
          created_at: string | null
          created_by: string | null
          id: string
          project_id: string
          snapshot: Json
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          project_id: string
          snapshot: Json
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          project_id?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "canvas_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "canvas_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_projects: {
        Row: {
          collaborators: string[] | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          is_template: boolean | null
          metadata: Json | null
          tags: string[] | null
          template_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          collaborators?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          metadata?: Json | null
          tags?: string[] | null
          template_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          collaborators?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          metadata?: Json | null
          tags?: string[] | null
          template_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "canvas_projects_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "canvas_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_sharing: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          permission: string
          project_id: string
          token: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          permission?: string
          project_id: string
          token?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          permission?: string
          project_id?: string
          token?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canvas_sharing_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "canvas_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          element_id: string | null
          id: string
          metadata: Json | null
          priority: string | null
          project_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          element_id?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          project_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          element_id?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          project_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canvas_tasks_element_id_fkey"
            columns: ["element_id"]
            isOneToOne: false
            referencedRelation: "canvas_elements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "canvas_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "canvas_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      canvas_templates: {
        Row: {
          category: string | null
          connections: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          elements: Json | null
          id: string
          is_official: boolean | null
          is_public: boolean | null
          metadata: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          connections?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          elements?: Json | null
          id?: string
          is_official?: boolean | null
          is_public?: boolean | null
          metadata?: Json | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          connections?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          elements?: Json | null
          id?: string
          is_official?: boolean | null
          is_public?: boolean | null
          metadata?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string
          comments_count: number | null
          content: string
          created_at: string | null
          id: string
          is_featured: boolean | null
          is_pinned: boolean | null
          likes_count: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          comments_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_audio_analysis: {
        Row: {
          average_db: number | null
          bpm: number | null
          created_at: string
          duration_seconds: number | null
          id: string
          key: string | null
          peak_db: number | null
          spectrum_data: Json | null
          submission_id: string
          waveform_data: Json | null
        }
        Insert: {
          average_db?: number | null
          bpm?: number | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          key?: string | null
          peak_db?: number | null
          spectrum_data?: Json | null
          submission_id: string
          waveform_data?: Json | null
        }
        Update: {
          average_db?: number | null
          bpm?: number | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          key?: string | null
          peak_db?: number | null
          spectrum_data?: Json | null
          submission_id?: string
          waveform_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_audio_analysis_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "demo_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_audio_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          is_private: boolean
          is_resolved: boolean
          submission_id: string
          timestamp_seconds: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          is_private?: boolean
          is_resolved?: boolean
          submission_id: string
          timestamp_seconds: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          is_private?: boolean
          is_resolved?: boolean
          submission_id?: string
          timestamp_seconds?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_audio_comments_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "demo_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      demo_feedback: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_public: boolean
          rating: number
          reviewer_id: string
          submission_id: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          rating: number
          reviewer_id: string
          submission_id: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          rating?: number
          reviewer_id?: string
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_feedback_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "demo_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_feedback_criteria: {
        Row: {
          comment: string | null
          created_at: string
          criterion_name: string
          feedback_id: string
          id: string
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          criterion_name: string
          feedback_id: string
          id?: string
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          criterion_name?: string
          feedback_id?: string
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "demo_feedback_criteria_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "demo_feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_shares: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean
          share_token: string
          submission_id: string
          view_count: number
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          share_token: string
          submission_id: string
          view_count?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          share_token?: string
          submission_id?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "demo_shares_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "demo_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_submission_categories: {
        Row: {
          category_id: string
          submission_id: string
        }
        Insert: {
          category_id: string
          submission_id: string
        }
        Update: {
          category_id?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_submission_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "demo_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_submission_categories_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "demo_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_submissions: {
        Row: {
          additional_audio_urls: string[] | null
          artist_name: string
          biography: string | null
          categories: Json | null
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
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          additional_audio_urls?: string[] | null
          artist_name: string
          biography?: string | null
          categories?: Json | null
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
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          additional_audio_urls?: string[] | null
          artist_name?: string
          biography?: string | null
          categories?: Json | null
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
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      digital_products: {
        Row: {
          created_at: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_active: boolean
          product_id: string
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean
          product_id: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean
          product_id?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      event_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_method: string
          registration_id: string
          status: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_method?: string
          registration_id: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_method?: string
          registration_id?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_payments_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "event_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          checked_in_at: string | null
          event_id: string
          id: string
          metadata: Json | null
          payment_id: string | null
          registration_date: string | null
          status: Database["public"]["Enums"]["registration_status"]
          ticket_code: string | null
          user_id: string
        }
        Insert: {
          checked_in_at?: string | null
          event_id: string
          id?: string
          metadata?: Json | null
          payment_id?: string | null
          registration_date?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          ticket_code?: string | null
          user_id: string
        }
        Update: {
          checked_in_at?: string | null
          event_id?: string
          id?: string
          metadata?: Json | null
          payment_id?: string | null
          registration_date?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          ticket_code?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_schedule: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          event_id: string
          id: string
          location: string | null
          speaker: string | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          event_id: string
          id?: string
          location?: string | null
          speaker?: string | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          event_id?: string
          id?: string
          location?: string | null
          speaker?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_schedule_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: Database["public"]["Enums"]["event_category"]
          cover_image: string | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          is_featured: boolean | null
          is_online: boolean | null
          jest_coin_price: number | null
          location: string | null
          max_attendees: number | null
          metadata: Json | null
          online_url: string | null
          organizer_id: string
          price: number | null
          start_date: string
          status: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["event_category"]
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_featured?: boolean | null
          is_online?: boolean | null
          jest_coin_price?: number | null
          location?: string | null
          max_attendees?: number | null
          metadata?: Json | null
          online_url?: string | null
          organizer_id: string
          price?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["event_category"]
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_featured?: boolean | null
          is_online?: boolean | null
          jest_coin_price?: number | null
          location?: string | null
          max_attendees?: number | null
          metadata?: Json | null
          online_url?: string | null
          organizer_id?: string
          price?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      level_definitions: {
        Row: {
          benefits: Json | null
          created_at: string | null
          id: string
          level: number
          reward_amount: number | null
          xp_required: number
        }
        Insert: {
          benefits?: Json | null
          created_at?: string | null
          id?: string
          level: number
          reward_amount?: number | null
          xp_required: number
        }
        Update: {
          benefits?: Json | null
          created_at?: string | null
          id?: string
          level?: number
          reward_amount?: number | null
          xp_required?: number
        }
        Relationships: []
      }
      live_streams: {
        Row: {
          channel_id: string
          chat_enabled: boolean | null
          created_at: string | null
          description: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          peak_viewers: number | null
          playback_url: string | null
          replay_available: boolean | null
          scheduled_start: string | null
          started_at: string | null
          status: string
          stream_key: string | null
          stream_type: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          viewer_count: number | null
        }
        Insert: {
          channel_id: string
          chat_enabled?: boolean | null
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          peak_viewers?: number | null
          playback_url?: string | null
          replay_available?: boolean | null
          scheduled_start?: string | null
          started_at?: string | null
          status?: string
          stream_key?: string | null
          stream_type?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          viewer_count?: number | null
        }
        Update: {
          channel_id?: string
          chat_enabled?: boolean | null
          created_at?: string | null
          description?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          peak_viewers?: number | null
          playback_url?: string | null
          replay_available?: boolean | null
          scheduled_start?: string | null
          started_at?: string | null
          status?: string
          stream_key?: string | null
          stream_type?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          viewer_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "live_streams_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "stream_channels"
            referencedColumns: ["id"]
          },
        ]
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
      nft_collections: {
        Row: {
          banner_url: string | null
          category: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          is_verified: boolean | null
          metadata: Json | null
          name: string
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          category?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          is_verified?: boolean | null
          metadata?: Json | null
          name: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          category?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          is_verified?: boolean | null
          metadata?: Json | null
          name?: string
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nft_collections_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nft_offers: {
        Row: {
          amount: number
          bidder_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          message: string | null
          nft_id: string
          status: string | null
        }
        Insert: {
          amount: number
          bidder_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message?: string | null
          nft_id: string
          status?: string | null
        }
        Update: {
          amount?: number
          bidder_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message?: string | null
          nft_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nft_offers_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nft_offers_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
        ]
      }
      nft_transactions: {
        Row: {
          buyer_id: string
          id: string
          nft_id: string
          price: number
          royalty_paid: number | null
          seller_id: string
          transaction_date: string | null
          transaction_type: string | null
        }
        Insert: {
          buyer_id: string
          id?: string
          nft_id: string
          price: number
          royalty_paid?: number | null
          seller_id: string
          transaction_date?: string | null
          transaction_type?: string | null
        }
        Update: {
          buyer_id?: string
          id?: string
          nft_id?: string
          price?: number
          royalty_paid?: number | null
          seller_id?: string
          transaction_date?: string | null
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nft_transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nft_transactions_nft_id_fkey"
            columns: ["nft_id"]
            isOneToOne: false
            referencedRelation: "nfts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nft_transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nfts: {
        Row: {
          collection_id: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          editions_available: number | null
          editions_count: number | null
          id: string
          is_for_sale: boolean | null
          media_url: string
          metadata: Json | null
          owner_id: string
          price: number | null
          royalty_percentage: number | null
          thumbnail_url: string | null
          title: string
          token_id: string | null
          type: Database["public"]["Enums"]["nft_type"]
          updated_at: string | null
        }
        Insert: {
          collection_id?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          editions_available?: number | null
          editions_count?: number | null
          id?: string
          is_for_sale?: boolean | null
          media_url: string
          metadata?: Json | null
          owner_id: string
          price?: number | null
          royalty_percentage?: number | null
          thumbnail_url?: string | null
          title: string
          token_id?: string | null
          type?: Database["public"]["Enums"]["nft_type"]
          updated_at?: string | null
        }
        Update: {
          collection_id?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          editions_available?: number | null
          editions_count?: number | null
          id?: string
          is_for_sale?: boolean | null
          media_url?: string
          metadata?: Json | null
          owner_id?: string
          price?: number | null
          royalty_percentage?: number | null
          thumbnail_url?: string | null
          title?: string
          token_id?: string | null
          type?: Database["public"]["Enums"]["nft_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_nft_collection"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "nft_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfts_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          metadata: Json | null
          notes: string | null
          payment_details: Json | null
          payment_method: string | null
          shipping_address: Json | null
          status: string
          total: number
          tracking_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          shipping_address?: Json | null
          status?: string
          total: number
          tracking_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          payment_details?: Json | null
          payment_method?: string | null
          shipping_address?: Json | null
          status?: string
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_intents: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          order_id: string
          payment_method: string | null
          status: string
          stripe_client_secret: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          order_id: string
          payment_method?: string | null
          status?: string
          stripe_client_secret?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          order_id?: string
          payment_method?: string | null
          status?: string
          stripe_client_secret?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_category_mappings: {
        Row: {
          category_id: string
          product_id: string
        }
        Insert: {
          category_id: string
          product_id: string
        }
        Update: {
          category_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_category_mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_category_mappings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_ratings: {
        Row: {
          created_at: string
          id: string
          product_id: string
          rating: number
          review: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          rating: number
          review?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          review?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_ratings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          average_rating: number | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_digital: boolean | null
          is_featured: boolean | null
          jest_coin_price: number | null
          metadata: Json | null
          price: number
          rating_count: number | null
          stock: number | null
          title: string
          type: Database["public"]["Enums"]["product_type"]
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          jest_coin_price?: number | null
          metadata?: Json | null
          price: number
          rating_count?: number | null
          stock?: number | null
          title: string
          type: Database["public"]["Enums"]["product_type"]
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          jest_coin_price?: number | null
          metadata?: Json | null
          price?: number
          rating_count?: number | null
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
      related_products: {
        Row: {
          created_at: string
          id: string
          product_id: string
          related_product_id: string
          relation_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          related_product_id: string
          relation_type?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          related_product_id?: string
          relation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "related_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_activities: {
        Row: {
          activity_type: string
          cooldown_minutes: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          required_count: number | null
          reward_amount: number
          updated_at: string | null
        }
        Insert: {
          activity_type: string
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          required_count?: number | null
          reward_amount: number
          updated_at?: string | null
        }
        Update: {
          activity_type?: string
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          required_count?: number | null
          reward_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      staking_plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number
          id: string
          interest_rate: number
          is_active: boolean | null
          minimum_amount: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days: number
          id?: string
          interest_rate: number
          is_active?: boolean | null
          minimum_amount?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          interest_rate?: number
          is_active?: boolean | null
          minimum_amount?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      stream_channels: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          created_at: string | null
          description: string | null
          follower_count: number | null
          id: string
          is_verified: boolean | null
          name: string
          settings: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          follower_count?: number | null
          id?: string
          is_verified?: boolean | null
          name: string
          settings?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          follower_count?: number | null
          id?: string
          is_verified?: boolean | null
          name?: string
          settings?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_channels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_deleted: boolean | null
          is_highlighted: boolean | null
          message: string
          stream_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_highlighted?: boolean | null
          message: string
          stream_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_highlighted?: boolean | null
          message?: string
          stream_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_chat_messages_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "live_streams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_donations: {
        Row: {
          amount: number
          created_at: string | null
          donor_id: string
          id: string
          message: string | null
          stream_id: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          donor_id: string
          id?: string
          message?: string | null
          stream_id: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          donor_id?: string
          id?: string
          message?: string | null
          stream_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stream_donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_donations_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "live_streams"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_metrics: {
        Row: {
          average_watch_time: number | null
          chat_message_count: number | null
          donation_amount: number | null
          id: string
          metrics_data: Json | null
          peak_viewers: number | null
          stream_id: string
          timestamp: string | null
          unique_chatters: number | null
          viewer_count: number | null
        }
        Insert: {
          average_watch_time?: number | null
          chat_message_count?: number | null
          donation_amount?: number | null
          id?: string
          metrics_data?: Json | null
          peak_viewers?: number | null
          stream_id: string
          timestamp?: string | null
          unique_chatters?: number | null
          viewer_count?: number | null
        }
        Update: {
          average_watch_time?: number | null
          chat_message_count?: number | null
          donation_amount?: number | null
          id?: string
          metrics_data?: Json | null
          peak_viewers?: number | null
          stream_id?: string
          timestamp?: string | null
          unique_chatters?: number | null
          viewer_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stream_metrics_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "live_streams"
            referencedColumns: ["id"]
          },
        ]
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
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_downloads: {
        Row: {
          digital_product_id: string
          download_date: string
          id: string
          ip_address: string | null
          order_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          digital_product_id: string
          download_date?: string
          id?: string
          ip_address?: string | null
          order_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          digital_product_id?: string
          download_date?: string
          id?: string
          ip_address?: string | null
          order_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_downloads_digital_product_id_fkey"
            columns: ["digital_product_id"]
            isOneToOne: false
            referencedRelation: "digital_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_downloads_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_levels: {
        Row: {
          experience_points: number | null
          id: string
          level: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          experience_points?: number | null
          id?: string
          level?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          experience_points?: number | null
          id?: string
          level?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_levels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          activity_id: string
          amount: number
          claimed: boolean | null
          claimed_at: string | null
          created_at: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          user_id: string
        }
        Insert: {
          activity_id: string
          amount: number
          claimed?: boolean | null
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          user_id: string
        }
        Update: {
          activity_id?: string
          amount?: number
          claimed?: boolean | null
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "reward_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_staking: {
        Row: {
          amount: number
          created_at: string | null
          end_date: string
          id: string
          interest_earned: number | null
          is_active: boolean | null
          plan_id: string
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          end_date: string
          id?: string
          interest_earned?: number | null
          is_active?: boolean | null
          plan_id: string
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          end_date?: string
          id?: string
          interest_earned?: number | null
          is_active?: boolean | null
          plan_id?: string
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_staking_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "staking_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_staking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_nft_offer: {
        Args: {
          offer_id: string
          owner_id: string
        }
        Returns: Json
      }
      aggregate_daily_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cancel_event_registration: {
        Args: {
          registration_id: string
          user_id: string
        }
        Returns: Json
      }
      check_auth_connectivity: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      check_in_attendee: {
        Args: {
          registration_id: string
          organizer_id: string
        }
        Returns: Json
      }
      check_user_data: {
        Args: {
          user_id: string
        }
        Returns: Json
      }
      check_user_profile_type: {
        Args: {
          required_type: string
        }
        Returns: boolean
      }
      claim_user_reward: {
        Args: {
          p_reward_id: string
        }
        Returns: Json
      }
      count_followers: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      count_following: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      create_demo_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_nft_offer: {
        Args: {
          nft_id: string
          bidder_id: string
          amount: number
          expires_in_hours?: number
          message?: string
        }
        Returns: Json
      }
      create_project_from_template: {
        Args: {
          p_user_id: string
          p_template_id: string
          p_title: string
          p_description?: string
        }
        Returns: string
      }
      create_project_snapshot: {
        Args: {
          p_project_id: string
          p_comment?: string
        }
        Returns: string
      }
      follow_user: {
        Args: {
          follower: string
          following: string
        }
        Returns: undefined
      }
      get_collection_stats: {
        Args: {
          collection_id: string
        }
        Returns: Json
      }
      has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_or_artist: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_or_collaborator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_artist: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_collaborator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_following: {
        Args: {
          follower: string
          following: string
        }
        Returns: boolean
      }
      log_auth_diagnostic: {
        Args: {
          message: string
          metadata?: Json
        }
        Returns: string
      }
      log_user_activity: {
        Args: {
          action: string
          entity_type?: string
          entity_id?: string
          details?: Json
          success?: boolean
        }
        Returns: string
      }
      process_event_payment: {
        Args: {
          event_id: string
          user_id: string
        }
        Returns: Json
      }
      process_stream_donation: {
        Args: {
          p_stream_id: string
          p_donor_id: string
          p_amount: number
          p_message?: string
        }
        Returns: Json
      }
      purchase_nft: {
        Args: {
          nft_id: string
          buyer_id: string
          price: number
        }
        Returns: Json
      }
      record_user_activity: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_reference_id?: string
          p_reference_type?: string
        }
        Returns: Json
      }
      reward_user: {
        Args: {
          user_id: string
          amount: number
          reward_description: string
        }
        Returns: Json
      }
      track_analytics_event: {
        Args: {
          p_event_type: string
          p_metadata?: Json
          p_session_id?: string
          p_path?: string
          p_client_info?: Json
        }
        Returns: string
      }
      transfer_jestcoin: {
        Args: {
          sender_id: string
          receiver_id: string
          amount: number
          description?: string
        }
        Returns: Json
      }
      unfollow_user: {
        Args: {
          follower: string
          following: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "creator" | "user"
      canvas_element_type:
        | "note"
        | "task"
        | "milestone"
        | "connection"
        | "group"
        | "image"
        | "document"
        | "goal"
      event_category:
        | "music"
        | "art"
        | "tech"
        | "business"
        | "community"
        | "other"
      event_status: "draft" | "published" | "canceled" | "completed"
      model_type: "diamond" | "sphere" | "torus" | "crystal" | "sketchfab"
      nft_type: "image" | "video" | "audio" | "3d_model"
      press_role: "journalist" | "blogger" | "editor" | "podcaster" | "other"
      product_type: "nft" | "music" | "merch" | "collectible"
      profile_type: "fan" | "artist" | "admin" | "collaborator"
      registration_status: "pending" | "confirmed" | "canceled" | "attended"
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
