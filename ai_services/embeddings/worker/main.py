import os
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from FlagEmbedding import BGEM3FlagModel

load_dotenv()

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8001"))
MODEL_NAME = os.getenv("EMBEDDING_MODEL", "BAAI/bge-m3")
USE_FP16 = os.getenv("EMBEDDING_USE_FP16", "true").lower() == "true"

app = FastAPI(title="SydAI Embedding Service", version="1.0.0")
_model_cache = None


class EmbeddingRequest(BaseModel):
  texts: List[str] = Field(..., min_items=1, description="Texts to embed")


class EmbeddingResponse(BaseModel):
  vectors: List[List[float]]


def get_model() -> BGEM3FlagModel:
  global _model_cache
  if _model_cache is None:
    # Load model with proper device handling to avoid meta tensor issues
    _model_cache = BGEM3FlagModel(
      MODEL_NAME, 
      use_fp16=USE_FP16,
      device='cpu'  # Force CPU to avoid meta tensor issues
    )
  return _model_cache


@app.get("/healthz")
def healthz():
  return {"status": "ok"}


@app.post("/embeddings", response_model=EmbeddingResponse)
def create_embeddings(payload: EmbeddingRequest):
  texts = [text for text in payload.texts if isinstance(text, str) and text.strip()]
  if not texts:
    raise HTTPException(status_code=400, detail="All texts were empty")

  model = get_model()
  embeddings = model.encode(texts)

  dense_vectors = embeddings["dense_vecs"].tolist()
  return EmbeddingResponse(vectors=dense_vectors)


def start():
  import uvicorn

  uvicorn.run(app, host=HOST, port=PORT)


if __name__ == "__main__":
  start()
