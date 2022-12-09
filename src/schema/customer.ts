import { model, Schema } from "mongoose";

interface ICustomer {
  customerId: string;
  orderNumbers: string[];
  wallet : object
}

const CustomerSchema = new Schema<ICustomer>({
  customerId: String,
  orderNumbers: [String],
  wallet: {
    type: Object
  }
});

export const CustomerModel = model("customer", CustomerSchema);
