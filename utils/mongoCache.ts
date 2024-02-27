// lib/mongoCache.ts
import mongoose from "mongoose";

interface MongoCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

const cache: MongoCache = { conn: null, promise: null };

export default cache;
