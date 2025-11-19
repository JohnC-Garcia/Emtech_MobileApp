//config/rawDB.js
import mongoose from "mongoose";

export const connectRawDB = async () => {
  try {
    const uri = "mongodb+srv://user:user123@sensor-dev-db.ksssy2x.mongodb.net/microgridDB?retryWrites=true&w=majority&appName=sensor-dev-db";
    const conn = await mongoose.createConnection(uri, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log(`Raw data DB connected: ${conn.name}`);
    return conn;
  } catch (error) {
    console.error("Raw DB connection error:", error.message);
    throw error;
  }
};
