export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      rss_feeds: {
        Row: {
          id: string;
          name: string;
          url: string;
          category: string;
          city: string;
          is_active: boolean;
          last_fetched_at: string | null;
          fetch_interval_hours: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          url: string;
          category: string;
          city: string;
          is_active?: boolean;
          last_fetched_at?: string | null;
          fetch_interval_hours?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['rss_feeds']['Insert']>;
      };
      rss_articles: {
        Row: {
          id: string;
          feed_id: string;
          title: string;
          description: string | null;
          content: string | null;
          url: string;
          image_url: string | null;
          author: string | null;
          published_at: string | null;
          fetched_at: string;
          relevance_score: number;
          city: string;
          category: string;
          tags: string[];
          is_duplicate: boolean;
          duplicate_of: string | null;
          status: 'new' | 'pending_review' | 'approved' | 'rejected';
          reviewer_notes: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          feed_id: string;
          title: string;
          description?: string | null;
          content?: string | null;
          url: string;
          image_url?: string | null;
          author?: string | null;
          published_at?: string | null;
          fetched_at?: string;
          relevance_score?: number;
          city: string;
          category: string;
          tags?: string[];
          is_duplicate?: boolean;
          duplicate_of?: string | null;
          status?: 'new' | 'pending_review' | 'approved' | 'rejected';
          reviewer_notes?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['rss_articles']['Insert']>;
      };
      generated_content: {
        Row: {
          id: string;
          article_id: string;
          instagram_caption: string | null;
          instagram_hashtags: string | null;
          linkedin_post: string | null;
          facebook_post: string | null;
          blog_title: string | null;
          blog_content: string | null;
          blog_slug: string | null;
          blog_meta_description: string | null;
          blog_tags: string[];
          brand_reviewed: boolean;
          status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'published';
          approver_notes: string | null;
          approved_at: string | null;
          approved_by: string | null;
          generated_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          instagram_caption?: string | null;
          instagram_hashtags?: string | null;
          linkedin_post?: string | null;
          facebook_post?: string | null;
          blog_title?: string | null;
          blog_content?: string | null;
          blog_slug?: string | null;
          blog_meta_description?: string | null;
          blog_tags?: string[];
          brand_reviewed?: boolean;
          status?: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'published';
          approver_notes?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          generated_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['generated_content']['Insert']>;
      };
      published_posts: {
        Row: {
          id: string;
          content_id: string;
          platform: 'instagram' | 'linkedin' | 'facebook' | 'blog';
          platform_post_id: string | null;
          platform_url: string | null;
          published_at: string;
          status: 'success' | 'failed';
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          content_id: string;
          platform: 'instagram' | 'linkedin' | 'facebook' | 'blog';
          platform_post_id?: string | null;
          platform_url?: string | null;
          published_at?: string;
          status?: 'success' | 'failed';
          error_message?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['published_posts']['Insert']>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          featured_image: string | null;
          author_name: string;
          author_avatar: string | null;
          category: string;
          tags: string[];
          city: string | null;
          meta_description: string | null;
          is_published: boolean;
          published_at: string | null;
          source_article_id: string | null;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          featured_image?: string | null;
          author_name?: string;
          author_avatar?: string | null;
          category?: string;
          tags?: string[];
          city?: string | null;
          meta_description?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          source_article_id?: string | null;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
      destinations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          country: string;
          tagline: string | null;
          description: string | null;
          featured_image: string;
          gallery_images: string[];
          highlights: string[];
          best_time: string | null;
          duration: string | null;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          country: string;
          tagline?: string | null;
          description?: string | null;
          featured_image: string;
          gallery_images?: string[];
          highlights?: string[];
          best_time?: string | null;
          duration?: string | null;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['destinations']['Insert']>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          is_active: boolean;
          subscribed_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          is_active?: boolean;
          subscribed_at?: string;
        };
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
