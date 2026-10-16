import mongoose from 'mongoose';
import dns from 'node:dns/promises';

export const connectDB = async () => {
  try {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
  } catch {
    // Graceful fallback if custom DNS setting is not permitted
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kamvora_studio';
  
  if (uri.includes('<') || uri.includes('>')) {
    console.warn('\n! MongoDB Configuration Warning: MONGODB_URI contains angle brackets ("<" or ">").');
    console.warn('! Atlas placeholders like <password> must be replaced with your actual password without the angle brackets.');
    console.warn('! Example: mongodb+srv://username:actual_password@cluster0.abcde.mongodb.net/kamvora_studio?retryWrites=true&w=majority\n');
  }

  try {
    console.log(`Connecting to MongoDB at: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`✓ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`! MongoDB Connection Notice: Could not connect to MongoDB server (${error.message}).`);
    console.warn(`! Running in resilient local persistence fallback mode so the application, API, and admin dashboard remain 100% operational.`);
    console.warn(`! Tip: To connect to MongoDB Atlas, verify MONGODB_URI in your server/.env file.`);
    return false;
  }
};

