// Document status constants (should match database/constants.js)
// NOTE: This must be kept in sync with database/constants.js
// as the microservices architecture requires separate copies.
// These match the enum values in database/schemas/document.js
const DOCUMENT_STATUS = {
  PENDING: "pending",
  INDEXING: "indexing",
  INDEXED: "indexed",
  ERROR: "error",
};

module.exports = {
  DOCUMENT_STATUS,
};
