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
- Keep key points concise.
- Extract dates only when clearly present.
- Priority must be one of: low, medium, high.
- due_date should be null when no clear date exists.
- Return JSON only.
"""


async def generate_brief(
    payload: BriefRequest,
    settings: Settings,
) -> BriefResponse:
    client = genai.Client(api_key=settings.gemini_api_key)

    response = await client.aio.models.generate_content(
        model=settings.gemini_model,
        contents=(
            f"{SYSTEM_PROMPT}\n\n"
            f"USER NOTES:\n{payload.text}"
        ),
        config=types.GenerateContentConfig(
            temperature=0.2,
            response_mime_type="application/json",
        ),
    )

    raw_text = response.text

    if not raw_text:
        raise RuntimeError("Gemini returned an empty response.")

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"Gemini returned invalid JSON: {raw_text}"
        ) from exc

    return BriefResponse(**data)