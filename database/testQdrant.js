const { ensureCollectionExists } = require('./services/qdrantClient');

(async function () {
  try {
    await ensureCollectionExists('test-connection', 4);
    console.log('Qdrant reachable and collection ensured');
  } catch (err) {
    console.error('QDRANT TEST ERROR:', err.message);
    if (err.original) console.error('Original:', err.original);
    process.exit(1);
  }
})();

