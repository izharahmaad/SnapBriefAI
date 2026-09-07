import json
import re
import httpx
from app.core.config import Settings
from app.schemas.brief import BriefResponse, GenerateBriefRequest

SYSTEM = '''You turn messy notes into a compact professional brief. Return ONLY valid JSON with these keys:
title (string), summary (string), key_points (array of 2-5 short strings), actions (array of 2-5 actionable strings), tags (array of 2-5 lowercase strings), priority (low|medium|high), due_date (string or null).
Do not invent facts. Infer a due date only when the note provides enough context. Keep wording crisp.''' 

async def generate_brief(payload: GenerateBriefRequest, settings: Settings) -> BriefResponse:
    if not settings.gemini_api_key:
        return fallback(payload.content)

    url = f'https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent'
    prompt = f'{SYSTEM}\n\nTone: {payload.tone}\n\nNOTES:\n{payload.content}'
    body = {'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseMimeType': 'application/json'}}

    async with httpx.AsyncClient(timeout=45) as client:
        response = await client.post(url, params={'key': settings.gemini_api_key}, json=body)
        response.raise_for_status()
        data = response.json()

    text = data['candidates'][0]['content']['parts'][0]['text']
    text = re.sub(r'^```json\s*|\s*```$', '', text.strip())
    return BriefResponse.model_validate(json.loads(text))

def fallback(content: str) -> BriefResponse:
    clean = re.sub(r'\s+', ' ', content.strip())
    sentences = [x.strip() for x in re.split(r'[.!?]', clean) if x.strip()]
    title = 'Quick Brief'
    lower = clean.lower()
    if 'client' in lower: title = 'Client follow-up'
    elif 'meeting' in lower: title = 'Meeting notes'
    elif 'launch' in lower: title = 'Launch plan'
    points = sentences[:3] or [clean]
    actions = [f'Review: {p[:70]}' for p in points[:2]]
    return BriefResponse(title=title, summary=clean[:160], key_points=points, actions=actions, tags=['notes', 'brief'], priority='medium')
