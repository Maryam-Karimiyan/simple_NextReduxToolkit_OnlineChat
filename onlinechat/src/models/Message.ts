// import mongoose, { Schema, models, model } from "mongoose";

// const MessageSchema = new Schema(
//   {
//     text: { type: String, required: true, trim: true },
//     room: { type: String, default: "global" },
//     senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   },
//   { timestamps: true }
// );

// export type TMessage = {
//   _id: string;
//   text: string;
//   room: string;
//   senderId: string;
//   createdAt: Date;
// };

// export default models.Message || model("Message", MessageSchema);
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
