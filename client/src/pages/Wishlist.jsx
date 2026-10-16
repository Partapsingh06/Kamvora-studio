import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../utils/currency.js';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF5ED] text-[#C26D53] border border-[#E5DAC8] flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-art text-3xl font-bold text-[#24211E]">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs sm:text-sm text-[#736A62] max-w-sm mx-auto leading-relaxed">
          Save your favorite handcrafted hoops, resin clocks, and custom gift inspirations by tapping the heart icon.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#24211E] hover:bg-[#C26D53] text-white text-xs font-bold rounded-full transition-all shadow-md"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="border-b border-[#EDE5D8] pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">
            Saved Inspirations
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E]">
            My Wishlist ({wishlistItems.length})
          </h1>
        </div>
        <Link
          to="/shop"
          className="text-xs font-bold text-[#C26D53] hover:underline"
        >
          Browse More Artworks &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          const currentPrice = item.discountPrice || item.price;
          const hasDiscount = item.discountPrice && item.discountPrice < item.price;

          return (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-[#EDE5D8] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden bg-[#FAF5ED]">
                <Link to={`/product/${item.slug || item._id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#4A443E] hover:text-rose-600 shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#A67C52]">
                    {item.categoryName}
                  </span>
                  <Link to={`/product/${item.slug || item._id}`}>
                    <h4 className="font-art text-base font-bold text-[#24211E] hover:text-[#C26D53] line-clamp-2">
                      {item.name}
                    </h4>
                  </Link>
                </div>

                <div className="pt-2 border-t border-[#F2ECE3] flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-[#24211E]">
                      {formatPrice(currentPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-[#9E958C] line-through">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      addToCart({
                        _id: item._id,
                        name: item.name,
                        price: item.price,
                        discountPrice: item.discountPrice,
                        images: [item.image],
                        stock: item.stock || 10
                      });
                    }}
                    className="p-2.5 rounded-xl bg-[#24211E] text-white hover:bg-[#C26D53] transition-colors shadow-2xs"
                    aria-label="Add to Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
