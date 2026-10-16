import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    shortDescription: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (val) {
          return val === null || val === undefined || val < this.price;
        },
        message: 'Discount price must be less than the regular price'
      }
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    categoryName: {
      type: String,
      default: ''
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 5
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A product must have at least one image'
      }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    tags: {
      type: [String],
      default: []
    },
    specifications: {
      materials: { type: String, default: 'Eco-friendly, Artisan Grade Materials' },
      dimensions: { type: String, default: 'Standard Studio Craft Dimensions' },
      careInstructions: { type: String, default: 'Keep away from direct excessive moisture and harsh chemicals. Gently dust with a soft dry cloth.' },
      handmadeIn: { type: String, default: 'Kamvora Studio, Mohali, Punjab' },
      craftType: { type: String, default: 'Handcrafted Artwork' },
      weight: { type: String, default: 'Approx 350g' }
    },
    customizationAvailable: {
      type: Boolean,
      default: false
    },
    customizationGuide: {
      type: String,
      default: 'Custom names, dates, quotes, or color palette adjustments can be requested.'
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Text search index for name, description, tags, craftType
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
