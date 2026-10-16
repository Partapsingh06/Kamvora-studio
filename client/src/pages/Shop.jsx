import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ArrowUpDown,
  Sparkles,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import api from '../utils/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { formatPrice } from '../utils/currency.js';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters from query params
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const inStock = searchParams.get('inStock') === 'true';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  // Local state for filters
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(maxPrice || 5000);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
        if (sort) params.append('sort', sort);
        if (inStock) params.append('inStock', 'true');
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        params.append('page', page.toString());
        params.append('limit', '12');

        const { data } = await api.get(`/products?${params.toString()}`);
        if (data.success) {
          setProducts(data.data || []);
          setTotalPages(data.pages || 1);
          setTotalCount(data.total || 0);
        }
      } catch (err) {
        setError(err.message || 'Failed to load art catalog');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory, sort, inStock, minPrice, maxPrice, page]);

  // Update query params helper
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'all' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, value.toString());
    }
    setPage(1); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPage(1);
    setPriceRange(5000);
  };

  const hasActiveFilters = Boolean(search || (selectedCategory && selectedCategory !== 'all') || inStock || minPrice || maxPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
          Kamvora Art Collection
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-medium text-[#24211E]">
          Artisanal Catalog
        </h1>
        <p className="text-xs sm:text-sm text-[#736A62]">
          Discover authentic handcrafted embroidery hoops, crystal resin ocean pieces, fine portraits, and customized gift treasures.
        </p>
      </div>

      {/* Search & Mobile Filter Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FAF5ED] p-4 rounded-2xl border border-[#EDE5D8]">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8276]" />
          <input
            type="text"
            value={search}
            onChange={(e) => updateParam('search', e.target.value)}
            placeholder="Search by craft name, keyword, or material..."
            className="w-full bg-white border border-[#DED4C5] rounded-full py-2.5 pl-10 pr-10 text-xs sm:text-sm focus:outline-none focus:border-[#C26D53] text-[#24211E]"
          />
          {search && (
            <button
              onClick={() => updateParam('search', '')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C8276] hover:text-[#24211E]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort and Mobile Filter Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DED4C5] rounded-full text-xs font-semibold text-[#3E3832]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C26D53]" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8C8276] hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-white border border-[#DED4C5] rounded-full px-4 py-2 text-xs font-semibold text-[#3E3832] focus:outline-none focus:border-[#C26D53]"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs text-[#8C8276] font-medium">Active Filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAF5ED] border border-[#E5DAC8] text-[#3E3832]">
              Keyword: "{search}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('search', '')} />
            </span>
          )}
          {selectedCategory && selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAF5ED] border border-[#E5DAC8] text-[#3E3832]">
              Category: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('category', 'all')} />
            </span>
          )}
          {inStock && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAF5ED] border border-[#E5DAC8] text-[#3E3832]">
              In Stock Only
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('inStock', false)} />
            </span>
          )}
          {maxPrice && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#FAF5ED] border border-[#E5DAC8] text-[#3E3832]">
              Under {formatPrice(maxPrice)}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateParam('maxPrice', '')} />
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-[#C26D53] hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-[#FAF6EE] p-6 rounded-3xl border border-[#EDE5D8] space-y-6 sticky top-28">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A67C52] mb-3">
              Craft Categories
            </h4>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              <button
                onClick={() => updateParam('category', 'all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#24211E] text-white'
                    : 'text-[#4A443E] hover:bg-[#F2ECE1]'
                }`}
              >
                <span>All Artworks</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateParam('category', cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-[#24211E] text-white'
                      : 'text-[#4A443E] hover:bg-[#F2ECE1]'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-[#EAE2D5]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A67C52] mb-3">
              Filter by Price
            </h4>
            <div className="space-y-2">
              <input
                type="range"
                min="300"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                onMouseUp={() => updateParam('maxPrice', priceRange)}
                onTouchEnd={() => updateParam('maxPrice', priceRange)}
                className="w-full accent-[#C26D53]"
              />
              <div className="flex justify-between text-xs text-[#736A62] font-medium">
                <span>₹300</span>
                <span className="font-bold text-[#24211E]">Up to {formatPrice(priceRange)}</span>
              </div>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="pt-4 border-t border-[#EAE2D5]">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#3E3832]">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => updateParam('inStock', e.target.checked)}
                className="rounded accent-[#C26D53] w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {hasActiveFilters && (
            <div className="pt-2">
              <button
                onClick={clearAllFilters}
                className="w-full py-2.5 rounded-xl border border-[#DED4C5] hover:bg-[#EDE5D8] text-xs font-semibold text-[#4A443E] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </aside>

        {/* Products Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-[#8C8276]">
            <span>
              Showing {products.length} of {totalCount} handcrafted creations
            </span>
            {loading && <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Updating...</span>}
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/5] bg-[#F5EFE6] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#FAF6EE] rounded-3xl border border-[#EDE5D8] space-y-3">
              <Sparkles className="w-8 h-8 text-[#C8A261] mx-auto opacity-70" />
              <h3 className="font-art text-xl font-bold text-[#24211E]">
                No Artworks Found
              </h3>
              <p className="text-xs sm:text-sm text-[#736A62] max-w-sm mx-auto">
                We couldn’t find any creations matching your search and filter criteria. Try adjusting or clearing your filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-[#C26D53] text-white text-xs font-bold rounded-full hover:bg-[#AD5940] transition-colors shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-8 flex items-center justify-center gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setPage(pageNum);
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      page === pageNum
                        ? 'bg-[#24211E] text-white shadow-xs'
                        : 'bg-[#FAF5ED] text-[#4A443E] hover:bg-[#EAE2D5] border border-[#E5DAC8]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm bg-[#FDFBF7] h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#ECE5D8] pb-4">
              <h3 className="font-art text-lg font-bold text-[#24211E]">Filter Catalog</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#8C8276]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A67C52] mb-3">
                Craft Categories
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    updateParam('category', 'all');
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                    selectedCategory === 'all' ? 'bg-[#24211E] text-white' : 'text-[#4A443E]'
                  }`}
                >
                  All Artworks
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      updateParam('category', cat.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                      selectedCategory === cat.slug ? 'bg-[#24211E] text-white' : 'text-[#4A443E]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#ECE5D8]">
              <label className="flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => {
                    updateParam('inStock', e.target.checked);
                    setMobileFilterOpen(false);
                  }}
                  className="rounded accent-[#C26D53] w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            <button
              onClick={() => {
                clearAllFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full py-3 bg-[#EFE9DF] text-[#4A443E] rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
