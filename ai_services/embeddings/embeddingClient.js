const fetch = require("cross-fetch");
const { getConfig } = require("../config");

async function embedTexts(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error("embedTexts expects a non-empty array of strings");
  }

  const {
    env: { embeddingServiceUrl },
  } = getConfig();

  const url = `${embeddingServiceUrl.replace(/\/$/, "")}/embeddings`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ texts }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Embedding service error: ${response.status} ${text}`);
  }

  const payload = await response.json();
  if (!payload || !Array.isArray(payload.vectors)) {
    throw new Error("Embedding service returned an unexpected payload");
  }

  return payload.vectors;
}

async function healthCheck() {
  const {
    env: { embeddingServiceUrl },
  } = getConfig();

  const url = `${embeddingServiceUrl.replace(/\/$/, "")}/healthz`;
  const response = await fetch(url).catch(() => null);
  return Boolean(response && response.ok);
}

module.exports = {
  embedTexts,
  healthCheck,
};
