from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import get_settings

settings = get_settings()
app = FastAPI(title=settings.app_name, version='1.0.0')
origins = ['*'] if settings.allowed_origins.strip() == '*' else [x.strip() for x in settings.allowed_origins.split(',')]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
app.include_router(router)

@app.get('/health', tags=['system'])
def health():
    return {'status': 'ok', 'service': settings.app_name}
