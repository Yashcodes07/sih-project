import mongoose from "mongoose";

interface MongooseGlobal {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend Node.js global type
declare global {
  var mongooseCache: MongooseGlobal | undefined;
}

let cached: MongooseGlobal;

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}
cached = global.mongooseCache;

export default async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not set in .env");

    const dbName = process.env.MONGODB_DBNAME || "SIH_Project";

    cached.promise = mongoose.connect(uri, { dbName });
  }
  // Multiple concurrent calls to connectToDatabase will await the same promise,
  // ensuring only one connection attempt is made.
  cached.conn = await cached.promise;
  console.log("Connected DB Name:", mongoose.connection.name);
  return cached.conn;
}
