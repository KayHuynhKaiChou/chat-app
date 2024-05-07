import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted : { type: Boolean , default : false}
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model('Message',messageSchema);