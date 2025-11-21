export type ModelConfig = {
  display_name: string;
  type: string;
  id: string;
  summary_token_limit?: number;
  summary_overlap_tokens?: number;
};

export type StoredDocument = {
  _id: string;
  name: string;
  sizeBytes: number;
  chunkCount: number;
  status: string;
  lastProcessedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchModels(): Promise<ModelConfig[]> {
  const response = await fetch(`/ai/models`, {
    credentials: "include",
  });
  const payload = await handleJsonResponse<{ models: ModelConfig[] }>(response);
  return payload.models;
}

export async function ingestDocuments(files: File[]): Promise<{ ok: boolean; ingested: number; documents?: StoredDocument[] }>
{
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file, file.name));

  const response = await fetch(`/ai/ingest`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  return handleJsonResponse(response);
}

export async function queryAI(question: string, modelId: string): Promise<{ answer: string; matches: any[] }>
{
  const response = await fetch(`/ai/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, model: modelId }),
    credentials: "include",
  });

  return handleJsonResponse(response);
}

export async function fetchDocuments(): Promise<StoredDocument[]> {
  const response = await fetch(`/ai/documents`, {
    credentials: "include",
  });
  const payload = await handleJsonResponse<{ documents: StoredDocument[] }>(response);
  return payload.documents ?? [];
}

export async function deleteDocument(documentId: string): Promise<void> {
  const response = await fetch(`/ai/documents/${documentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleJsonResponse(response);
}

export async function summarizeDocuments(modelId: string, filenames: string[]): Promise<{ summary: string }>
{
  const response = await fetch(`/ai/summarize`, {
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
  const response = await fetch(`/ai/health`, {
    credentials: "include",
  });
  return handleJsonResponse(response);
}
