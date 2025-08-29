import mongoose from "mongoose";

let connection: typeof mongoose;

// deployment
// deploy
const url = process.env.MONGODB_URI! || "mongodb://localhost:27017/lasflores";

const startDb = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(url, {});
    }

    console.log("Connected to MongoDB");
    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default startDb;
