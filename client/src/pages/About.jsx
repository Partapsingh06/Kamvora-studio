import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Award, MapPin, ArrowRight } from 'lucide-react';
import InstagramIcon from '../components/icons/InstagramIcon.jsx';

const About = () => {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-16">
      {/* 1. Hero Story Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
            Our Artisanal Journey
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl font-medium text-[#24211E] leading-[1.15]">
            Handmade with Love, <br />
            <span className="italic text-[#C8A261]">Crafted to Tell Your Story.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#665E56] leading-relaxed">
            Welcome to Kamvora Studio — a sanctuary of slow handcrafted art, delicate needlework, crystal resin ocean pours, and sentimental heirloom gifts born in the cultural heart of Mohali, Punjab.
          </p>
        </div>
      </section>

      {/* 2. Visual Story Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border-4 border-white bg-[#EFE9DF]">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85"
                alt="Komal Kang handcrafting embroidery"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Studio Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-5 rounded-2xl shadow-xl border border-[#EDE5D8] max-w-xs text-left">
              <span className="text-[10px] font-bold text-[#C8A261] uppercase tracking-wider">
                Founder & Lead Artisan
              </span>
              <h4 className="font-art text-lg font-bold text-[#24211E]">Komal Kang</h4>
              <p className="text-xs text-[#736A62]">
                "Every needle stitch and every resin swirl carries a piece of my heart to your home."
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-[#4A443E]">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A67C52]">
                The Kamvora Ethos
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E] leading-tight">
                Restoring Warmth & Intimacy to Everyday Gifts
              </h2>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-[#665E56]">
              In an age dominated by mass production and disposable digital trinkets, Kamvora Studio was created as an antidote. We believe meaningful gifts should be tangible, slow, and infused with soul.
            </p>

            <p className="text-sm sm:text-base leading-relaxed text-[#665E56]">
              Founded by Komal Kang from her studio at Shop Number 399, Janta Market, Mohali, the brand began with custom hand-embroidered wedding hoops for friends and family. As word of Komal's meticulous French knots and artistic eye spread, the studio blossomed to embrace ocean resin clocks, freehand fabric painted garments, and lifelike charcoal portraits.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="https://www.instagram.com/iamkomalkang?igsh=MWh4aWlhNzU1emd5cQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF5ED] border border-[#DED4C5] hover:bg-[#C26D53] hover:text-white text-xs font-bold text-[#24211E] transition-all"
              >
                <InstagramIcon className="w-4 h-4 text-[#E8A598]" />
                <span>Follow Komal on Instagram</span>
              </a>

              <Link
                to="/custom-order"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#24211E] hover:bg-[#C26D53] text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Request Custom Artwork</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF6EE] rounded-3xl border border-[#EDE5D8] p-8 sm:p-14 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
              What We Stand For
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E]">
              Our Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C26D53]/15 text-[#C26D53] flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-art text-xl font-bold text-[#24211E]">Zero Compromise on Care</h3>
              <p className="text-xs sm:text-sm text-[#736A62] leading-relaxed">
                We never rush drying times or cut corners on thread densities. A single hoop art can take between 15 to 40 hours of patient craftsmanship.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A261]/20 text-[#C8A261] flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-art text-xl font-bold text-[#24211E]">Archival Grade Materials</h3>
              <p className="text-xs sm:text-sm text-[#736A62] leading-relaxed">
                We use only non-yellowing UV protected crystal resins, pure Egyptian cotton embroidery threads, and acid-free heavyweight archival sketch paper.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#4E6B4F]/15 text-[#4E6B4F] flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-art text-xl font-bold text-[#24211E]">Deep Local Roots</h3>
              <p className="text-xs sm:text-sm text-[#736A62] leading-relaxed">
                Based out of Mohali, Punjab, our studio supports local wooden ring turners, brass artisans, and traditional textile weavers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Studio Location Invitation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#24211E]">
          Visiting Mohali? Drop by the Studio!
        </h3>
        <p className="text-xs sm:text-sm text-[#736A62] max-w-md mx-auto">
          Shop Number 399, Janta Market, Mohali, Punjab. Experience the textures, smell the wood finishes, and witness live embroidery sessions.
        </p>
        <Link
          to="/contact"
          className="inline-block text-xs font-bold uppercase tracking-wider text-[#C26D53] hover:underline"
        >
          View Map & Contact Details &rarr;
        </Link>
      </section>
    </div>
  );
};

export default About;
