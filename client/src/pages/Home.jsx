import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Palette,
  Gift,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Mail,
  Send,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import InstagramIcon from '../components/icons/InstagramIcon.jsx';
import api from '../utils/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Home = () => {
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?isFeatured=true&limit=8')
        ]);

        if (catsRes.data.success) {
          setCategories(catsRes.data.data || []);
        }
        if (prodsRes.data.success) {
          setFeaturedProducts(prodsRes.data.data || []);
        }
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchData();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      const { data } = await api.post('/newsletter/subscribe', { email: newsletterEmail });
      setNewsletterSuccess(data.message);
      setNewsletterEmail('');
      addToast('Welcome to Kamvora Studio Inner Circle!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Filtered by active tab
  const filteredProducts =
    activeTab === 'all'
      ? featuredProducts
      : featuredProducts.filter(
          (p) =>
            p.category?.slug === activeTab ||
            p.categoryName?.toLowerCase().includes(activeTab.toLowerCase())
        );

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#F3E8D8]/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-[#EAD9C8]/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Luxury Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5EFE6] border border-[#E5DAC8] text-[#935938] text-xs font-semibold tracking-wider uppercase animate-in fade-in slide-in-from-bottom-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A261]" />
                <span>Handcrafted by Komal Kang | Mohali, Punjab</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#24211E] font-medium leading-[1.12] tracking-tight">
                Art That Speaks. <br />
                <span className="italic font-normal text-[#C26D53]">Crafts That Tell Stories.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#665E56] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover thoughtfully handcrafted creations, personalized gifts, and unique artistic pieces made to make every moment special. Crafted with organic materials, pure passion, and heirloom quality.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 bg-[#24211E] hover:bg-[#C26D53] text-[#FDFBF7] text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/custom-order"
                  className="w-full sm:w-auto px-8 py-4 bg-[#FAF5ED] hover:bg-[#F3ECE1] text-[#24211E] border border-[#DED4C5] text-sm font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#C8A261]" />
                  <span>Customize Your Gift</span>
                </Link>
              </div>

              {/* Craft Stats Counter */}
              <div className="pt-8 border-t border-[#EDE5D8] grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="font-editorial text-2xl sm:text-3xl font-bold text-[#24211E]">
                    1,200+
                  </div>
                  <div className="text-xs text-[#8C8276] uppercase tracking-wider font-medium mt-0.5">
                    Art Pieces Crafted
                  </div>
                </div>
                <div>
                  <div className="font-editorial text-2xl sm:text-3xl font-bold text-[#C26D53]">
                    100%
                  </div>
                  <div className="text-xs text-[#8C8276] uppercase tracking-wider font-medium mt-0.5">
                    Handmade with Love
                  </div>
                </div>
                <div>
                  <div className="font-editorial text-2xl sm:text-3xl font-bold text-[#C8A261] flex items-center justify-center lg:justify-start gap-1">
                    4.9 <Star className="w-4 h-4 fill-current inline" />
                  </div>
                  <div className="text-xs text-[#8C8276] uppercase tracking-wider font-medium mt-0.5">
                    Artistry Rating
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Showcase Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-[#EAE2D5]">
                  <img
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85"
                    alt="Handmade Embroidery by Kamvora Studio"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white space-y-1">
                      <span className="text-xs font-semibold tracking-wider uppercase text-[#E8C27B]">
                        Masterpiece Series
                      </span>
                      <h3 className="font-editorial text-xl font-bold">
                        Celestial Botanical Embroidery
                      </h3>
                      <p className="text-xs text-white/80">
                        Over 40 hours of meticulous hand needlework
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Artisan Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-[#EDE5D8] flex items-center gap-3.5 max-w-xs animate-in fade-in slide-in-from-left-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#E5DAC8]">
                    <img
                      src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80"
                      alt="Resin Ocean Art"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#24211E]">Ocean Resin Fluid Art</h5>
                    <p className="text-[11px] text-[#736A62]">Silent quartz clocks & geode coasters</p>
                    <span className="text-[10px] text-[#C26D53] font-bold">From ₹999</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES (Section 4.D) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
            Curated Collections
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E]">
            Explore by Craft Artistry
          </h2>
          <p className="text-sm text-[#736A62]">
            Every category represents specialized handcraft techniques nurtured with patience and precision.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-[#F5EFE6] aspect-[4/5] border border-[#ECE5D8] art-shadow-hover"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
                <span className="text-[10px] tracking-wider uppercase text-[#E8C27B] font-semibold opacity-90">
                  Collection
                </span>
                <h3 className="font-art text-lg sm:text-xl font-bold leading-tight group-hover:text-[#E8C27B] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-white/80 mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Artworks <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST-SELLING PRODUCTS (Section 4.E) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
              Handcrafted Treasures
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E] mt-1">
              Best-Selling Creations
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#24211E] text-white shadow-xs'
                  : 'bg-[#FAF5ED] text-[#4A443E] hover:bg-[#F2ECE1] border border-[#E5DAC8]'
              }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => setActiveTab('handmade-embroidery')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'handmade-embroidery'
                  ? 'bg-[#24211E] text-white shadow-xs'
                  : 'bg-[#FAF5ED] text-[#4A443E] hover:bg-[#F2ECE1] border border-[#E5DAC8]'
              }`}
            >
              Embroidery
            </button>
            <button
              onClick={() => setActiveTab('resin-art')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'resin-art'
                  ? 'bg-[#24211E] text-white shadow-xs'
                  : 'bg-[#FAF5ED] text-[#4A443E] hover:bg-[#F2ECE1] border border-[#E5DAC8]'
              }`}
            >
              Resin Art
            </button>
            <button
              onClick={() => setActiveTab('portraits')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'portraits'
                  ? 'bg-[#24211E] text-white shadow-xs'
                  : 'bg-[#FAF5ED] text-[#4A443E] hover:bg-[#F2ECE1] border border-[#E5DAC8]'
              }`}
            >
              Portraits
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-[#F5EFE6] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FAF6EE] rounded-3xl border border-[#EDE5D8]">
            <p className="text-sm text-[#736A62]">No featured products found for this craft category.</p>
            <Link to="/shop" className="mt-3 inline-block text-xs font-semibold text-[#C26D53] hover:underline">
              View all products in shop &rarr;
            </Link>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FAF5ED] hover:bg-[#24211E] hover:text-white text-[#24211E] border border-[#DED4C5] hover:border-[#24211E] text-xs font-bold rounded-full transition-all duration-300 shadow-xs"
          >
            <span>Explore Entire Studio Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. CUSTOM ORDERS SPOTLIGHT (Section 4.G) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#24201D] text-[#EDE7DE] p-8 sm:p-14 border border-[#3E3833] shadow-2xl">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C26D53]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C26D53]/20 border border-[#C26D53]/40 text-[#E8A598] text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A261]" /> Bespoke Studio Commissions
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-medium text-white leading-tight">
                Your Idea. <br />
                <span className="italic text-[#C8A261]">Our Creativity.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#B3ABA1] leading-relaxed max-w-xl">
                Have a special photograph, an anniversary date, or a custom color palette in mind? Our master artisans create custom embroidery hoop memories, lifelike charcoal portraits, resin preservations, and hand-painted garments made exclusively for you.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/custom-order"
                  className="px-7 py-3.5 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#C8A261]" />
                  <span>Request a Custom Order</span>
                </Link>

                <a
                  href="tel:+919915088706"
                  className="px-6 py-3.5 bg-[#332D29] hover:bg-[#403833] text-[#EDE7DE] border border-[#4D443E] text-xs sm:text-sm font-semibold rounded-full transition-all"
                >
                  Speak with Artist Komal: +91 99150-88706
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-[#443E38]">
                  <img
                    src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80"
                    alt="Custom Charcoal Portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square border border-[#443E38]">
                  <img
                    src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=600&q=80"
                    alt="Personalized Resin Alphabet"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <div className="rounded-2xl overflow-hidden aspect-square border border-[#443E38]">
                  <img
                    src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80"
                    alt="Personalized Wedding Embroidery"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-[#443E38]">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
                    alt="Resin Photo Lamp"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT KAMVORA STUDIO (Section 4.F) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden aspect-[4/3] shadow-xl border-4 border-white bg-[#EFE9DF]">
              <img
                src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80"
                alt="Studio Craft Process"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating studio address badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-4 rounded-2xl shadow-xl border border-[#EDE5D8] max-w-xs text-left">
              <span className="text-[10px] font-bold text-[#C8A261] uppercase tracking-wider">
                Visit Our Studio
              </span>
              <p className="text-xs font-semibold text-[#24211E] mt-0.5">
                Shop No 399, Janta Market, Mohali, Punjab
              </p>
              <p className="text-[11px] text-[#736A62]">Open Mon - Sat (10am - 7:30pm)</p>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5 text-center lg:text-left">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
              The Heart Behind The Brand
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E] leading-tight">
              Passionate About Craftsmanship & Meaningful Gifting
            </h2>
            <p className="text-sm sm:text-base text-[#665E56] leading-relaxed">
              Kamvora Studio was founded by artist Komal Kang with a singular, heartfelt vision: to restore slowness, emotion, and exquisite human artistry into everyday gifts and living spaces.
            </p>
            <p className="text-sm sm:text-base text-[#665E56] leading-relaxed">
              Every embroidery hoop is stitched by hand thread-by-thread; every resin clock is mixed and poured in layers over multiple days; every portrait sketch is drawn with delicate sensitivity to capture authentic expressions.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C26D53] hover:text-[#24211E] transition-colors"
              >
                <span>Read Founder’s Full Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US (Section 4.H) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
            Our Artisanal Promise
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E]">
            Why Art Lovers Choose Kamvora Studio
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C26D53]/15 text-[#C26D53] flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-art text-xl font-bold text-[#24211E]">Handmade with Care</h3>
            <p className="text-xs text-[#736A62] leading-relaxed">
              No assembly lines or automated machines. Every piece receives dedicated hours of personal love and artisan care.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8A261]/20 text-[#C8A261] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-art text-xl font-bold text-[#24211E]">Unique & Creative Designs</h3>
            <p className="text-xs text-[#736A62] leading-relaxed">
              Distinctive color blends, intricate French knots, real pressed botanicals, and bespoke fluid wave patterns.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#24211E]/10 text-[#24211E] flex items-center justify-center font-bold">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-art text-xl font-bold text-[#24211E]">Personalized Gift Options</h3>
            <p className="text-xs text-[#736A62] leading-relaxed">
              Add custom names, quotes, anniversary dates, and cherished memories to make any occasion truly unforgettable.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#4E6B4F]/15 text-[#4E6B4F] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-art text-xl font-bold text-[#24211E]">Quality Craftsmanship</h3>
            <p className="text-xs text-[#736A62] leading-relaxed">
              We source non-yellowing UV crystal resins, 100% natural cotton linens, and archival Strathmore sketch papers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#935938]/15 text-[#935938] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-art text-xl font-bold text-[#24211E]">Secure Checkout</h3>
            <p className="text-xs text-[#736A62] leading-relaxed">
              Safe payments via verified Razorpay merchant gateway or Cash on Delivery options with live tracking updates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#B85D43]/15 text-[#B85D43] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-art text-xl font-bold text-[#24211E]">Direct Artist Support</h3>
            <p className="text-xs text-[#736A62] leading-relaxed">
              Speak directly with Komal and the studio team for progress photos, customization queries, and packaging requests.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS (Section 4.I) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
            Collector Experiences
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E]">
            Kind Words from Our Patrons
          </h2>
          <p className="text-xs text-[#8C8276] italic">
            *Verified reviews received from craft lovers and gifting clients across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#ECE5D8] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex gap-1 text-[#C8A261]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#4A443E] leading-relaxed italic">
                “The French knot detailing on the floral embroidery hoop is beyond words! It was packed so lovingly with dried flower sprigs. The quality and patience Komal puts in is truly heartwarming.”
              </p>
            </div>
            <div className="pt-3 border-t border-[#EAE2D5] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C26D53] text-white flex items-center justify-center text-xs font-bold">
                S
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#24211E]">Simran Kaur</h5>
                <p className="text-[10px] text-[#736A62]">Chandigarh | Botanical Hoop Order</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#ECE5D8] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex gap-1 text-[#C8A261]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#4A443E] leading-relaxed italic">
                “Received the 14-inch ocean resin clock yesterday. It looks even more vibrant in person than in the photos! The silent quartz movement is completely noiseless. A true centerpiece on our living room wall.”
              </p>
            </div>
            <div className="pt-3 border-t border-[#EAE2D5] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C8A261] text-white flex items-center justify-center text-xs font-bold">
                V
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#24211E]">Vikramjit Singh</h5>
                <p className="text-[10px] text-[#736A62]">Mohali | Ocean Resin Clock Order</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF6EE] border border-[#ECE5D8] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex gap-1 text-[#C8A261]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#4A443E] leading-relaxed italic">
                “Ordered a custom couple charcoal sketch for my parents’ 25th wedding anniversary. Komal captured their expressions with such sensitivity and finesse. They were brought to tears when they unwrapped it!”
              </p>
            </div>
            <div className="pt-3 border-t border-[#EAE2D5] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#935938] text-white flex items-center justify-center text-xs font-bold">
                A
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#24211E]">Ananya Deshmukh</h5>
                <p className="text-[10px] text-[#736A62]">Delhi | Custom Portrait Order</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM SECTION (Section 4.J) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
              Studio In Real Time
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E] mt-1">
              Follow Us on Instagram
            </h2>
            <p className="text-sm text-[#736A62]">
              Watch behind-the-scenes needlework reels and fluid resin pours with founder Komal Kang.
            </p>
          </div>

          <a
            href="https://www.instagram.com/iamkomalkang?igsh=MWh4aWlhNzU1emd5cQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAF5ED] border border-[#DED4C5] hover:bg-[#C26D53] hover:text-white hover:border-[#C26D53] text-xs font-bold text-[#24211E] transition-all shadow-xs"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>@iamkomalkang</span>
          </a>
        </div>

        {/* Instagram Grid Collage */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
              caption: 'Detailing French knots in the Mohali studio'
            },
            {
              img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
              caption: 'Crystal resin wave layer curing under warm lamps'
            },
            {
              img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
              caption: 'Hand-painted vintage rose motifs on silk'
            },
            {
              img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=400&q=80',
              caption: 'Shadow rendering in charcoal portrait'
            },
            {
              img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
              caption: 'Couple anniversary resin keepsake lamp'
            },
            {
              img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=400&q=80',
              caption: 'Botanical resin alphabet keychains ready to gift'
            }
          ].map((item, index) => (
            <a
              key={index}
              href="https://www.instagram.com/iamkomalkang?igsh=MWh4aWlhNzU1emd5cQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden aspect-square bg-[#EFE9DF] border border-[#ECE5D8]"
            >
              <img
                src={item.img}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center text-white">
                <InstagramIcon className="w-5 h-5 text-[#E8C27B] mb-1" />
                <span className="text-[10px] line-clamp-2">{item.caption}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER SECTION (Section 4.K) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#FAF5ED] border border-[#E5DAC8] p-8 sm:p-14 text-center max-w-4xl mx-auto relative overflow-hidden shadow-sm">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
              The Studio Inner Circle
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E]">
              Join Our Craft Family & Enjoy 10% Off
            </h2>
            <p className="text-xs sm:text-sm text-[#665E56] leading-relaxed">
              Subscribe to receive first access to limited edition drops, seasonal artisan workshops in Mohali, and an instant 10% discount code for your first purchase.
            </p>

            {newsletterSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium">
                {newsletterSuccess}
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="flex-1 px-5 py-3 rounded-full text-xs sm:text-sm bg-white border border-[#DED4C5] focus:outline-none focus:border-[#C26D53] text-[#24211E]"
                />
                <button
                  type="submit"
                  className="px-7 py-3 bg-[#C26D53] hover:bg-[#AD5940] text-white text-xs sm:text-sm font-bold rounded-full transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}

            <p className="text-[11px] text-[#8C8276]">
              We respect your inbox. Unsubscribe anytime. No spam, only handmade warmth.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
