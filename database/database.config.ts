import mongoose from "mongoose";
import cache from "@/utils/mongoCache";

mongoose.set("strictQuery", false);

let listenersAdded = false;
let connectionPromise: Promise<mongoose.Mongoose> | null = null;

async function connect(): Promise<mongoose.Mongoose> {
  if (cache.conn) {
    console.log("Did not create new connection.");
    return cache.conn;
  }

  if (!connectionPromise) {
    const opts = {
      bufferCommands: false,
    };

    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      throw new Error(
        "MONGODB_URI is not defined in your environment variables"
      );
    }

    connectionPromise = mongoose.connect(dbUri, opts).then((mongoose) => {
      cache.conn = mongoose;
      return mongoose;
    });
    console.log("Created connection.");
  }

  cache.conn = await connectionPromise;
  return cache.conn;
}

function addListeners() {
  if (listenersAdded) {
    return;
  }

  console.log("Adding SIGINT and SIGTERM listeners.");

  process.on("SIGINT", async () => {
    console.log("SIGINT received, shutting down...");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down...");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  });

  listenersAdded = true;
}

if (process.env.NODE_ENV === "development") {
  addListeners();
}

export { connect };
