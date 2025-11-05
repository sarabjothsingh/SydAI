SydAI Auth Server

Local development

1. Create .env and fill in your credentials:
   - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
   - GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
   - CLIENT_ORIGIN (default http://localhost:8081)
   - DATABASE_SERVICE_URL (default http://localhost:4000)

2. Install dependencies and run:
   - Using npm
     npm install
     npm start

The server runs on http://localhost:3000 and redirects back to the client at /app after successful auth.

Architecture
- This service does auth/session and business logic.
- It delegates ALL database CRUD to a separate service via DATABASE_SERVICE_URL.

Endpoints
- GET /auth/google
- GET /auth/github
- GET /status  // returns { authenticated, firstName, provider, expiresAt }
- GET /logout  // ends session and redirects to /login on the client
