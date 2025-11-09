import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  moodStatus: {
    type: String,
    default: "Happy",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("UserMood", profileSchema);
