const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    sizeBytes: { type: Number, default: 0 },
    chunkCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "indexing", "indexed", "error"],
      default: "pending",
      index: true,
    },
    errorMessage: { type: String },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    metadata: { type: mongoose.Schema.Types.Mixed },
    lastProcessedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

DocumentSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Document", DocumentSchema);
