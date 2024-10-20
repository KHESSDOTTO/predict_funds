import mongoose from "mongoose";

interface MongoConnCacheType {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

const mongoConnCache: MongoConnCacheType = { conn: null, promise: null };

export default mongoConnCache;
