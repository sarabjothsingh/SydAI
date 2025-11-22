// Document status constants
// These match the enum values in database/schemas/document.js
// NOTE: This must be kept in sync with ai_services/constants.js
// as the microservices architecture requires separate copies.
const DOCUMENT_STATUS = {
  PENDING: "pending",
  INDEXING: "indexing",
  INDEXED: "indexed",
  ERROR: "error",
};

module.exports = {
  DOCUMENT_STATUS,
};
