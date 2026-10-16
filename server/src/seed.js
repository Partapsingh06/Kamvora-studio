import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import StoreSettings from './models/StoreSettings.js';
import Review from './models/Review.js';

dotenv.config();

const categoriesData = [
  {
    name: 'Handmade Embroidery',
    slug: 'handmade-embroidery',
    description: 'Intricately hand-stitched hoop art, botanical tapestries, and customized thread memories.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Resin Art',
    slug: 'resin-art',
    description: 'High-gloss crystal resin creations with ocean swirls, gold leafing, and floral preservations.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Fabric Painting',
    slug: 'fabric-painting',
    description: 'Wearable art, hand-painted sarees, dupattas, cushion covers, and organic canvas totes.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Portraits',
    slug: 'portraits',
    description: 'Hand-drawn charcoal, graphite, and watercolor portrait sketches made with emotional depth.',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Handmade Gifts',
    slug: 'handmade-gifts',
    description: 'Thoughtfully curated artisan gift hampers, keepsake wooden boxes, and festive tokens.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Customized Gifts',
    slug: 'customized-gifts',
    description: 'Bespoke gifts personalized with names, anniversary dates, heartfelt letters, and photos.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Boho macrame wall hangings, terracotta accents, tea light holders, and decorative platters.',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80',
    isActive: true
  },
  {
    name: 'Personalized Accessories',
    slug: 'personalized-accessories',
    description: 'Floral resin bookmarks, initial alphabet keychains, pendants, and dainty artisan trinkets.',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80',
    isActive: true
  }
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kamvora_studio';
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    }

    console.log('Seeding initial Kamvora Studio data...');

    // Clear existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Coupon.deleteMany();
    await StoreSettings.deleteMany();
    await Review.deleteMany();

    // 1. Seed Categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✓ Inserted ${createdCategories.length} categories.`);

    const catMap = {};
    createdCategories.forEach((cat) => {
      catMap[cat.slug] = cat._id;
    });

    // 2. Seed Admin & Customer User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@kamvorastudio.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'KamvoraAdmin@2026';
    const adminName = process.env.ADMIN_NAME || 'Komal Kang (Admin)';
    const adminPhone = process.env.ADMIN_PHONE || '+91 99150-88706';

    const customerPassword = process.env.CUSTOMER_PASSWORD || 'Customer@2026';

    const adminUser = await User.create({
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

    const customerUser = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      password: customerPassword,
      phone: '+91 98765-43210',
      role: 'customer',
      addresses: [
        {
          fullName: 'Aarav Sharma',
          phone: '+91 98765-43210',
          addressLine: 'House 142, Sector 70',
          city: 'Mohali',
          state: 'Punjab',
          postalCode: '160071',
          isDefault: true
        }
      ]
    });

    console.log('✓ Inserted Admin & Customer accounts.');

    // 3. Seed Art & Craft Products
    const productsData = [
      {
        name: 'Celestial Bloom Embroidered Floral Hoop (10-inch)',
        slug: 'celestial-bloom-embroidered-floral-hoop',
        description: 'Meticulously hand-embroidered on pure organic cotton linen using premium anchor cotton threads. Features intricate French knots, bullion roses, and celestial golden metallic thread accents. Mounted on a polished natural beechwood embroidery hoop ready to grace any wall.',
        shortDescription: 'Handcrafted 10-inch botanical floral embroidery with golden starry thread accents.',
        price: 1850,
        discountPrice: 1499,
        category: catMap['handmade-embroidery'],
        categoryName: 'Handmade Embroidery',
        stock: 12,
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=900&q=80'
        ],
        isFeatured: true,
        isAvailable: true,
        tags: ['embroidery', 'floral', 'hoop-art', 'wall-decor', 'handmade'],
        specifications: {
          materials: '100% Cotton Linen, Egyptian Thread, Beechwood Hoop',
          dimensions: '10 inches (25.4 cm) diameter',
          careInstructions: 'Keep dry, dust gently with soft brush. Avoid prolonged intense sunlight.',
          handmadeIn: 'Kamvora Studio, Mohali, Punjab',
          craftType: 'Needlework & Hand Embroidery',
          weight: '180g'
        },
        customizationAvailable: true,
        customizationGuide: 'Custom initials, wedding dates, or quote embroidery can be stitched upon request.',
        rating: 5.0,
        numReviews: 8
      },
      {
        name: 'Personalized Botanical Wedding Monogram Hoop',
        slug: 'personalized-botanical-wedding-monogram-hoop',
        description: 'Celebrate lasting love with our signature heirloom wedding hoop. Stitched with delicate wild blossoms, eucalyptus sprigs, and the couple’s entwined monogram initials and significant date in shimmering metallic thread.',
        shortDescription: 'Customized couple wedding and anniversary embroidery hoop with monogram.',
        price: 2200,
        discountPrice: 1899,
        category: catMap['handmade-embroidery'],
        categoryName: 'Handmade Embroidery',
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80'
        ],
        isFeatured: true,
        isAvailable: true,
        tags: ['wedding-gift', 'anniversary', 'customized-embroidery', 'monogram'],
        specifications: {
          materials: 'Unbleached Organic Muslin, German Anchor Floss, Wood Frame',
          dimensions: '12 inches diameter',
          careInstructions: 'Dust with clean dry cloth. Store in temperate indoor spaces.',
          handmadeIn: 'Kamvora Studio, Mohali, Punjab',
          craftType: 'Custom Hand Needlework',
          weight: '220g'
        },
        customizationAvailable: true,
        customizationGuide: 'Please enter Couple Names and Wedding/Anniversary Date in the order notes.',
        rating: 4.9,
        numReviews: 12
      },
      {
        name: 'Azure Ocean Wave Resin Wall Clock (14-inch Silent Quartz)',
        slug: 'azure-ocean-wave-resin-wall-clock',
        description: 'Capturing the wild beauty of turquoise ocean tides crashing against golden sandy shores. Made with multilayered art-grade UV-resistant crystal resin on seasoned MDF wood, finished with sleek gold clock hands and a silent sweep quartz movement.',
        shortDescription: '14-inch handcrafted resin ocean tide wall clock with silent quartz movement.',
        price: 3499,
        discountPrice: 2999,
        category: catMap['resin-art'],
        categoryName: 'Resin Art',
        stock: 8,
        images: [
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
        ],
        isFeatured: true,
        isAvailable: true,
        tags: ['resin-clock', 'ocean-wave', 'wall-art', 'luxury-decor'],
        specifications: {
          materials: 'Non-Toxic Art Resin, Real Beach Sand, Quartz Sweep Mechanism',
          dimensions: '14 inches (35.5 cm) diameter, 18mm thickness',
          careInstructions: 'Wipe with microfiber cloth. Keep away from direct heaters or radiators.',
          handmadeIn: 'Kamvora Studio, Mohali, Punjab',
          craftType: 'Ocean Resin Fluid Art',
          weight: '1.2 kg'
        },
        customizationAvailable: true,
        customizationGuide: 'Custom diameters and numbering font styles available upon request.',
        rating: 4.9,
        numReviews: 15
      },
      {
        name: 'Gilded Geode Resin Coasters (Set of 6 with Holder)',
        slug: 'gilded-geode-resin-coasters-set-of-6',
        description: 'Transform your coffee table into an opulent gallery. Hand-cast geode-inspired coasters accented with translucent emerald and cream pigments, shimmering mica crystals, and luxurious hand-painted 24K liquid gold leaf edges.',
        shortDescription: 'Luxury set of 6 heat-resistant crystal resin coasters with gold-leafed rims.',
        price: 1299,
        discountPrice: 999,
        category: catMap['resin-art'],
        categoryName: 'Resin Art',
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80'
        ],
        isFeatured: false,
        isAvailable: true,
        tags: ['coasters', 'resin', 'geode', 'gold-leaf', 'tableware'],
        specifications: {
          materials: 'Heat-Resistant Food Safe Resin, Mica Pigments, Liquid Leaf',
          dimensions: 'Approx 4.5 inches each, 8mm thickness',
          careInstructions: 'Hand wash with mild soapy water. Not dishwasher or microwave safe.',
          handmadeIn: 'Kamvora Studio, Mohali, Punjab',
          craftType: 'Resin Geode Casting',
          weight: '450g'
        },
        customizationAvailable: true,
        customizationGuide: 'Can be customized in blush rose, sapphire blue, or smoky quartz hues.',
        rating: 4.8,
        numReviews: 9
      },
      {
        name: 'Hand-Painted Chanderi Silk Floral Dupatta',
        slug: 'hand-painted-chanderi-silk-floral-dupatta',
        description: 'Exquisite hand-painted botanical artwork on sheer, lightweight pure Chanderi silk. Features freehand vintage English roses in soft coral, sage green, and dust gold accents. Color-fast textile pigments ensure durable, lasting vibrance.',
        shortDescription: 'Bespoke hand-painted floral motifs on pure Chanderi silk dupatta (2.5m).',
        price: 2899,
        discountPrice: 2450,
        category: catMap['fabric-painting'],
        categoryName: 'Fabric Painting',
        stock: 6,
        images: [
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80'
        ],
        isFeatured: true,
        isAvailable: true,
        tags: ['fabric-painting', 'silk-dupatta', 'wearable-art', 'traditional-craft'],
        specifications: {
          materials: 'Pure Chanderi Silk, Non-Toxic Permanent Fabric Acrylics',
          dimensions: '2.5 meters length, 36 inches width',
          careInstructions: 'Dry clean only or gentle hand wash in cold water with mild detergent.',
          handmadeIn: 'Kamvora Studio, Mohali, Punjab',
          craftType: 'Freehand Textile Artistry',
          weight: '160g'
        },
        customizationAvailable: true,
        customizationGuide: 'Custom base fabric colors and personalized floral patterns available.',
        rating: 5.0,
        numReviews: 6
      },
      {
        name: 'Artisanal Hand-Painted Canvas Tote Bag (Sunflowers)',
        slug: 'artisanal-hand-painted-canvas-tote-sunflowers',
        description: 'A charming, eco-friendly lifestyle tote made from thick, durable 12oz natural cotton canvas. Hand-painted with cheerful Vincent-inspired textured sunflowers that bring sunshine to your daily errands and book carrying.',
        shortDescription: '12oz heavy-duty natural cotton canvas tote hand-painted with textured sunflowers.',
        price: 899,
        discountPrice: 699,
        category: catMap['fabric-painting'],
        categoryName: 'Fabric Painting',
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80'
        ],
        isFeatured: false,
        isAvailable: true,
        tags: ['canvas-tote', 'hand-painted', 'eco-friendly', 'sunflowers'],
        specifications: {
          materials: '100% Heavy Organic Cotton Canvas, Washable Acrylic Mediums',
          dimensions: '15 x 16 inches with 10-inch shoulder drop',
          careInstructions: 'Turn inside out, gentle hand wash in cold water, iron on reverse side.',
          handmadeIn: 'Kamvora Studio, Mohali, Punjab',
          craftType: 'Canvas Acrylic Art',
          weight: '210g'
        },
        customizationAvailable: true,
        customizationGuide: 'Custom names or initials can be painted alongside the floral motif.',
        rating: 4.8,
        numReviews: 11
      },
      {
        name: 'Custom Realistic Charcoal Couple Portrait (A3 Size Framed)',
        slug: 'custom-realistic-charcoal-couple-portrait-a3',
        description: 'Turn your favorite cherished photograph into a timeless fine-art heirloom. Hand-drawn by Komal Kang using artist-grade willow charcoal and blending stumps on 250gsm acid-free Strathmore paper. Delivered fully framed with museum-quality glass.',
        shortDescription: 'Hand-drawn lifelike charcoal portrait framed on archival heavyweight paper.',
        price: 3200,
        discountPrice: 2750,
        category: catMap['portraits'],
        categoryName: 'Portraits',
        stock: 10,
        images: [
          'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
        ],
        isFeatured: true,
        isAvailable: true,
        tags: ['charcoal-portrait', 'sketch', 'custom-art', 'framed-art', 'anniversary-gift'],
        specifications: {
          materials: 'Derwent Willow & Compressed Charcoal, 250gsm Archival Paper, Teak Frame',
          dimensions: 'A3 (11.7 x 16.5 inches) with 1-inch outer frame',
          careInstructions: 'Treated with archival fixative. Display out of direct dampness.',
          handmadeIn: 'Kamvora Studio, Mohali, Punjab',
          craftType: 'Fine Art Sketching & Charcoal Drawing',
          weight: '900g'
        },
        customizationAvailable: true,
        customizationGuide: 'Submit your high-resolution reference photo via the Custom Order page or checkout note.',
        rating: 5.0,
        numReviews: 18
      },
      {
        name: 'Hand-Carved Wooden Keepsake Gift Box with Velvet Lining',
        slug: 'hand-carved-wooden-keepsake-gift-box',
        description: 'Exquisitely handcrafted from seasoned mango wood with delicate brass filigree inlays and floral carvings. Inside features a plush crimson velvet lining ideal for jewelry, love letters, and sacred keepsakes.',
        shortDescription: 'Hand-carved solid mango wood keepsake box with brass floral inlays.',
        price: 1499,
        discountPrice: 1199,
        category: catMap['handmade-gifts'],
        categoryName: 'Handmade Gifts',
        stock: 14,
        images: [
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
        ],
        isFeatured: true,
        isAvailable: true,
        tags: ['gift-box', 'wooden-craft', 'keepsake', 'hand-carved'],
        specifications: {
          materials: 'Seasoned Mango Wood, Antique Brass Inlay, Micro-Velvet',
          dimensions: '8 x 5 x 3.5 inches',
          careInstructions: 'Polish with natural beeswax twice a year. Keep away from excess water.',
          handmadeIn: 'Kamvora Studio, Mohali, Punjab',
          craftType: 'Wood Carving & Joinery',
          weight: '620g'
        },
        customizationAvailable: true,
        customizationGuide: 'Laser engraved or hand-pyrographed personal message inside lid available.',
        rating: 4.9,
        numReviews: 7
      },
      {
        name: 'Personalized Couple Photo Preservation Resin Night Lamp',
        slug: 'personalized-couple-photo-resin-night-lamp',
        description: 'Immortalize your favorite memories inside crystal-clear resin preserved with dried baby’s breath flowers and gold sparkles. Embedded in a solid warm beechwood LED base that casts a cozy ambient glow across your bedroom.',
        shortDescription: 'Warm LED beechwood night lamp with custom photo preserved in crystal resin.',
        price: 2699,
        discountPrice: 2299,
        category: catMap['customized-gifts'],
        categoryName: 'Customized Gifts',
        stock: 9,
        images: [
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80'
        ],
        isFeatured: true,
        isAvailable: true,
        tags: ['resin-lamp', 'photo-preservation', 'custom-gift', 'night-light'],
        specifications: {
          materials: 'Optical Crystal Resin, Real Preserved Botanicals, Solid Beechwood Base',
          dimensions: '6 inches height x 4.5 inches width x 2 inches depth',
          careInstructions: 'Powered via USB 5V cable (included). Wipe resin surface with soft cloth.',
          handmadeIn: 'Kamvora Studio, Mohali, Punjab',
          craftType: 'Resin Botanical Preservation',
          weight: '750g'
        },
        customizationAvailable: true,
        customizationGuide: 'Upload your photo and couple names for seamless resin encapsulation.',
        rating: 5.0,
        numReviews: 22
      },
      {
        name: 'Bohemian Artisan Macrame Wall Hanging with Driftwood',
        slug: 'bohemian-artisan-macrame-wall-hanging',
        description: 'A striking statement textile piece knotted by hand using 100% natural unbleached single-twist cotton cord. Suspended from hand-collected, naturally smoothed river driftwood for an authentic organic aesthetic.',
        shortDescription: 'Large hand-knotted organic cotton macrame tapestry on natural driftwood.',
        price: 1799,
        discountPrice: 1399,
        category: catMap['home-decor'],
        categoryName: 'Home Decor',
        stock: 11,
        images: [
          'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80'
        ],
        isFeatured: false,
        isAvailable: true,
        tags: ['macrame', 'boho-decor', 'wall-hanging', 'natural-cotton'],
        specifications: {
          materials: '100% Virgin Cotton Cord (4mm), Natural Driftwood Branch',
          dimensions: '18 inches wide branch, 28 inches hanging drop length',
          careInstructions: 'Gently comb fringe tassels with a wide-tooth comb as desired.',
          handmadeIn: 'Kamvora Studio, Mohali, Punjab',
          craftType: 'Macrame Fiber Art',
          weight: '500g'
        },
        customizationAvailable: false,
        rating: 4.9,
        numReviews: 10
      },
      {
        name: 'Personalized Botanical Resin Alphabet Keychain with Real Flowers',
        slug: 'personalized-botanical-resin-alphabet-keychain',
        description: 'Carry a miniature garden wherever you journey. Each alphabet letter is painstakingly hand-cast with crystal-clear non-yellowing resin, real pressed forget-me-nots and baby’s breath, and a touch of gold foil, paired with a matching suede tassel.',
        shortDescription: 'Custom initial resin keychain with real preserved botanicals and gold leafing.',
        price: 449,
        discountPrice: 349,
        category: catMap['personalized-accessories'],
        categoryName: 'Personalized Accessories',
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80'
        ],
        isFeatured: false,
        isAvailable: true,
        tags: ['keychain', 'resin-alphabet', 'personalized', 'botanical'],
        specifications: {
          materials: 'UV Hardened Epoxy Resin, Natural Dried Flowers, Stainless Steel Ring',
          dimensions: 'Letter height approx 1.6 inches',
          careInstructions: 'Durable and shatter-resistant for daily key ring use.',
          handmadeIn: 'Kamvora Studio, Mohali, Punjab',
          craftType: 'Miniature Resin Casting',
          weight: '40g'
        },
        customizationAvailable: true,
        customizationGuide: 'Specify the required Alphabet Letter (A-Z) in the customization note.',
        rating: 4.8,
        numReviews: 34
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`✓ Inserted ${createdProducts.length} handcrafted products.`);

    // 4. Seed Reviews for Products
    const reviewsData = [
      {
        product: createdProducts[0]._id,
        user: customerUser._id,
        name: 'Simran Kaur (Chandigarh)',
        rating: 5,
        comment: 'The French knot detailing on this embroidery hoop is beyond words! It was packed so lovingly with dried flower sprigs. The quality and patience Komal puts in is truly heartwarming.',
        isVerifiedPurchase: true
      },
      {
        product: createdProducts[2]._id,
        user: customerUser._id,
        name: 'Vikramjit Singh (Mohali)',
        rating: 5,
        comment: 'Received the 14-inch ocean resin clock yesterday. It looks even more vibrant in person than in the photos! The silent quartz movement is completely noiseless. A masterpiece on my wall.',
        isVerifiedPurchase: true
      },
      {
        product: createdProducts[6]._id,
        user: customerUser._id,
        name: 'Ananya Deshmukh',
        rating: 5,
        comment: 'Ordered a couple portrait for my parents 25th anniversary. Komal captured their expressions with such sensitivity and finesse. Truly unforgettable gift!',
        isVerifiedPurchase: true
      }
    ];
    await Review.insertMany(reviewsData);
    console.log(`✓ Inserted ${reviewsData.length} genuine customer reviews.`);

    // 5. Seed Coupons
    const couponsData = [
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 500,
        maxDiscountAmount: 500,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 1000,
        timesUsed: 14,
        isActive: true
      },
      {
        code: 'ARTLOVER',
        discountType: 'fixed',
        discountValue: 200,
        minOrderAmount: 1200,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 500,
        timesUsed: 22,
        isActive: true
      },
      {
        code: 'STUDIO20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 2500,
        maxDiscountAmount: 1000,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 200,
        timesUsed: 5,
        isActive: true
      }
    ];
    await Coupon.insertMany(couponsData);
    console.log(`✓ Inserted ${couponsData.length} promo coupons.`);

    // 6. Seed Store Settings
    await StoreSettings.create({
      announcement: {
        text: 'Handcrafted with Love | Discover Something Unique | Free Shipping on Orders Over ₹999',
        isActive: true,
        link: '/shop'
      },
      contact: {
        email: 'Kamvorastudio@gmail.com',
        phone: '+91 99150-88706',
        address: 'Shop Number 399, Janta Market, Mohali, Punjab, India',
        instagram: 'https://www.instagram.com/iamkomalkang?igsh=MWh4aWlhNzU1emd5cQ==',
        workingHours: 'Mon - Sat: 10:00 AM - 7:30 PM IST'
      },
      shipping: {
        shippingFee: 80,
        freeShippingThreshold: 999,
        codAvailable: true
      },
      hero: {
        heading: 'Art That Speaks. Crafts That Tell Stories.',
        subheading: 'Discover thoughtfully handcrafted creations, personalized gifts, and unique artistic pieces made to make every moment special.',
        badgeText: 'Handcrafted by Komal Kang | Mohali, Punjab'
      }
    });
    console.log('✓ Store settings initialized.');

    console.log('✓ Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error during database seeding:', error);
    return false;
  }
};

// If run directly from command line
if (process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}
