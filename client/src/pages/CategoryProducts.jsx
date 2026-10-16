import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import api from '../utils/api.js';
import ProductCard from '../components/ProductCard.jsx';

const CategoryProducts = () => {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get(`/categories/${slug}`),
          api.get(`/products?category=${slug}&limit=24`)
        ]);

        if (catRes.data.success) {
          setCategory(catRes.data.data);
        }
        if (prodRes.data.success) {
          setProducts(prodRes.data.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-3 border-[#C26D53] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#8C8276] uppercase font-semibold">Loading Collection...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#8C8276]">
        <Link to="/" className="hover:text-[#24211E]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <Link to="/shop" className="hover:text-[#24211E]">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <span className="text-[#24211E] font-medium">{category?.name || 'Collection'}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#24201D] text-white p-8 sm:p-14 border border-[#3E3833] shadow-lg">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          {category?.image && (
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#E8C27B]">
            Artisan Collection
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-medium leading-tight">
            {category?.name || 'Craft Collection'}
          </h1>
          <p className="text-xs sm:text-sm text-[#D1C9BF] leading-relaxed">
            {category?.description || 'Thoughtfully crafted with timeless artisanal passion.'}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 text-xs text-[#8C8276]">
          <span>{products.length} Handcrafted pieces in this collection</span>
          <Link to="/shop" className="text-[#C26D53] font-bold hover:underline">
            View All Categories &rarr;
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#FAF6EE] rounded-3xl border border-[#EDE5D8] space-y-3">
            <Sparkles className="w-8 h-8 text-[#C8A261] mx-auto opacity-70" />
            <h3 className="font-art text-xl font-bold text-[#24211E]">
              Fresh Pieces Coming Soon
            </h3>
            <p className="text-xs sm:text-sm text-[#736A62]">
              New creations are currently being prepared in our Mohali studio. Check back soon or request a custom order!
            </p>
            <Link
              to="/custom-order"
              className="inline-block px-6 py-2.5 bg-[#C26D53] text-white text-xs font-bold rounded-full hover:bg-[#AD5940]"
            >
              Request Custom Order in this Craft
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
