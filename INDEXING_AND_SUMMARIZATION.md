# Document Indexing and Summarization Guide

## Overview
This document describes the enhanced document indexing and summarization features added to SydAI.

## Changes Made

### 1. Document Status Tracking
The document schema now supports four status states:
- `pending`: Document is waiting to be processed
- `indexing`: Document is currently being indexed
- `indexed`: Document has been successfully indexed and is ready for use
- `error`: Document indexing failed

### 2. Progress Tracking
Each document now has a `progress` field (0-100) to track indexing completion percentage.

### 3. New API Endpoints

#### GET /ai/documents/status
Returns the status of all documents for the authenticated user.

**Response:**
```json
{
  "documents": [
    {
      "name": "example.pdf",
      "status": "indexed",
      "progress": 100,
      "chunkCount": 25,
      "errorMessage": null,
      "updatedAt": "2025-11-22T13:00:00.000Z"
    }
  ],
  "summary": {
    "total": 5,
    "indexed": 4,
    "indexing": 1,
    "pending": 0,
    "error": 0
  }
}
```

### 4. Enhanced Summarization Validation
The `/ai/summarize` endpoint now validates that:
- All requested documents are fully indexed before attempting summarization
- Returns a clear error message if documents are still being indexed
- Lists which documents are still being processed

**Error Response Example:**
```json
{
  "message": "Some documents are still being indexed. Please wait for indexing to complete.",
  "indexing": ["large-document.pdf"]
}
```

### 5. Improved Logging
The ingest pipeline now includes detailed logging at each stage:
- Text extraction progress
- Chunk creation
- Embedding generation start and completion
- Storage operations
- Error details with context

## Usage

### Checking Indexing Status
To check the status of document indexing:

```typescript
import { fetchDocumentsStatus } from '@/lib/aiClient';

const status = await fetchDocumentsStatus();
console.log(`Total documents: ${status.summary.total}`);
console.log(`Indexed: ${status.summary.indexed}`);
console.log(`Still indexing: ${status.summary.indexing}`);
```

### Polling for Completion
For large documents that may take time to index, you can poll the status:

```typescript
async function waitForIndexing() {
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes with 5-second intervals
  
  while (attempts < maxAttempts) {
    const status = await fetchDocumentsStatus();
    
    if (status.summary.indexing === 0 && status.summary.pending === 0) {
      console.log('All documents indexed!');
      return true;
    }
    
    console.log(`Still indexing ${status.summary.indexing} documents...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }
  
  console.error('Indexing timeout');
  return false;
}
```

### Summarizing Documents
The summarization endpoint will now automatically check document status:

```typescript
import { summarizeDocuments } from '@/lib/aiClient';

try {
  const result = await summarizeDocuments('gemini-1.5-flash', ['document.pdf']);
  console.log('Summary:', result.summary);
} catch (error) {
  // Error will contain helpful message if documents are still indexing
  console.error(error.message);
}
```

## Troubleshooting

### 504 Gateway Timeout Errors
If you experience timeout errors during indexing:
1. Check that the embedding service is running and responsive
2. Monitor server logs for progress (look for `[INGEST]` log entries)
3. Use the `/ai/documents/status` endpoint to check if indexing is progressing
4. For very large documents, consider splitting them into smaller files

### Documents Stuck in "indexing" Status
If a document remains in "indexing" status:
1. Check the server logs for error messages
2. Verify the embedding service is running (`GET /ai/health`)
3. The document may have failed - check for an "error" status or error message

### Summarization Fails
If summarization fails with "still being indexed" message:
1. Wait for indexing to complete
2. Check the status endpoint to see which documents are pending
3. Ensure all documents have status "indexed" before attempting summarization
