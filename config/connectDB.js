import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose
      .connect(`${process.env.db_URL}`)
      .then(console.log("connect to database"));
  } catch (error) {
    console.log(error);
  }
};
