import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatPrice } from '../utils/currency.js';
import QuickViewModal from './QuickViewModal.jsx';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isLiked = isInWishlist(product._id);
  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const savingsPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  return (
    <>
      <div className="group relative bg-[#FDFBF7] rounded-2xl overflow-hidden border border-[#EDE5D8] art-shadow-hover flex flex-col h-full transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#F5EFE6]">
          {/* Main Image */}
          <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {/* Secondary image on hover if available */}
            {product.images?.[1] && (
              <img
                src={product.images[1]}
                alt={`${product.name} alternate view`}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {hasDiscount && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C26D53] text-white shadow-xs">
                {savingsPercent}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#24211E]/80 backdrop-blur-xs text-[#E8C27B] flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-[#C8A261]" /> Featured
              </span>
            )}
            {product.customizationAvailable && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF6EE] text-[#6B5A4B] border border-[#DED4C5]">
                Customizable
              </span>
            )}
          </div>

          {/* Action Overlay Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2 rounded-full shadow-md transition-all ${
                isLiked
                  ? 'bg-[#C26D53] text-white'
                  : 'bg-white/90 backdrop-blur-xs text-[#4A443E] hover:text-[#C26D53] hover:bg-white'
              }`}
              aria-label={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            {/* Quick View Button */}
            <button
              onClick={() => setQuickViewOpen(true)}
              className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#4A443E] hover:text-[#C26D53] hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-full bg-black/80 text-white text-xs font-semibold uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category Name & Rating */}
            <div className="flex items-center justify-between text-xs text-[#8C8276] mb-1.5">
              <span className="uppercase tracking-wider font-semibold text-[11px] text-[#A67C52]">
                {product.categoryName || product.category?.name || 'Handmade Craft'}
              </span>
              <div className="flex items-center gap-1 font-medium text-[#24211E]">
                <Star className="w-3.5 h-3.5 fill-[#C8A261] text-[#C8A261]" />
                <span>{product.rating || 5.0}</span>
                {product.numReviews > 0 && (
                  <span className="text-[#8C8276]">({product.numReviews})</span>
                )}
              </div>
            </div>

            {/* Title */}
            <Link to={`/product/${product.slug || product._id}`}>
              <h3 className="font-art text-base sm:text-lg font-semibold text-[#24211E] hover:text-[#C26D53] transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Price & Add to Cart */}
          <div className="mt-4 pt-3 border-t border-[#F2ECE3] flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-bold text-[#24211E]">
                  {formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-[#9E958C] line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#8C8276]">
                {isOutOfStock ? (
                  <span className="text-rose-600 font-medium">Out of stock</span>
                ) : product.stock < 5 ? (
                  <span className="text-amber-700 font-medium">Only {product.stock} left</span>
                ) : (
                  <span className="text-emerald-700 font-medium">In studio stock</span>
                )}
              </span>
            </div>

            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                isOutOfStock
                  ? 'bg-[#EAE4DC] text-[#A89F95] cursor-not-allowed'
                  : 'bg-[#24211E] text-white hover:bg-[#C26D53]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
};

export default ProductCard;
