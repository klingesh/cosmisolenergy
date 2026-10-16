export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      blog_posts: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      projects: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      project_images: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      testimonials: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      admin_profiles: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
    };
    Views: Record<string, never>;
    Functions: { is_admin: { Args: { user_id: string }; Returns: boolean }; replace_project_images: { Args: { p_project_id: string; p_images: Json }; Returns: undefined } };
    Enums: { content_status: 'draft' | 'published'; project_type: 'residential' | 'commercial' | 'industrial' };
    CompositeTypes: Record<string, never>;
  };
};
