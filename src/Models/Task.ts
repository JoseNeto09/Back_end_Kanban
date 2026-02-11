import { Schema, model, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'pendente' | 'andamento' | 'feito';
  priority?: 'baixa' | 'media' | 'alta';
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pendente', 'andamento', 'feito'],
      default: 'pendente'
    },
    priority: {
      type: String,
      enum: ['baixa', 'media', 'alta'],
      default: 'media'
    }
  },
  { timestamps: true }
);

export default model<ITask>("Task", TaskSchema);