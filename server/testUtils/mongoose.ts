import mongoose from "mongoose";

const mongoUri =
  process.env.MY_MONGO_URI ||
  "mongodb://user:pass@localhost:27017/mydatabase?authSource=admin";

export const connectMongoose = async () => mongoose.connect(mongoUri);
export const disconnectMongoose = async () => mongoose.disconnect();