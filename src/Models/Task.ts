import { Schema, model, Types } from "mongoose";

interface Task {
  title: string;
  description: string;
  status: string;
  user: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<Task>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["todo", "doing", "done"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // 👈 cria createdAt e updatedAt automaticamente
  }
);

export default model<Task>("Task", TaskSchema);
