import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, Heart, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatPrice } from '../utils/currency.js';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [customizationNote, setCustomizationNote] = useState('');
  const [added, setAdded] = useState(false);

  const isLiked = isInWishlist(product._id);
  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, customizationNote);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FDFBF7] rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-[#ECE5D8] z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#4A443E] hover:text-[#24211E] shadow-sm transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="p-6 bg-[#F8F3EC] flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[#EFE8DD]">
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-inner mb-4">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 w-full overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img ? 'border-[#C26D53] shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C8276] mb-2">
                <span className="uppercase tracking-wider font-semibold text-[#A67C52]">
                  {product.categoryName || product.category?.name || 'Handmade Craft'}
                </span>
                <div className="flex items-center gap-1 text-[#24211E] font-medium">
                  <Star className="w-4 h-4 fill-[#C8A261] text-[#C8A261]" />
                  <span>{product.rating || 5.0}</span>
                </div>
              </div>

              <h2 className="font-art text-2xl font-bold text-[#24211E] leading-snug mb-3">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-extrabold text-[#24211E]">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-[#9E958C] line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#C26D53] text-white">
                    Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#665E56] leading-relaxed mb-4 line-clamp-3">
                {product.shortDescription || product.description}
              </p>

              {/* Customization input if applicable */}
              {product.customizationAvailable && (
                <div className="mb-4 p-3 rounded-xl bg-[#FAF5ED] border border-[#E8DCCB]">
                  <label className="block text-xs font-semibold text-[#4A443E] mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A261]" /> Custom Note / Names:
                  </label>
                  <input
                    type="text"
                    value={customizationNote}
                    onChange={(e) => setCustomizationNote(e.target.value)}
                    placeholder="e.g. Names: Komal & Kabir, Date: 24th Oct"
                    className="w-full text-xs p-2 bg-white rounded-lg border border-[#DED4C5] focus:outline-none focus:border-[#C26D53]"
                  />
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#F0EAE1]">
              <div className="flex items-center gap-3 mb-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#DED4C5] rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-sm text-[#4A443E] hover:bg-[#F5EFE6]"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-sm text-[#4A443E] hover:bg-[#F5EFE6]"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    product.stock <= 0
                      ? 'bg-[#EAE4DC] text-[#A89F95] cursor-not-allowed'
                      : added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#24211E] hover:bg-[#C26D53] text-white shadow-sm'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isLiked
                      ? 'bg-[#C26D53] border-[#C26D53] text-white'
                      : 'border-[#DED4C5] text-[#4A443E] hover:text-[#C26D53] hover:border-[#C26D53]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="text-center">
                <Link
                  to={`/product/${product.slug || product._id}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-[#C26D53] hover:underline"
                >
                  View Full Product Details & Specifications &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
