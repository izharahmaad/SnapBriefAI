from fastapi import APIRouter, Depends

from app.core.config import Settings
from app.schemas.brief import BriefRequest, BriefResponse
from app.services.ai import generate_brief


router = APIRouter(prefix="/v1/briefs", tags=["Briefs"])


def get_settings() -> Settings:
    return Settings()


@router.post("/generate", response_model=BriefResponse)
async def create_brief(
    payload: BriefRequest,
    settings: Settings = Depends(get_settings),
):
    return await generate_brief(payload, settings)