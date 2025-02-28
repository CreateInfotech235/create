import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    imageName: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    projectName: { type: String, default: "Untitled" },
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);
