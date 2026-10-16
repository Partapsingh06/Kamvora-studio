import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

export const initAdmin = async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.error('Could not connect to MongoDB. Ensure your MONGODB_URI is configured.');
    return false;
  }

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@kamvorastudio.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'KamvoraAdmin@2026';
  const adminName = process.env.ADMIN_NAME || 'Komal Kang (Admin)';
  const adminPhone = process.env.ADMIN_PHONE || '+91 99150-88706';

  try {
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.log(`Admin user '${adminEmail}' not found. Creating initial administrator account...`);
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: adminPhone,
        role: 'admin',
        addresses: [
          {
            fullName: adminName,
            phone: adminPhone,
            addressLine: 'Shop Number 399, Janta Market',
            city: 'Mohali',
            state: 'Punjab',
            postalCode: '160055',
            isDefault: true
          }
        ]
      });
      console.log(`✓ Initial administrator account (${adminEmail}) created successfully.`);
    } else {
      console.log(`Found existing admin account: ${admin.email}`);
      const matches = await admin.matchPassword(adminPassword);
      if (!matches) {
        console.log(`Password does not match (possibly due to corrupted or double-hashed seed). Updating password securely...`);
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(adminPassword, salt);
        await admin.save();
        console.log(`✓ Admin password updated and verified successfully.`);
      } else {
        console.log(`✓ Admin credentials verified and working.`);
      }
    }

    // Also check demo customer account if present
    const customer = await User.findOne({ email: 'aarav.sharma@example.com' });
    if (customer) {
      const custPass = 'Customer@2026';
      const custMatches = await customer.matchPassword(custPass);
      if (!custMatches) {
        const salt = await bcrypt.genSalt(10);
        customer.password = await bcrypt.hash(custPass, salt);
        await customer.save();
        console.log(`✓ Customer demo password updated and verified successfully.`);
      }
    }

    return true;
  } catch (error) {
    console.error('Error in initAdmin:', error.message);
    return false;
  } finally {
    if (process.argv[1]?.includes('initAdmin.js')) {
      await mongoose.disconnect();
      console.log('Database disconnected.');
    }
  }
};

if (process.argv[1]?.includes('initAdmin.js')) {
  initAdmin().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
