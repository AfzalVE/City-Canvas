/*
  # Travel Content Automation Platform — Initial Schema

  ## Overview
  Full schema for the Neem Travels content automation platform including:
  RSS feed management, article collection, content generation, approval workflows, publishing, blog CMS, and newsletter.

  ## Tables

  1. **rss_feeds** — RSS feed sources (Amsterdam/Paris focused)
     - id, name, url, category, city, is_active, fetch_interval_hours, last_fetched_at

  2. **rss_articles** — Collected articles from RSS feeds
     - id, feed_id (FK), title, description, content, url, image_url, author, published_at
     - relevance_score (0-100), city, category, tags, is_duplicate, status workflow

  3. **generated_content** — AI-generated social/blog content
     - id, article_id (FK), instagram/linkedin/facebook/blog content fields
     - brand_reviewed, status workflow, approval tracking

  4. **published_posts** — Record of all published content
     - id, content_id (FK), platform, platform_post_id, status, error_message

  5. **blog_posts** — Published blog articles (CMS)
     - id, title, slug (unique), excerpt, content, featured_image, author, category, tags
     - is_published, views, source_article_id

  6. **destinations** — Destination CMS
     - id, name, slug, country, tagline, description, gallery_images, highlights

  7. **newsletter_subscribers** — Email newsletter list
     - id, email (unique), name, is_active

  ## Security
  - RLS enabled on all tables
  - Public read access for published blog posts and destinations
  - Authenticated-only access for admin operations
  - Newsletter subscribers protected (authenticated insert only for public)
*/

-- ============================================================
-- RSS FEEDS
-- ============================================================
CREATE TABLE IF NOT EXISTS rss_feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  category text NOT NULL DEFAULT 'Culture',
  city text NOT NULL DEFAULT 'Amsterdam',
  is_active boolean NOT NULL DEFAULT true,
  last_fetched_at timestamptz,
  fetch_interval_hours integer NOT NULL DEFAULT 4,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active feeds"
  ON rss_feeds FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can manage feeds"
  ON rss_feeds FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update feeds"
  ON rss_feeds FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete feeds"
  ON rss_feeds FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- RSS ARTICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS rss_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id uuid NOT NULL REFERENCES rss_feeds(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content text,
  url text NOT NULL,
  image_url text,
  author text,
  published_at timestamptz,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  relevance_score integer NOT NULL DEFAULT 0 CHECK (relevance_score >= 0 AND relevance_score <= 100),
  city text NOT NULL DEFAULT 'Amsterdam',
  category text NOT NULL DEFAULT 'Culture',
  tags text[] NOT NULL DEFAULT '{}',
  is_duplicate boolean NOT NULL DEFAULT false,
  duplicate_of uuid REFERENCES rss_articles(id),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending_review', 'approved', 'rejected')),
  reviewer_notes text,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rss_articles_status ON rss_articles(status);
CREATE INDEX IF NOT EXISTS idx_rss_articles_feed_id ON rss_articles(feed_id);
CREATE INDEX IF NOT EXISTS idx_rss_articles_city ON rss_articles(city);
CREATE INDEX IF NOT EXISTS idx_rss_articles_url ON rss_articles(url);

ALTER TABLE rss_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view articles"
  ON rss_articles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert articles"
  ON rss_articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update articles"
  ON rss_articles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- GENERATED CONTENT
-- ============================================================
CREATE TABLE IF NOT EXISTS generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES rss_articles(id) ON DELETE CASCADE,
  instagram_caption text,
  instagram_hashtags text,
  linkedin_post text,
  facebook_post text,
  blog_title text,
  blog_content text,
  blog_slug text UNIQUE,
  blog_meta_description text,
  blog_tags text[] NOT NULL DEFAULT '{}',
  brand_reviewed boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'published')),
  approver_notes text,
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users(id),
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_generated_content_status ON generated_content(status);
CREATE INDEX IF NOT EXISTS idx_generated_content_article_id ON generated_content(article_id);

ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view generated content"
  ON generated_content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert generated content"
  ON generated_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update generated content"
  ON generated_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- PUBLISHED POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS published_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES generated_content(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'facebook', 'blog')),
  platform_post_id text,
  platform_url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_published_posts_platform ON published_posts(platform);
CREATE INDEX IF NOT EXISTS idx_published_posts_status ON published_posts(status);

ALTER TABLE published_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view published posts"
  ON published_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert published posts"
  ON published_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update published posts"
  ON published_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- BLOG POSTS (CMS)
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL DEFAULT '',
  featured_image text,
  author_name text NOT NULL DEFAULT 'Neem Travels',
  author_avatar text,
  category text NOT NULL DEFAULT 'Travel',
  tags text[] NOT NULL DEFAULT '{}',
  city text,
  meta_description text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  source_article_id uuid REFERENCES rss_articles(id),
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_city ON blog_posts(city);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- DESTINATIONS (CMS)
-- ============================================================
CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  country text NOT NULL,
  tagline text,
  description text,
  featured_image text NOT NULL,
  gallery_images text[] NOT NULL DEFAULT '{}',
  highlights text[] NOT NULL DEFAULT '{}',
  best_time text,
  duration text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view destinations"
  ON destinations FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can manage destinations"
  ON destinations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update destinations"
  ON destinations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  is_active boolean NOT NULL DEFAULT true,
  subscribed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated can view subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can update subscribers"
  ON newsletter_subscribers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- SEED DATA — Default RSS Feeds
-- ============================================================
INSERT INTO rss_feeds (name, url, category, city, fetch_interval_hours) VALUES
  ('iAmsterdam', 'https://www.iamsterdam.com/en/rss', 'Culture', 'Amsterdam', 4),
  ('DutchNews.nl', 'https://dutchnews.nl/feed/', 'News', 'Amsterdam', 6),
  ('Rijksmuseum Blog', 'https://www.rijksmuseum.nl/rss', 'Museums', 'Amsterdam', 12),
  ('Amsterdam Events', 'https://www.amsterdam.info/rss', 'Events', 'Amsterdam', 4),
  ('Paris Tourist Office', 'https://www.parisinfo.com/rss', 'Tourism', 'Paris', 4),
  ('Sortir à Paris', 'https://www.sortiraparis.com/rss', 'Events', 'Paris', 6),
  ('Paris Update', 'https://www.parisupdate.com/rss', 'Culture', 'Paris', 8),
  ('Lonely Planet Europe', 'https://www.lonelyplanet.com/rss', 'Travel', 'Both', 24),
  ('Culture Trip', 'https://theculturetrip.com/rss', 'Culture', 'Both', 12),
  ('Time Out Amsterdam', 'https://www.timeout.com/amsterdam/rss', 'Lifestyle', 'Amsterdam', 6),
  ('Time Out Paris', 'https://www.timeout.com/paris/rss', 'Lifestyle', 'Paris', 6)
ON CONFLICT DO NOTHING;

-- Seed Destinations
INSERT INTO destinations (name, slug, country, tagline, featured_image, is_featured, sort_order) VALUES
  ('Amsterdam', 'amsterdam', 'Netherlands', 'Canals, Culture & Tulip Gardens', 'https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg', true, 1),
  ('Paris', 'paris', 'France', 'Art, Romance & Haute Cuisine', 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg', true, 2)
ON CONFLICT (slug) DO NOTHING;
