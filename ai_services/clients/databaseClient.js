const fetch = require("cross-fetch");
const { getConfig } = require("../config");

function getBaseUrl() {
  const {
    env: { databaseServiceUrl },
  } = getConfig();
  return databaseServiceUrl.replace(/\/$/, "");
}

async function handleResponse(response) {
  // If not OK, try to parse JSON body and include status + body on the thrown Error
  if (!response.ok) {
    let bodyText = "";
    let parsed = null;
    try {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        parsed = await response.json();
        bodyText = JSON.stringify(parsed);
      } else {
        bodyText = await response.text().catch(() => "");
      }
    } catch (err) {
      bodyText = `Failed to read error body: ${err.message}`;
    }

    const err = new Error(parsed?.message || bodyText || `Database service error: ${response.status}`);
    err.status = response.status;
    err.body = parsed ?? bodyText;
    err.statusText = response.statusText;
    err.url = response.url;
    throw err;
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

async function getDocumentsStatus(userId) {
  const response = await fetch(`${getBaseUrl()}/documents/status?userId=${encodeURIComponent(userId)}`);
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
  getDocumentsStatus,
  deleteDocument,
  searchVectors,
  scrollVectors,
};
