import mongoose from "mongoose";
import mongoConnCache from "@/cache/mongoConnCache";

mongoose.set("strictQuery", false);

let connectionPromise: Promise<mongoose.Mongoose> | null = null;

async function connect(): Promise<mongoose.Mongoose> {
  // Use cached connection only in development
  if (process.env.NODE_ENV === "development" && mongoConnCache.conn) {
    console.log("Using cached connection in development.");
    return mongoConnCache.conn;
  }

  if (!connectionPromise) {
    const opts = { bufferCommands: false };
    const dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
      throw new Error(
        "MONGODB_URI is not defined in your environment variables"
      );
    }

    connectionPromise = mongoose.connect(dbUri, opts).then((mongoose) => {
      // Only set cache for connection in development
      if (process.env.NODE_ENV === "development") {
        mongoConnCache.conn = mongoose;
      }
      return mongoose;
    });

    console.log("Created new connection.");
  }

  return connectionPromise;
}

function addListeners() {
  const signals = ["SIGINT", "SIGTERM"];

  signals.forEach((signal) => {
    if (process.rawListeners(signal).length === 0) {
      process.on(signal, async () => {
        await mongoose.disconnect();
        console.log(`Disconnected from MongoDB on ${signal}.`);
        process.exit(0);
      });
    }
  });
}

if (process.env.NODE_ENV === "development") {
  addListeners();
}

export { connect };
