// Document status constants
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
