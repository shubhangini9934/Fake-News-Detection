import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News"
    },
    title: { type: String, required: true },
    source: String,
    url: String,
    text: { type: String, required: true },
    label: {
      type: String,
      enum: ["TRUE", "FAKE"],
      required: true
    },
    confidence: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Verification = mongoose.model("Verification", verificationSchema);
