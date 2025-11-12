const fetch = require("cross-fetch");
const { getConfig } = require("../config");

function getBaseUrl() {
  const {
    env: { databaseServiceUrl },
  } = getConfig();
  return databaseServiceUrl.replace(/\/$/, "");
}

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Database service error: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }
  return response.json();
}

async function ingestDocument(payload) {
  const response = await fetch(`${getBaseUrl()}/documents/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

async function listDocuments(userId) {
  const response = await fetch(`${getBaseUrl()}/documents?userId=${encodeURIComponent(userId)}`);
  return handleResponse(response);
}

async function deleteDocument({ documentId, userId }) {
  const response = await fetch(
    `${getBaseUrl()}/documents/${encodeURIComponent(documentId)}?userId=${encodeURIComponent(userId)}`,
    { method: "DELETE" }
  );
  return handleResponse(response);
}

async function searchVectors(payload) {
  const response = await fetch(`${getBaseUrl()}/vectors/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

async function scrollVectors(payload) {
  const response = await fetch(`${getBaseUrl()}/vectors/scroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

module.exports = {
  ingestDocument,
  listDocuments,
  deleteDocument,
  searchVectors,
  scrollVectors,
};
