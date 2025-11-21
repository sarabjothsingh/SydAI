# syntax=docker/dockerfile:1
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV HOST=0.0.0.0 \
    PORT=8001 \
    EMBEDDING_MODEL=BAAI/bge-m3 \
    EMBEDDING_USE_FP16=true

EXPOSE 8001
CMD ["python", "main.py"]
