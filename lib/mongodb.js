import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {};
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose).catch((error) => {
      console.error('Connection to MongoDB refused:', error);
      throw error;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;
