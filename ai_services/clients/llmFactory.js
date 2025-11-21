const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Anthropic = require("@anthropic-ai/sdk");
const { getConfig } = require("../config");

const groqClientCache = new Map();
let googleClient;
let anthropicClient;

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

function createAnthropicClient(apiKey) {
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
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

async function callAnthropic(modelConfig, messages, options = {}) {
  const {
    env: { anthropicApiKey },
  } = getConfig();
  const client = createAnthropicClient(anthropicApiKey);

  // Anthropic requires separating system messages from user/assistant messages
  const systemMessage = messages.find((msg) => msg.role === "system");
  const conversationMessages = messages
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: String(msg.content ?? ""),
    }));

  const response = await client.messages.create({
    model: modelConfig.id,
    max_tokens: options.maxTokens ?? 2048,
    temperature: options.temperature ?? 0.1,
    system: systemMessage?.content ?? undefined,
    messages: conversationMessages,
  });

  return response.content?.[0]?.text ?? "";
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
    case "anthropic":
      return callAnthropic(model, messages, options);
    default:
      throw new Error(`Unsupported model type: ${model.type}`);
  }
}

module.exports = {
  generate,
};
