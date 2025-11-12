# SydAI Embedding Worker

Runs a lightweight FastAPI service that exposes BAAI/BGE-M3 embeddings for the Node.js backend.

## Setup

```bash
cd ai_services/embeddings/worker
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The service reads configuration from `.env` and listens on `http://0.0.0.0:8001` by default.
