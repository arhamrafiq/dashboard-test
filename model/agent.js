import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    sales: {
      type: Number,
      default: 0,
    },
  },
  { timestamp: true }
);

export const agentModel = new mongoose.model("agent", schema);
