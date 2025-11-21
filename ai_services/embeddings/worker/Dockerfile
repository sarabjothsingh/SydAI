# syntax=docker/dockerfile:1

# Build: docker build -t sydai/embedding-worker:latest -f ai_services/embeddings/worker/Dockerfile ai_services/embeddings/worker/

FROM python:3.11-slim AS base

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Create app user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copy requirements first for better layer caching
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Set ownership to app user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOST=0.0.0.0 \
    PORT=8001 \
    EMBEDDING_MODEL=BAAI/bge-m3 \
    EMBEDDING_USE_FP16=true

EXPOSE 8001

ENTRYPOINT ["dumb-init", "--"]
CMD ["python", "main.py"]
