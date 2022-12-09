import { model, Schema } from "mongoose";

interface IWorker {
  workerId: string;
  deposit: string;
  tax: number;
  currentJobsAmount: number;
  maxJobAmount: number;
}

const WorkerSchema = new Schema<IWorker>({
  workerId: String,
  deposit: String,
  tax: Number,
  currentJobsAmount: Number,
  maxJobAmount: Number,
});

export const WorkerModel = model<IWorker>("worker", WorkerSchema);
