import json
import re

from app.config import CLAUDE_API_KEY
from app.config import CLAUDE_MODEL
from app.config import GROQ_API_KEY
from app.config import GROQ_MODEL
from app.config import LLM_PROVIDER


class LLMService:

    provider_disabled = False

    @staticmethod
    def _extract_json(text: str):

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

        match = re.search(r"\{.*\}", text, re.DOTALL)

        if not match:
            raise ValueError("LLM response did not contain JSON")

        return json.loads(match.group(0))

    @staticmethod
    def complete_json(prompt: str, max_tokens: int = 1800):

        if LLMService.provider_disabled:
            return None

        if LLM_PROVIDER == "groq":
            return LLMService._complete_groq_json(prompt, max_tokens)

        if LLM_PROVIDER == "claude":
            return LLMService._complete_claude_json(prompt, max_tokens)

        return None

    @staticmethod
    def _complete_groq_json(prompt: str, max_tokens: int):

        if not GROQ_API_KEY:
            return None

        try:
            from langchain_core.messages import HumanMessage
            from langchain_core.messages import SystemMessage
            from langchain_groq import ChatGroq

            llm = ChatGroq(
                api_key=GROQ_API_KEY,
                model=GROQ_MODEL,
                temperature=0.3,
                max_tokens=max_tokens,
            )
            response = llm.invoke(
                [
                    SystemMessage(
                        content=(
                            "You are an editorial AI for Neem Journeys. "
                            "Return valid JSON only."
                        )
                    ),
                    HumanMessage(content=prompt),
                ]
            )

            return LLMService._extract_json(response.content)
        except Exception as exc:
            print(f"LangChain Groq request failed, using fallback: {exc}")
            LLMService.provider_disabled = True
            return None

    @staticmethod
    def _complete_claude_json(prompt: str, max_tokens: int):

        if not CLAUDE_API_KEY:
            return None

        try:
            from langchain_anthropic import ChatAnthropic
            from langchain_core.messages import HumanMessage
            from langchain_core.messages import SystemMessage

            llm = ChatAnthropic(
                anthropic_api_key=CLAUDE_API_KEY,
                model=CLAUDE_MODEL,
                temperature=0.3,
                max_tokens=max_tokens,
            )
            response = llm.invoke(
                [
                    SystemMessage(
                        content=(
                            "You are an editorial AI for Neem Journeys. "
                            "Return valid JSON only."
                        )
                    ),
                    HumanMessage(content=prompt),
                ]
            )

            return LLMService._extract_json(response.content)
        except Exception as exc:
            print(f"LangChain Claude request failed, using fallback: {exc}")
            LLMService.provider_disabled = True
            return None

    @staticmethod
    def score_feed(feed):

        prompt = f"""
You are an editor for Neem Journeys.

Evaluate the article against:

1. Brand Alignment (35)
2. Audience Relevance (20)
3. Originality (15)
4. Timeliness (10)
5. Visual Potential (10)
6. Content Potential (5)
7. Source Authority (5)

Audience:
Affluent travellers aged 35-55 interested in culture, food, architecture,
art, design, neighbourhood life and slow travel.

Return JSON only.

{{
  "brand_alignment": 0-35,
  "audience_relevance": 0-20,
  "originality": 0-15,
  "timeliness": 0-10,
  "visual_potential": 0-10,
  "content_potential": 0-5,
  "source_authority": 0-5,
  "total": 0-100,
  "reasoning": "short explanation"
}}

Article:
Title: {feed.title}
Summary: {feed.summary or ""}
City: {feed.city or ""}
Source: {feed.source_name or ""}
Published: {feed.published_date or ""}
URL: {feed.link}
"""

        response = LLMService.complete_json(prompt, max_tokens=900)

        if response:
            return LLMService._normalise_score_response(response, feed)

        return LLMService._fallback_score(feed)

    @staticmethod
    def _normalise_score_response(response, feed):

        def bounded(value, maximum):
            try:
                numeric = float(value)
            except (TypeError, ValueError):
                numeric = 0

            return max(0, min(maximum, numeric))

        brand_alignment = bounded(
            response.get("brand_alignment", response.get("brand_fit", 0)),
            35
        )
        audience = bounded(response.get("audience_relevance", 0), 20)
        originality = bounded(response.get("originality", 0), 15)
        timeliness = bounded(response.get("timeliness", 0), 10)
        visual = bounded(response.get("visual_potential", 0), 10)
        content = bounded(response.get("content_potential", 0), 5)
        authority = bounded(response.get("source_authority", 0), 5)
        calculated_total = (
            brand_alignment
            + audience
            + originality
            + timeliness
            + visual
            + content
            + authority
        )
        total = bounded(
            response.get("total", response.get("score", calculated_total)),
            100
        )

        return {
            "total_score": float(total),
            "factor_scores": {
                "brand_alignment": brand_alignment,
                "audience_relevance": audience,
                "originality": originality,
                "timeliness": timeliness,
                "visual_potential": visual,
                "content_potential": content,
                "source_authority": authority,
            },
            "reason": response.get(
                "reasoning",
                response.get("reason", "")
            ),
            "suggested_category": response.get(
                "suggested_category",
                feed.category or "General"
            ),
            "confidence": float(response.get("confidence", 0.8)),
        }

    @staticmethod
    def generate_platform_content(feed, platform: str):

        platform_specs = {
            "instagram": "150-220 words, sensory present-tense caption, three hashtag sets, one quiet call to action.",
            "linkedin": "250-350 words, thoughtful professional post about a culture or travel trend.",
            "newsletter": "300-500 words, warm editorial dispatch, no exclamation marks.",
            "blog": "700-900 words, SEO-considered guide or essay with practical details, no exclamation marks.",
        }

        prompt = f"""
Create {platform} content for Neem Journeys.

Brand voice: measured, unhurried, curious, culturally literate, never shouty.
Rules:
- Always refer to the brand as "Neem Journeys".
- Use European English spelling.
- Avoid superlatives such as best, greatest, most incredible.
- Include a photography_direction field.
- Include source attribution.

Return strict JSON only with:
headline, content, excerpt, seo_title, seo_description, keywords array, hashtags array,
photography_direction, suggested_post_time.

Platform spec: {platform_specs[platform]}

Source story:
Title: {feed.title}
Summary: {feed.summary or ""}
City: {feed.city or ""}
Category: {feed.category or ""}
URL: {feed.link}
Editor notes: {feed.editor_notes or ""}
"""

        response = LLMService.complete_json(prompt, max_tokens=2600)

        if response:
            return response

        return LLMService._fallback_content(feed, platform)

    @staticmethod
    def revise_content(content, issues: list[str]):

        prompt = f"""
Revise this Neem Journeys {content.platform} draft so it passes brand validation.

Issues:
{json.dumps(issues)}

Rules:
- Always use "Neem Journeys".
- European English.
- Remove hype and superlatives.
- Newsletter and Blog must not use exclamation marks.
- Include photography direction.

Return strict JSON only with: headline, content, excerpt, seo_title, seo_description,
keywords array, hashtags array, photography_direction, suggested_post_time.

Current headline: {content.headline}
Current draft:
{content.content}
"""

        response = LLMService.complete_json(prompt, max_tokens=2600)

        if response:
            return response

        revised_text = content.content
        replacements = {
            "best": "carefully chosen",
            "Best": "Carefully chosen",
            "greatest": "notable",
            "Greatest": "Notable",
            "most incredible": "memorable",
            "Most incredible": "Memorable",
            "color": "colour",
            "neighborhood": "neighbourhood",
            "center": "centre",
            "traveling": "travelling",
        }

        for old, new in replacements.items():
            revised_text = revised_text.replace(old, new)

        revised_text = re.sub(
            r"\bNeem\b(?!\s+Journeys)",
            "Neem Journeys",
            revised_text
        )

        if content.platform in {"newsletter", "blog"}:
            revised_text = revised_text.replace("!", ".")

        return {
            "headline": content.headline,
            "content": revised_text,
            "excerpt": content.excerpt or revised_text[:240],
            "seo_title": content.seo_title,
            "seo_description": content.seo_description,
            "keywords": [],
            "hashtags": [],
            "photography_direction": content.photography_direction
            or "Editorial destination photography with natural light and local detail.",
            "suggested_post_time": content.suggested_post_time,
        }

    @staticmethod
    def _fallback_score(feed):

        text = f"{feed.title} {feed.summary or ''}".lower()
        brand_terms = [
            "art",
            "culture",
            "museum",
            "food",
            "restaurant",
            "design",
            "architecture",
            "travel",
            "neighbourhood",
            "neighborhood",
            "exhibition",
            "cafe",
        ]
        city_terms = ["amsterdam", "paris", "netherlands", "france"]

        brand_alignment = min(
            35,
            sum(text.count(term) for term in brand_terms) * 7
        )
        audience = min(20, sum(text.count(term) for term in brand_terms) * 4)
        timeliness = 10 if feed.published_date else 6
        visual = 10 if feed.image_url else 6
        originality = 15 if feed.source_name else 10
        content = 5 if len(text) > 180 else 3
        authority = 5 if feed.source_name else 3
        city_bonus = 4 if any(term in text for term in city_terms) else 0
        total = min(
            100,
            brand_alignment
            + audience
            + originality
            + timeliness
            + visual
            + content
            + authority
            + city_bonus
        )

        return {
            "total_score": float(total),
            "factor_scores": {
                "brand_alignment": float(brand_alignment),
                "audience_relevance": float(audience),
                "originality": float(originality),
                "timeliness": float(timeliness),
                "visual_potential": float(visual),
                "content_potential": float(content),
                "source_authority": float(authority),
            },
            "reason": (
                "Fallback heuristic score based on Neem Journeys brand fit, "
                "audience relevance, cultural keywords, image availability and source detail."
            ),
            "suggested_category": feed.category or "General",
            "confidence": 0.55,
        }

    @staticmethod
    def _fallback_content(feed, platform: str):

        suggested_times = {
            "instagram": "Tuesday 19:00",
            "linkedin": "Wednesday 08:00",
            "newsletter": "Thursday 09:00",
            "blog": "Thursday 10:00",
        }
        hashtags = {
            "instagram": [
                f"#{feed.city or 'SlowTravel'}",
                "#CultureTravel",
                "#NeemJourneys",
            ],
            "linkedin": ["#TravelCulture", "#EditorialTravel", "#NeemJourneys"],
            "newsletter": ["Neem Journeys"],
            "blog": ["slow travel", feed.city or "Europe", "culture"],
        }

        city = feed.city or "European"
        summary = feed.summary or (
            "The story offers a useful point of entry into local culture, design, food, "
            "or the small rituals that shape a city."
        )

        base_paragraphs = [
            (
                f"Neem Journeys is watching this story because it speaks to the quieter "
                f"texture of {city} travel: culture, place, and the kind of detail that "
                f"rewards an unhurried visit."
            ),
            summary,
            (
                "For travellers who prefer to understand a city rather than rush through it, "
                "this is a useful starting point for a more considered itinerary."
            ),
        ]

        platform_paragraphs = {
            "instagram": [
                (
                    "Imagine arriving with time enough to notice the light, the materials, "
                    "and the small local habits around the story."
                ),
                "Save this for a slower city day with room for curiosity.",
            ],
            "linkedin": [
                (
                    "For travel brands, stories like this are a reminder that destination "
                    "content does not need to chase volume. It can build authority by reading "
                    "the city carefully and connecting cultural detail to traveller intent."
                ),
                (
                    "Neem Journeys can use this angle to frame travel as cultural literacy: "
                    "not simply where to go, but how to arrive with context."
                ),
            ],
            "newsletter": [
                (
                    "There is a particular pleasure in following a city through one local "
                    "story at a time. It lets the itinerary stay human, shaped by texture "
                    "rather than urgency."
                ),
                (
                    f"In {city}, this piece could become a dispatch that sits beside a cafe "
                    "recommendation, a gallery note, or a short neighbourhood walk."
                ),
                (
                    "The editorial opportunity is to invite the reader into the scene, then "
                    "leave them with one practical reason to look a little closer."
                ),
            ],
            "blog": [
                (
                    "A Neem Journeys blog version should open with the atmosphere of the place, "
                    "then move into context: why the story matters now, who it is for, and how "
                    "a traveller might fold it into a slower day."
                ),
                (
                    f"For {city}, the practical layer matters. Add nearby streets, museum or "
                    "restaurant references where relevant, seasonal timing, and a note on when "
                    "to arrive so the experience feels spacious rather than scheduled to the edge."
                ),
                (
                    "The piece should avoid ranking language. Instead of declaring something "
                    "essential, it should show the reader what makes the detail worth noticing: "
                    "craft, history, hospitality, design, food culture, or the rhythm of a local "
                    "neighbourhood."
                ),
                (
                    "Close with a quiet planning note from Neem Journeys, connecting the article "
                    "back to the brand's role as a curator of thoughtful city travel."
                ),
            ],
        }

        body = (
            f"{feed.title}\n\n"
            + "\n\n".join(base_paragraphs + platform_paragraphs[platform])
            + f"\n\nSource: {feed.link}"
        )

        return {
            "headline": feed.title,
            "content": body,
            "excerpt": (feed.summary or body)[:240],
            "seo_title": f"{feed.title} | Neem Journeys",
            "seo_description": (feed.summary or body)[:300],
            "keywords": [
                feed.city or "Europe",
                feed.category or "culture",
                "slow travel",
                "Neem Journeys",
            ],
            "hashtags": hashtags[platform],
            "photography_direction": (
                "Natural-light editorial image showing local texture, architecture, "
                "or a close cultural detail connected to the story."
            ),
            "suggested_post_time": suggested_times[platform],
        }
