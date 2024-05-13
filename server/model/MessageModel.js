import mongoose from "mongoose";

const modelUserReference = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
}

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    users: [modelUserReference],
    sender: modelUserReference,
    isDeleted : { type: Boolean , default : false},
    viewers : {
      type : [{...modelUserReference , required : false}],
      default : []
    }
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model('Message',messageSchema);