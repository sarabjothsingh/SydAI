const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getConfig } = require("../config");

const groqClientCache = new Map();
let googleClient;

function normalizeMessages(messages = []) {
  return messages.map((msg) => ({ role: msg.role, content: String(msg.content ?? "") }));
}

function messagesToGoogleContents(messages) {
  return messages.map((msg) => ({ role: msg.role, parts: [{ text: msg.content }] }));
}

function createGroqClient(apiKey) {
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  if (!groqClientCache.has(apiKey)) {
    groqClientCache.set(apiKey, new Groq({ apiKey }));
  }
  return groqClientCache.get(apiKey);
}

function getGoogleModel(apiKey, modelId) {
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not configured");
  }
  if (!googleClient) {
    googleClient = new GoogleGenerativeAI(apiKey);
  }
  return googleClient.getGenerativeModel({ model: modelId });
}

async function callGroq(modelConfig, messages, options = {}) {
  const {
    env: { groqApiKey },
  } = getConfig();
  const client = createGroqClient(groqApiKey);

  const response = await client.chat.completions.create({
    model: modelConfig.id,
    messages: normalizeMessages(messages),
    temperature: options.temperature ?? 0.1,
    max_tokens: options.maxTokens ?? 2048,
  });

  const choice = response.choices?.[0];
  if (!choice) return "";
  return choice.message?.content ?? "";
}

async function callGoogle(modelConfig, messages, options = {}) {
  const {
    env: { googleApiKey },
  } = getConfig();
  const model = getGoogleModel(googleApiKey, modelConfig.id);
  const response = await model.generateContent({
    contents: messagesToGoogleContents(messages),
    generationConfig: {
      temperature: options.temperature ?? 0.1,
      maxOutputTokens: options.maxTokens ?? 2048,
    },
  });

  return response.response?.text() ?? "";
}

const { findModel } = require("./modelRegistry");

async function generate(modelIdentifier, messages, options = {}) {
  const model = findModel(modelIdentifier);
  if (!model) {
    throw new Error(`Unknown model: ${modelIdentifier}`);
  }

  switch (model.type) {
    case "groq":
      return callGroq(model, messages, options);
    case "google_genai":
      return callGoogle(model, messages, options);
    default:
      throw new Error(`Unsupported model type: ${model.type}`);
  }
}

module.exports = {
  generate,
};
