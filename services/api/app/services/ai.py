import json

from google import genai
from google.genai import types

from app.core.config import Settings
from app.schemas.brief import BriefRequest, BriefResponse


SYSTEM_PROMPT = """
You are SnapBrief AI, a concise information-structuring assistant.

Transform the user's messy notes into a useful brief.

Return ONLY valid JSON with exactly these fields:

{
  "title": "short title",
  "summary": "one or two sentence summary",
  "key_points": ["point 1", "point 2"],
  "actions": ["action 1", "action 2"],
  "tags": ["tag1", "tag2"],
  "priority": "low",
  "due_date": null
}

Rules:
- Do not invent facts.
- Keep the title short and specific.
- Keep the summary concise and factual.
- Extract only information supported by the user's notes.
- Keep key points concise.
- Convert clear tasks, commitments, or next steps into actions.
- Extract dates only when clearly present.
- Use null for due_date when no clear date exists.
- Priority must be exactly one of: low, medium, high.
- Use lowercase tags.
- Prefer 2-5 key points when enough information exists.
- Prefer 1-5 actions when actionable information exists.
- Return JSON only.
"""


def _clean_json(text: str) -> str:
    """
    Remove accidental Markdown code fences if the model
    returns them despite the JSON response configuration.
    """
    cleaned = text.strip()

    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]

    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]

    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    return cleaned.strip()

async def generate_brief(
    payload: BriefRequest,
    settings: Settings,
) -> BriefResponse:
    client = genai.Client(
        api_key=settings.gemini_api_key,
    )

    response = await client.aio.models.generate_content(
        model=settings.gemini_model,
        contents=(
            f"{SYSTEM_PROMPT}\n\n"
            f"USER NOTES:\n{payload.text.strip()}"
        ),
        config=types.GenerateContentConfig(
            temperature=0.2,
            response_mime_type="application/json",
        ),
    )

    raw_text = response.text

    if not raw_text:
        raise RuntimeError(
            "Gemini returned an empty response."
        )

    cleaned_text = _clean_json(raw_text)

    try:
        data = json.loads(cleaned_text)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "Gemini returned invalid JSON."
        ) from exc

    try:
        return BriefResponse(**data)
    except Exception as exc:
        raise RuntimeError(
            "Gemini returned a response that does not "
            "match the SnapBrief brief schema."
        ) from exc