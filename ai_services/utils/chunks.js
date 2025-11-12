const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

async function chunkText(text, metadata = {}) {
  const splits = await splitter.splitText(text);
  return splits
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk, index) => ({
      text: chunk,
      metadata: { ...metadata, chunk_index: index },
    }));
}

module.exports = {
  chunkText,
};
