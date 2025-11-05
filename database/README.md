SydAI Database Service (CRUD-only)

Scope
- This service is responsible ONLY for database CRUD operations.
- No comparisons, business logic, auth decisions, or provider-specific flows live here.
- The auth/backend service constructs the payloads and makes HTTP requests to these endpoints.

API Endpoints
- GET /health → { ok: true }
- GET /users/:id → returns user document by Mongo _id
- POST /users/google/upsert → upsert user by googleId with provided $set and loginHistory push
- POST /users/github/upsert → upsert user by githubId with provided $set and loginHistory push
- POST /sessions/touch → sets currentSession.lastActive and updatedAt
- POST /sessions/clear-expired → marks user logged_out, pushes history, unsets currentSession
- POST /logout → same as clear-expired intended for explicit logout

Notes
- The service expects fully-prepared payloads; it performs direct Mongoose operations only.
- Keep schema files in ./schemas and avoid importing anything from the auth server.
- If running on another device, set the auth server's DATABASE_SERVICE_URL to point here.
