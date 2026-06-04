import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk@0.24.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BRAND_SYSTEM_PROMPT = `You are the content writer for Neem Travels — a premium slow travel company specialising in Amsterdam and Paris.

Brand Voice:
- Sophisticated yet warm and personal
- Celebrates depth, curiosity, and authentic local experience
- Never uses excessive exclamation marks or over-the-top hype
- Writes about travel the way a knowledgeable friend would: genuinely, specifically, warmly
- Uses specific details (street names, neighbourhood references, local terms) when possible
- Believes in slow travel: depth over breadth, lingering over rushing

Brand Colours & Aesthetic: Forest green, gold, cream. Elegant. Understated luxury.

Target Audience: Culturally curious adults (35-60) who value quality experiences over quantity. Likely own passports with many stamps. Appreciate authenticity.

Writing Style:
- Short, evocative sentences mixed with longer, flowing ones
- Sensory details (light, texture, smell, taste)
- Light use of French/Dutch words when appropriate and explained
- Avoid clichés like "hidden gem", "must-see", "bucket list"
- Never start posts with "I" on Instagram
- LinkedIn posts can be more reflective and professional`;

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

    const { articleId } = await req.json();
    if (!articleId) {
      return new Response(JSON.stringify({ error: "articleId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: article, error: articleError } = await supabase
      .from("rss_articles")
      .select("*")
      .eq("id", articleId)
      .eq("status", "approved")
      .maybeSingle();

    if (articleError || !article) {
      return new Response(JSON.stringify({ error: "Article not found or not approved" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const articleContext = `
Title: ${article.title}
City: ${article.city}
Category: ${article.category}
Description: ${article.description || "No description available"}
    `.trim();

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: BRAND_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Based on this article from ${article.city}, create branded social media content and a blog post for Neem Travels.

${articleContext}

Return ONLY a valid JSON object with these exact keys:
{
  "instagram_caption": "2-4 paragraph Instagram caption (no hashtags here)",
  "instagram_hashtags": "10-15 relevant hashtags starting with #",
  "linkedin_post": "Professional LinkedIn post (200-300 words)",
  "facebook_post": "Community-focused Facebook post (150-200 words, ends with a question)",
  "blog_title": "SEO-friendly blog post title",
  "blog_meta_description": "150-160 character meta description",
  "blog_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Do NOT wrap in markdown code blocks. Return pure JSON only.`,
        },
      ],
    });

    const content = message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(content.trim());
    const blogSlug = slugify(parsed.blog_title);

    const { data: generated, error: insertError } = await supabase
      .from("generated_content")
      .insert({
        article_id: articleId,
        instagram_caption: parsed.instagram_caption,
        instagram_hashtags: parsed.instagram_hashtags,
        linkedin_post: parsed.linkedin_post,
        facebook_post: parsed.facebook_post,
        blog_title: parsed.blog_title,
        blog_slug: blogSlug,
        blog_meta_description: parsed.blog_meta_description,
        blog_tags: parsed.blog_tags || [],
        brand_reviewed: false,
        status: "pending_approval",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true, contentId: generated.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
