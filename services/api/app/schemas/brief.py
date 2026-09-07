from typing import Literal
from pydantic import BaseModel, Field

class GenerateBriefRequest(BaseModel):
    content: str = Field(min_length=3, max_length=3000)
    tone: Literal['professional', 'casual', 'concise'] = 'professional'

class BriefResponse(BaseModel):
    title: str
    summary: str
    key_points: list[str]
    actions: list[str]
    tags: list[str]
    priority: Literal['low', 'medium', 'high']
    due_date: str | None = None
