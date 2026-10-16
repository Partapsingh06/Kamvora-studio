import mongoose from 'mongoose';

const customOrderRequestSchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    productType: {
      type: String,
      required: [true, 'Product type is required'],
      enum: [
        'Handmade Embroidery',
        'Resin Art',
        'Fabric Painting',
        'Portraits',
        'Handmade Gifts',
        'Customized Gifts',
        'Home Decor',
        'Personalized Accessories',
        'Other'
      ]
    },
    designDescription: {
      type: String,
      required: [true, 'Design description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    preferredColors: {
      type: String,
      default: ''
    },
    budget: {
      type: String,
      default: 'Flexible'
    },
    requiredDate: {
      type: Date,
      default: null
    },
    referenceImages: {
      type: [String],
      default: []
    },
    additionalInstructions: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewing', 'Quoted', 'In Progress', 'Completed', 'Rejected'],
      default: 'Pending'
    },
    adminQuote: {
      amount: { type: Number, default: 0 },
      note: { type: String, default: '' },
      quotedAt: { type: Date, default: null }
    },
    internalNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const CustomOrderRequest = mongoose.model('CustomOrderRequest', customOrderRequestSchema);
export default CustomOrderRequest;
