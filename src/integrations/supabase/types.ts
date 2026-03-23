export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      certificate_applications: {
        Row: {
          aadhaar_hash: string
          application_number: string
          certificate_type: string
          citizen_name: string
          created_at: string
          documents: Json | null
          id: string
          reviewer_notes: string | null
          status: string
          updated_at: string
          ward: string | null
        }
        Insert: {
          aadhaar_hash: string
          application_number: string
          certificate_type: string
          citizen_name: string
          created_at?: string
          documents?: Json | null
          id?: string
          reviewer_notes?: string | null
          status?: string
          updated_at?: string
          ward?: string | null
        }
        Update: {
          aadhaar_hash?: string
          application_number?: string
          certificate_type?: string
          citizen_name?: string
          created_at?: string
          documents?: Json | null
          id?: string
          reviewer_notes?: string | null
          status?: string
          updated_at?: string
          ward?: string | null
        }
        Relationships: []
      }
      citizen_profiles: {
        Row: {
          aadhaar_hash: string
          address: string | null
          blood_group: string | null
          certificates_applied: number | null
          city: string | null
          complaints_filed: number | null
          created_at: string
          dob: string | null
          email: string | null
          father_name: string | null
          full_name: string
          gender: string | null
          id: string
          phone: string | null
          photo_url: string | null
          pincode: string | null
          state: string | null
          suvidha_card_id: string | null
          total_bills_paid: number | null
          total_transactions: number | null
          updated_at: string
          ward: string | null
        }
        Insert: {
          aadhaar_hash: string
          address?: string | null
          blood_group?: string | null
          certificates_applied?: number | null
          city?: string | null
          complaints_filed?: number | null
          created_at?: string
          dob?: string | null
          email?: string | null
          father_name?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          phone?: string | null
          photo_url?: string | null
          pincode?: string | null
          state?: string | null
          suvidha_card_id?: string | null
          total_bills_paid?: number | null
          total_transactions?: number | null
          updated_at?: string
          ward?: string | null
        }
        Update: {
          aadhaar_hash?: string
          address?: string | null
          blood_group?: string | null
          certificates_applied?: number | null
          city?: string | null
          complaints_filed?: number | null
          created_at?: string
          dob?: string | null
          email?: string | null
          father_name?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          phone?: string | null
          photo_url?: string | null
          pincode?: string | null
          state?: string | null
          suvidha_card_id?: string | null
          total_bills_paid?: number | null
          total_transactions?: number | null
          updated_at?: string
          ward?: string | null
        }
        Relationships: []
      }
      complaints: {
        Row: {
          aadhaar_hash: string
          ai_fraud_score: number | null
          assigned_to: string | null
          citizen_name: string
          complaint_number: string
          created_at: string
          description: string
          escalated_at: string | null
          id: string
          location: string | null
          photo_url: string | null
          priority: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string
          type: string
          updated_at: string
          ward: string
        }
        Insert: {
          aadhaar_hash: string
          ai_fraud_score?: number | null
          assigned_to?: string | null
          citizen_name: string
          complaint_number: string
          created_at?: string
          description: string
          escalated_at?: string | null
          id?: string
          location?: string | null
          photo_url?: string | null
          priority?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          type: string
          updated_at?: string
          ward: string
        }
        Update: {
          aadhaar_hash?: string
          ai_fraud_score?: number | null
          assigned_to?: string | null
          citizen_name?: string
          complaint_number?: string
          created_at?: string
          description?: string
          escalated_at?: string | null
          id?: string
          location?: string | null
          photo_url?: string | null
          priority?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          type?: string
          updated_at?: string
          ward?: string
        }
        Relationships: []
      }
      daily_analytics: {
        Row: {
          avg_queue_time_saved: number | null
          bills_paid: number | null
          certificates_issued: number | null
          complaints_filed: number | null
          complaints_resolved: number | null
          created_at: string
          date: string
          id: string
          revenue: number | null
          schemes_applied: number | null
          ward: string | null
        }
        Insert: {
          avg_queue_time_saved?: number | null
          bills_paid?: number | null
          certificates_issued?: number | null
          complaints_filed?: number | null
          complaints_resolved?: number | null
          created_at?: string
          date?: string
          id?: string
          revenue?: number | null
          schemes_applied?: number | null
          ward?: string | null
        }
        Update: {
          avg_queue_time_saved?: number | null
          bills_paid?: number | null
          certificates_issued?: number | null
          complaints_filed?: number | null
          complaints_resolved?: number | null
          created_at?: string
          date?: string
          id?: string
          revenue?: number | null
          schemes_applied?: number | null
          ward?: string | null
        }
        Relationships: []
      }
      kiosks: {
        Row: {
          city: string
          created_at: string
          id: string
          kiosk_id: string
          last_active_at: string | null
          location: string
          status: string
          total_transactions: number | null
          ward: string
        }
        Insert: {
          city?: string
          created_at?: string
          id?: string
          kiosk_id: string
          last_active_at?: string | null
          location: string
          status?: string
          total_transactions?: number | null
          ward: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          kiosk_id?: string
          last_active_at?: string | null
          location?: string
          status?: string
          total_transactions?: number | null
          ward?: string
        }
        Relationships: []
      }
      scheme_applications: {
        Row: {
          aadhaar_hash: string
          amount: number | null
          application_number: string
          citizen_name: string
          created_at: string
          eligibility_status: string
          id: string
          metadata: Json | null
          scheme_name: string
          updated_at: string
          ward: string | null
        }
        Insert: {
          aadhaar_hash: string
          amount?: number | null
          application_number: string
          citizen_name: string
          created_at?: string
          eligibility_status?: string
          id?: string
          metadata?: Json | null
          scheme_name: string
          updated_at?: string
          ward?: string | null
        }
        Update: {
          aadhaar_hash?: string
          amount?: number | null
          application_number?: string
          citizen_name?: string
          created_at?: string
          eligibility_status?: string
          id?: string
          metadata?: Json | null
          scheme_name?: string
          updated_at?: string
          ward?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          aadhaar_hash: string
          amount: number
          citizen_name: string
          created_at: string
          id: string
          metadata: Json | null
          provider: string | null
          reference_id: string | null
          service_type: string
          status: string
          ward: string | null
        }
        Insert: {
          aadhaar_hash: string
          amount?: number
          citizen_name: string
          created_at?: string
          id?: string
          metadata?: Json | null
          provider?: string | null
          reference_id?: string | null
          service_type: string
          status?: string
          ward?: string | null
        }
        Update: {
          aadhaar_hash?: string
          amount?: number
          citizen_name?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          provider?: string | null
          reference_id?: string | null
          service_type?: string
          status?: string
          ward?: string | null
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
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
