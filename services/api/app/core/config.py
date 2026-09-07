from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = 'SnapBrief API'
    gemini_api_key: str = ''
    gemini_model: str = 'gemini-2.5-flash'
    allowed_origins: str = '*'
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

@lru_cache
def get_settings() -> Settings:
    return Settings()
