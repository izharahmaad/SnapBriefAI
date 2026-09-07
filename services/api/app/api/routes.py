from fastapi import APIRouter, Depends
from app.core.config import Settings, get_settings
from app.schemas.brief import BriefResponse, GenerateBriefRequest
from app.services.ai import generate_brief

router = APIRouter(prefix='/v1/briefs', tags=['briefs'])

@router.post('/generate', response_model=BriefResponse)
async def create_brief(payload: GenerateBriefRequest, settings: Settings = Depends(get_settings)):
    return await generate_brief(payload, settings)
