import { model, Schema } from "mongoose";

interface IJob {
  orderNumber: String;
  customerId: string;
  workerId: string;
  user: string;
  pass: string;
  bankPin: string;
}

const jobSchema = new Schema<IJob>({
  orderNumber: String,
  customerId: String,
  workerId: String,
  user: String,
  pass: String,
  bankPin: String,
});

export const jobModel = model("job", jobSchema);
