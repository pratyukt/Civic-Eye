import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DB_CONNECT_URI = process.env.DB_CONNECT_URI;
    await mongoose.connect(DB_CONNECT_URI);
    console.log("Connected to database server successfully");
  } catch (err) {
    console.error("Error while connecting to server", err.message);
  }
};

export default connectDB;   
