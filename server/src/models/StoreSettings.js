import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema(
  {
    announcement: {
      text: {
        type: String,
        default: 'Handcrafted with Love | Discover Something Unique | Free Shipping on Orders Over ₹999'
      },
      isActive: { type: Boolean, default: true },
      link: { type: String, default: '/shop' }
    },
    contact: {
      email: { type: String, default: 'Kamvorastudio@gmail.com' },
      phone: { type: String, default: '+91 99150-88706' },
      address: { type: String, default: 'Shop Number 399, Janta Market, Mohali, Punjab, India' },
      instagram: {
        type: String,
        default: 'https://www.instagram.com/iamkomalkang?igsh=MWh4aWlhNzU1emd5cQ=='
      },
      workingHours: { type: String, default: 'Mon - Sat: 10:00 AM - 7:30 PM' }
    },
    shipping: {
      shippingFee: { type: Number, default: 80 },
      freeShippingThreshold: { type: Number, default: 999 },
      codAvailable: { type: Boolean, default: true }
    },
    hero: {
      heading: { type: String, default: 'Art That Speaks. Crafts That Tell Stories.' },
      subheading: {
        type: String,
        default: 'Discover thoughtfully handcrafted creations, personalized gifts, and unique artistic pieces made to make every moment special.'
      },
      badgeText: { type: String, default: 'Handmade Luxury by Komal Kang' }
    }
  },
  {
    timestamps: true
  }
);

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);
export default StoreSettings;
