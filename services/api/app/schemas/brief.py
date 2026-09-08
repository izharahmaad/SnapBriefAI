from typing import List, Optional

from pydantic import BaseModel, Field


class BriefRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)


class BriefResponse(BaseModel):
    title: str
    summary: str
    key_points: List[str] = Field(default_factory=list)
    actions: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    priority: str
    due_date: Optional[str] = None