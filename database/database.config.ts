import mongoose from "mongoose";
import cache from "@/utils/mongoCache";

mongoose.set("strictQuery", false);

let connectionPromise: Promise<mongoose.Mongoose> | null = null;

async function connect(): Promise<mongoose.Mongoose> {
  if (cache.conn && process.env.NODE_ENV === "development") {
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
  const hasSigintListener = process.rawListeners("SIGINT").length > 0;
  const hasSigtermListener = process.rawListeners("SIGTERM").length > 0;

  // Check if SIGINT listener is already added
  if (!hasSigintListener) {
    process.on("SIGINT", async () => {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB.");
      process.exit(0);
    });
  }

  // Check if SIGTERM listener is already added
  if (!hasSigtermListener) {
    process.on("SIGTERM", async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  }
}

if (process.env.NODE_ENV === "development") {
  addListeners();
}

export { connect };
