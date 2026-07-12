from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from routes.resume_routes import router

app = FastAPI()

app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "AI Service Running"
    }


import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )
