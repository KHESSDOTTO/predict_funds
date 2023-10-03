import mongoose from "mongoose";

mongoose.set("strictQuery", false);

async function connect() {
  try {
    if (process.env.MONGODB_URI) {
      const dbConnect = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`Connected to db: ${dbConnect.connection.name}`);
    } else {
      console.log("MONGODB_URI is undefined.");
    }
  } catch (err) {
    console.log(err);
  }
}

async function disconnect() {
  try {
    await mongoose.disconnect();
    console.log(`Disconnected from db.`);
  } catch (err) {
    console.log(err);
  }
}

export { connect, disconnect };
