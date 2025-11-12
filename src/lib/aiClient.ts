const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:3000";

export type ModelConfig = {
  display_name: string;
  type: string;
  id: string;
};

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchModels(): Promise<ModelConfig[]> {
  const response = await fetch(`${API_BASE}/ai/models`, {
    credentials: "include",
  });
  const payload = await handleJsonResponse<{ models: ModelConfig[] }>(response);
  return payload.models;
}

export async function ingestDocuments(files: File[]): Promise<{ ok: boolean; ingested: number }>
{
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file, file.name));

  const response = await fetch(`${API_BASE}/ai/ingest`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  return handleJsonResponse(response);
}

export async function queryAI(question: string, modelId: string): Promise<{ answer: string; matches: any[] }>
{
  const response = await fetch(`${API_BASE}/ai/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, model: modelId }),
    credentials: "include",
  });

  return handleJsonResponse(response);
}

export async function summarizeDocuments(modelId: string, filenames: string[]): Promise<{ summary: string }>
{
  const response = await fetch(`${API_BASE}/ai/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: modelId, filenames }),
    credentials: "include",
  });

  return handleJsonResponse(response);
}

export async function checkAiHealth(): Promise<any> {
  const response = await fetch(`${API_BASE}/ai/health`, {
    credentials: "include",
  });
  return handleJsonResponse(response);
}
