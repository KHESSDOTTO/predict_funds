import mongoose from "mongoose";
import cache from "@/utils/mongoCache";

mongoose.set("strictQuery", false);

async function connect(): Promise<mongoose.Mongoose> {
  if (cache.conn) {
    console.log("Did not create new connection.");
    return cache.conn;
  }

  if (!cache.promise) {
    const opts = {
      bufferCommands: false,
    };

    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      throw new Error(
        "MONGODB_URI is not defined in your environment variables"
      );
    }

    cache.promise = mongoose.connect(dbUri, opts).then(() => mongoose);
    console.log("Created connection.");
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

if (process.env.NODE_ENV === "development") {
  console.log("I am here where i should be.");
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
}

export { connect };
