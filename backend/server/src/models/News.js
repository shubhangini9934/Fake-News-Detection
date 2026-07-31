import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      enum: ["TRUE", "FAKE"]
    },
    confidence: Number
  },
  { _id: false }
);

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    source: String,
    category: String,
    url: { type: String, unique: true, sparse: true },
    imageUrl: String,
    publishedAt: Date,
    bookmarked: { type: Boolean, default: false },
    isBreaking: { type: Boolean, default: false },
    verification: verificationSchema
  },
  { timestamps: true }
);

export const News = mongoose.model("News", newsSchema);
