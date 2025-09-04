import mongoose from "mongoose";

interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend Node.js global type
declare global {
  var mongooseCache: MongooseGlobal | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export default async function connectToDatabase() {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not set in .env");

    cached!.promise = mongoose.connect(uri, {
      dbName: "Sih_project",
    });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
