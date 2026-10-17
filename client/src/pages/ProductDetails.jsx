import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Check,
  MapPin,
  Send
} from 'lucide-react';
import api from '../utils/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice } from '../utils/currency.js';
import ProductCard from '../components/ProductCard.jsx';

const ProductDetails = () => {
  const { identifier } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customizationNote, setCustomizationNote] = useState('');
  const [activeTab, setActiveTab] = useState('specs');
  const [added, setAdded] = useState(false);

  // Review Form state
  const [reviewName, setReviewName] = useState(user?.name || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/products/${identifier}`);
        if (data.success && data.data) {
          setProduct(data.data);
          setRelated(data.related || []);
          setSelectedImage(data.data.images?.[0] || '');

          // Fetch reviews
          const revRes = await api.get(`/reviews/${data.data._id}`);
          if (revRes.data.success) {
            setReviews(revRes.data.data || []);
          }
        }
      } catch (err) {
        setError(err.message || 'Artwork not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [identifier]);

  // Set review name if user logs in
  useEffect(() => {
    if (user?.name && !reviewName) {
      setReviewName(user.name);
    }
  }, [user]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, customizationNote);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      addToast('Please provide your name and review comment', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const { data } = await api.post(`/reviews/${product._id}`, {
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment
      });

      if (data.success) {
        addToast('Thank you for sharing your experience with Kamvora Studio!', 'success');
        setReviews([data.data, ...reviews]);
        setReviewComment('');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-12 h-12 border-3 border-[#C26D53] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#8C8276] uppercase tracking-wider font-semibold">
          Curating Handcrafted Artwork...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-art text-3xl font-bold text-[#24211E]">Artwork Not Found</h2>
        <p className="text-sm text-[#736A62]">
          This piece may have been retired or moved. Please explore our full catalog.
        </p>
        <Link
          to="/shop"
          className="inline-block px-7 py-3 bg-[#24211E] text-white text-xs font-bold rounded-full hover:bg-[#C26D53]"
        >
          Return to Studio Catalog
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);
  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const savingsPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#8C8276]">
        <Link to="/" className="hover:text-[#24211E] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <Link to="/shop" className="hover:text-[#24211E] transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        {product.category && (
          <>
            <Link
              to={`/category/${product.category.slug || product.category}`}
              className="hover:text-[#24211E] transition-colors"
            >
              {product.categoryName || product.category.name || 'Category'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </>
        )}
        <span className="text-[#24211E] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase: Split Left (Gallery) & Right (Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Multi-Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Large Hero View */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F5EFE6] border border-[#EDE5D8] shadow-md group">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out cursor-zoom-in"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#C26D53] text-white shadow-xs">
                {savingsPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-all ${
                isLiked
                  ? 'bg-[#C26D53] text-white'
                  : 'bg-white/90 backdrop-blur-xs text-[#4A443E] hover:text-[#C26D53] hover:bg-white'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#C26D53] shadow-md scale-95'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumbnail-${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Details */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            {/* Category badge & Rating */}
            <div className="flex items-center justify-between text-xs text-[#8C8276] mb-2">
              <span className="uppercase tracking-wider font-bold text-[#A67C52]">
                {product.categoryName || product.category?.name || 'Handmade Craft'}
              </span>
              <div className="flex items-center gap-1 font-semibold text-[#24211E]">
                <Star className="w-4 h-4 fill-[#C8A261] text-[#C8A261]" />
                <span>{product.rating || 5.0}</span>
                <span className="text-[#8C8276]">({reviews.length || product.numReviews || 0} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-art text-2xl sm:text-3xl font-bold text-[#24211E] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-[#EDE5D8]">
              <span className="text-3xl font-extrabold text-[#24211E]">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-base text-[#9E958C] line-through font-normal">
                  {formatPrice(product.price)}
                </span>
              )}
              {hasDiscount && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF0ED] text-[#C26D53] border border-[#E8C0B7]">
                  Save {formatPrice(product.price - product.discountPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Description Snippet */}
          <p className="text-sm text-[#665E56] leading-relaxed">
            {product.description}
          </p>

          {/* Customization Options Input (If customizable) */}
          {product.customizationAvailable && (
            <div className="p-4 rounded-2xl bg-[#FAF5ED] border border-[#E5DAC8] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#24211E]">
                <Sparkles className="w-4 h-4 text-[#C8A261]" />
                <span>Bespoke Customization Available</span>
              </div>
              <p className="text-xs text-[#736A62]">
                {product.customizationGuide || 'Enter requested names, initial monogram, anniversary dates, or quote preferences:'}
              </p>
              <textarea
                rows={2}
                value={customizationNote}
                onChange={(e) => setCustomizationNote(e.target.value)}
                placeholder="e.g. Inscribe 'Aarav & Meera - 12.02.2024' in gold thread"
                className="w-full text-xs p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
              />
            </div>
          )}

          {/* Stock Availability */}
          <div className="text-xs flex items-center gap-2">
            <span className="font-semibold text-[#4A443E]">Studio Availability:</span>
            {product.stock <= 0 ? (
              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold">
                Sold Out / Made to Order Only
              </span>
            ) : product.stock < 5 ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-bold">
                Only {product.stock} items left in studio stock
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold">
                In Stock & Ready for Immediate Dispatch
              </span>
            )}
          </div>

          {/* Quantity & Add to Cart Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#DED4C5] rounded-2xl bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-sm text-[#4A443E] hover:bg-[#F5EFE6] transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-3 text-sm font-bold min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-sm text-[#4A443E] hover:bg-[#F5EFE6] transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-bold transition-all shadow-md ${
                  product.stock <= 0
                    ? 'bg-[#EAE4DC] text-[#A89F95] cursor-not-allowed'
                    : added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#24211E] hover:bg-[#C26D53] text-white hover:shadow-lg'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>
            </div>

            <Link
              to="/checkout"
              onClick={() => {
                if (product.stock > 0) addToCart(product, quantity, customizationNote);
              }}
              className="block w-full text-center py-3.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider bg-[#FAF5ED] border border-[#DED4C5] text-[#24211E] hover:bg-[#F2ECE1] transition-all"
            >
              Express Checkout Now
            </Link>
          </div>

          {/* Delivery & Assurance Pills */}
          <div className="pt-4 border-t border-[#EDE5D8] grid grid-cols-2 gap-3 text-xs text-[#736A62]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C26D53] shrink-0" />
              <span>Ships in 3-5 days across India</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4E6B4F] shrink-0" />
              <span>100% Handcrafted Assurance</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C8A261] shrink-0" />
              <span>Handmade in Mohali, Punjab</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#A67C52] shrink-0" />
              <span>Transit Damage Replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Specifications & Reviews Tabs */}
      <div className="pt-8 border-t border-[#EDE5D8]">
        {/* Tab Header Buttons */}
        <div className="flex border-b border-[#EDE5D8] gap-8">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'specs'
                ? 'text-[#C26D53]'
                : 'text-[#736A62] hover:text-[#24211E]'
            }`}
          >
            <span>Artisan Specifications</span>
            {activeTab === 'specs' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C26D53]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'reviews'
                ? 'text-[#C26D53]'
                : 'text-[#736A62] hover:text-[#24211E]'
            }`}
          >
            <span>Customer Reviews ({reviews.length})</span>
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C26D53]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'shipping'
                ? 'text-[#C26D53]'
                : 'text-[#736A62] hover:text-[#24211E]'
            }`}
          >
            <span>Shipping & Packaging</span>
            {activeTab === 'shipping' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C26D53]" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-2">
                <span className="text-[11px] font-bold text-[#A67C52] uppercase tracking-wider">
                  Materials Used
                </span>
                <p className="text-xs sm:text-sm text-[#24211E]">
                  {product.specifications?.materials || 'Organic cotton threads, pure linen, beechwood frame'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-2">
                <span className="text-[11px] font-bold text-[#A67C52] uppercase tracking-wider">
                  Dimensions & Weight
                </span>
                <p className="text-xs sm:text-sm text-[#24211E]">
                  {product.specifications?.dimensions || 'Standard Studio Dimensions'} | Weight: {product.specifications?.weight || 'Approx 350g'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-2">
                <span className="text-[11px] font-bold text-[#A67C52] uppercase tracking-wider">
                  Craft Origin
                </span>
                <p className="text-xs sm:text-sm text-[#24211E]">
                  {product.specifications?.handmadeIn || 'Kamvora Studio, Mohali, Punjab, India'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-2">
                <span className="text-[11px] font-bold text-[#A67C52] uppercase tracking-wider">
                  Care Instructions
                </span>
                <p className="text-xs sm:text-sm text-[#24211E]">
                  {product.specifications?.careInstructions || 'Keep away from moisture and direct harsh heat. Gently wipe with dry soft cloth.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-10 max-w-4xl">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-5 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#24211E]">{rev.name}</span>
                        <div className="flex text-[#C8A261]">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-[#665E56] leading-relaxed">
                        "{rev.comment}"
                      </p>
                      <span className="text-[10px] text-[#A89F95] block">
                        Verified Studio Purchase
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#736A62] italic">
                    Be the first to review this handcrafted piece!
                  </p>
                )}
              </div>

              {/* Write a Review Form */}
              <div className="p-6 rounded-3xl bg-[#FAF5ED] border border-[#E5DAC8] space-y-4">
                <h4 className="font-art text-xl font-bold text-[#24211E]">
                  Write an Honest Review
                </h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                        Your Name:
                      </label>
                      <input
                        type="text"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        required
                        className="w-full text-xs p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                        Rating:
                      </label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full text-xs p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                      >
                        <option value={5}>5 Stars - Exceptional Artistry</option>
                        <option value={4}>4 Stars - Very Pleased</option>
                        <option value={3}>3 Stars - Good</option>
                        <option value={2}>2 Stars - Fair</option>
                        <option value={1}>1 Star - Needs Improvement</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A443E] mb-1">
                      Your Thoughts on Craftsmanship:
                    </label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      placeholder="Share what you loved about the textures, colors, or gift packaging..."
                      className="w-full text-xs p-3 bg-white rounded-xl border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs font-bold rounded-full transition-colors flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Posting...' : 'Submit Review'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-[#665E56] leading-relaxed">
              <p>
                Each creation is lovingly enveloped in sustainable butter paper, cushioned with organic kraft padding, and secured in sturdy shatter-resistant corrugated packaging to guarantee pristine arrival.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Orders above ₹999 qualify for Free Standard Delivery across India.</li>
                <li>Express courier tracking is emailed and accessible live via our tracking portal.</li>
                <li>In the unlikely event of courier transit damage, we provide instant repair or replacement.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-[#EDE5D8] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#24211E]">
              You May Also Adore
            </h3>
            <Link to="/shop" className="text-xs font-bold text-[#C26D53] hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
