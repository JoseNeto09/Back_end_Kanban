import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    title: String,
    description: String,
    status: String,
  },
  { timestamps: true }
);

export default model("Task", TaskSchema);
