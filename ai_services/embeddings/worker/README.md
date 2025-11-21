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

## Important Notes

- The service binds to `0.0.0.0:8001` to accept connections from any network interface
- Client services connect to the embedding service using `http://127.0.0.1:8001` (IPv4) by default
- Make sure the embedding service is running before starting other services that depend on it
- If you encounter `ECONNREFUSED` errors, ensure this service is running and accessible on port 8001
