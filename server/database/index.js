// Deprecated: this file is no longer used. The database service is now a separate
// microservice in the root-level `database/` folder and is responsible ONLY for
// CRUD operations over HTTP. This placeholder exists temporarily to avoid import
// errors during transition; do not use it. All calls should go through the
// DATABASE_SERVICE_URL from the auth server.

module.exports = {};
