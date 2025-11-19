//config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = "mongodb+srv://user:user123@sensor-dev-db.ksssy2x.mongodb.net/microgridDB?retryWrites=true&w=majority&appName=sensor-dev-db";
    const conn = await mongoose.connect(uri, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log(`MongoDB connected: ${conn.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
