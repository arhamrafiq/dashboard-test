import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    price: {
      type: Number,
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    agentID: {
      type: String,
    },
    agentName: {
      type: String,
    },
  },
  { timestamps: true }
);

export const orderModel = new mongoose.model("order", Schema);
