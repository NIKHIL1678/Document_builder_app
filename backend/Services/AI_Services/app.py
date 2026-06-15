from fastapi import FastAPI

from routes.extract_router import router as extract_router

app = FastAPI()

app.include_router(extract_router)

@app.get("/")
def home():
    return {
        "success": True,
        "message": "AI Service Running"
    }