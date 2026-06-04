import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RELEVANCE_KEYWORDS = {
  high: [
    'amsterdam', 'paris', 'canal', 'museum', 'rijksmuseum', 'louvre', 'montmartre',
    'jordaan', 'le marais', 'eiffel', 'vondelpark', 'anne frank', 'van gogh',
    'dutch', 'french', 'cuisine', 'bistro', 'café', 'exhibition', 'gallery',
    'culture', 'art', 'food', 'market', 'festival', 'architecture', 'historic',
    'travel guide', 'slow travel', 'itinerary', 'neighbourhood', 'local'
  ],
  medium: [
    'europe', 'european', 'netherlands', 'france', 'tourism', 'visitor', 'tourist',
    'weekend', 'getaway', 'trip', 'experience', 'discover', 'explore', 'hidden gem',
    'local tip', 'authentic', 'traditional', 'historic', 'cultural', 'lifestyle'
  ],
  low: [
    'travel', 'hotel', 'restaurant', 'attraction', 'sight', 'visit', 'city',
    'summer', 'spring', 'winter', 'autumn', 'season', 'event', 'opening'
  ],
  negative: [
    'advertisement', 'sponsored', 'press release', 'promo', 'discount code',
    'affiliate', 'budget airline', 'cheap flight', 'package deal', 'all-inclusive'
  ],
};

function scoreRelevance(title: string, description: string): number {
  const text = `${title} ${description}`.toLowerCase();
  let score = 30;

  for (const keyword of RELEVANCE_KEYWORDS.high) {
    if (text.includes(keyword)) score += 8;
  }
  for (const keyword of RELEVANCE_KEYWORDS.medium) {
    if (text.includes(keyword)) score += 4;
  }
  for (const keyword of RELEVANCE_KEYWORDS.low) {
    if (text.includes(keyword)) score += 2;
  }
  for (const keyword of RELEVANCE_KEYWORDS.negative) {
    if (text.includes(keyword)) score -= 15;
  }

  return Math.min(100, Math.max(0, score));
}

function detectCity(title: string, description: string, feedCity: string): string {
  const text = `${title} ${description}`.toLowerCase();
  const amsterdamTerms = ['amsterdam', 'dutch', 'netherlands', 'holland', 'jordaan', 'canal', 'rijksmuseum', 'vondelpark', 'keukenhof'];
  const parisTerms = ['paris', 'french', 'france', 'montmartre', 'louvre', 'seine', 'marais', 'musée', 'arrondissement'];

  const amsterdamScore = amsterdamTerms.filter(t => text.includes(t)).length;
  const parisScore = parisTerms.filter(t => text.includes(t)).length;

  if (amsterdamScore > parisScore) return 'Amsterdam';
  if (parisScore > amsterdamScore) return 'Paris';
  return feedCity === 'Both' ? 'Amsterdam' : feedCity;
}

function parseRSSFeed(xmlText: string): Array<{ title: string; description: string; link: string; pubDate: string; author?: string; imageUrl?: string }> {
  const items: Array<{ title: string; description: string; link: string; pubDate: string; author?: string; imageUrl?: string }> = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const item = match[1];

    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i);
    const descMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/i);
    const linkMatch = item.match(/<link>(.*?)<\/link>/i);
    const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/i);
    const authorMatch = item.match(/<author>(.*?)<\/author>|<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/i);
    const imageMatch = item.match(/<media:content[^>]*url="([^"]*)"[^>]*\/>|<enclosure[^>]*url="([^"]*)"[^>]*/i);

    const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : '';
    const description = descMatch ? (descMatch[1] || descMatch[2] || '').replace(/<[^>]+>/g, '').trim().substring(0, 500) : '';
    const link = linkMatch ? linkMatch[1].trim() : '';
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();
    const author = authorMatch ? (authorMatch[1] || authorMatch[2] || '').trim() : undefined;
    const imageUrl = imageMatch ? (imageMatch[1] || imageMatch[2] || '').trim() : undefined;

    if (title && link) {
      items.push({ title, description, link, pubDate, author, imageUrl: imageUrl || undefined });
    }
  }

  return items.slice(0, 20);
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

    const { feedId } = await req.json().catch(() => ({}));

    let query = supabase.from("rss_feeds").select("*").eq("is_active", true);
    if (feedId) query = query.eq("id", feedId);

    const { data: feeds, error: feedsError } = await query;
    if (feedsError) throw feedsError;
    if (!feeds || feeds.length === 0) {
      return new Response(JSON.stringify({ message: "No active feeds found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = [];

    for (const feed of feeds) {
      try {
        const response = await fetch(feed.url, {
          headers: { "User-Agent": "NeemTravels-RSS-Agent/1.0" },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          results.push({ feed: feed.name, status: "error", message: `HTTP ${response.status}` });
          continue;
        }

        const xmlText = await response.text();
        const items = parseRSSFeed(xmlText);
        let newCount = 0;
        let duplicateCount = 0;

        for (const item of items) {
          const { data: existing } = await supabase
            .from("rss_articles")
            .select("id")
            .eq("url", item.link)
            .maybeSingle();

          if (existing) {
            duplicateCount++;
            continue;
          }

          const relevanceScore = scoreRelevance(item.title, item.description);
          const city = detectCity(item.title, item.description, feed.city);
          const status = relevanceScore >= 40 ? "pending_review" : "new";

          const { error: insertError } = await supabase.from("rss_articles").insert({
            feed_id: feed.id,
            title: item.title,
            description: item.description || null,
            url: item.link,
            image_url: item.imageUrl || null,
            author: item.author || null,
            published_at: new Date(item.pubDate).toISOString(),
            relevance_score: relevanceScore,
            city,
            category: feed.category,
            tags: [feed.city, feed.category],
            status,
          });

          if (!insertError) newCount++;
        }

        await supabase.from("rss_feeds").update({ last_fetched_at: new Date().toISOString() }).eq("id", feed.id);

        results.push({ feed: feed.name, status: "success", new: newCount, duplicates: duplicateCount, total: items.length });
      } catch (e: unknown) {
        results.push({ feed: feed.name, status: "error", message: e instanceof Error ? e.message : "Unknown error" });
      }
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
