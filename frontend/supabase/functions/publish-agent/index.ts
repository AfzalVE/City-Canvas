import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type Platform = "instagram" | "linkedin" | "facebook" | "blog";

async function publishToInstagram(content: Record<string, unknown>): Promise<{ success: boolean; postId?: string; error?: string }> {
  const accessToken = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");
  const pageId = Deno.env.get("INSTAGRAM_PAGE_ID");

  if (!accessToken || !pageId) {
    return { success: false, error: "Instagram credentials not configured" };
  }

  try {
    const caption = `${content.instagram_caption}\n\n${content.instagram_hashtags}`;
    const imageUrl = content.image_url || "https://images.pexels.com/photos/1414467/pexels-photo-1414467.jpeg";

    const mediaResponse = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          access_token: accessToken,
        }),
      }
    );

    const mediaData = await mediaResponse.json();
    if (!mediaData.id) return { success: false, error: mediaData.error?.message || "Failed to create media" };

    const publishResponse = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: mediaData.id,
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publishResponse.json();
    return publishData.id
      ? { success: true, postId: publishData.id }
      : { success: false, error: publishData.error?.message || "Failed to publish" };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

async function publishToLinkedIn(content: Record<string, unknown>): Promise<{ success: boolean; postId?: string; error?: string }> {
  const accessToken = Deno.env.get("LINKEDIN_ACCESS_TOKEN");
  const personId = Deno.env.get("LINKEDIN_PERSON_ID");

  if (!accessToken || !personId) {
    return { success: false, error: "LinkedIn credentials not configured" };
  }

  try {
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${personId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: content.linkedin_post },
            shareMediaCategory: "NONE",
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      }),
    });

    const data = await response.json();
    return data.id ? { success: true, postId: data.id } : { success: false, error: data.message || "Failed to publish" };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

async function publishToFacebook(content: Record<string, unknown>): Promise<{ success: boolean; postId?: string; error?: string }> {
  const accessToken = Deno.env.get("FACEBOOK_PAGE_ACCESS_TOKEN");
  const pageId = Deno.env.get("FACEBOOK_PAGE_ID");

  if (!accessToken || !pageId) {
    return { success: false, error: "Facebook credentials not configured" };
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: content.facebook_post,
        access_token: accessToken,
      }),
    });

    const data = await response.json();
    return data.id ? { success: true, postId: data.id } : { success: false, error: data.error?.message || "Failed to publish" };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

async function publishToBlog(supabase: ReturnType<typeof createClient>, content: Record<string, unknown>, contentId: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const { data: article } = await supabase
      .from("rss_articles")
      .select("*")
      .eq("id", content.article_id)
      .maybeSingle();

    const { data: blog, error } = await supabase
      .from("blog_posts")
      .insert({
        title: content.blog_title,
        slug: content.blog_slug,
        excerpt: content.blog_meta_description,
        content: `<p>${content.blog_meta_description}</p>\n\n<p>Full article content will be generated here from the source: <a href="${article?.url}">${article?.url}</a></p>`,
        featured_image: article?.image_url || null,
        category: article?.category || "Travel",
        tags: content.blog_tags || [],
        city: article?.city || null,
        meta_description: content.blog_meta_description,
        is_published: true,
        published_at: new Date().toISOString(),
        source_article_id: content.article_id,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, postId: blog.id };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
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

    const { contentId, platforms }: { contentId: string; platforms: Platform[] } = await req.json();

    if (!contentId || !platforms?.length) {
      return new Response(JSON.stringify({ error: "contentId and platforms required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: content, error: contentError } = await supabase
      .from("generated_content")
      .select("*")
      .eq("id", contentId)
      .eq("status", "approved")
      .maybeSingle();

    if (contentError || !content) {
      return new Response(JSON.stringify({ error: "Content not found or not approved" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: Record<string, { success: boolean; postId?: string; error?: string }> = {};

    for (const platform of platforms) {
      let result: { success: boolean; postId?: string; error?: string };

      switch (platform) {
        case "instagram":
          result = await publishToInstagram(content as Record<string, unknown>);
          break;
        case "linkedin":
          result = await publishToLinkedIn(content as Record<string, unknown>);
          break;
        case "facebook":
          result = await publishToFacebook(content as Record<string, unknown>);
          break;
        case "blog":
          result = await publishToBlog(supabase, content as Record<string, unknown>, contentId);
          break;
        default:
          result = { success: false, error: `Unknown platform: ${platform}` };
      }

      results[platform] = result;

      await supabase.from("published_posts").insert({
        content_id: contentId,
        platform,
        platform_post_id: result.postId || null,
        status: result.success ? "success" : "failed",
        error_message: result.error || null,
      });
    }

    const allSucceeded = Object.values(results).every((r) => r.success);
    if (allSucceeded) {
      await supabase
        .from("generated_content")
        .update({ status: "published", updated_at: new Date().toISOString() })
        .eq("id", contentId);
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
