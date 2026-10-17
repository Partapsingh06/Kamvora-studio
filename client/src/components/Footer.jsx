import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import InstagramIcon from './icons/InstagramIcon.jsx';

const Footer = () => {
  return (
    <footer className="bg-[#1F1C1A] text-[#EDE7DE] pt-16 pb-10 border-t border-[#38332E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Badges Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#332E2A] text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3.5 p-4 rounded-2xl bg-[#282421]/60 border border-[#3D3732]">
            <div className="w-10 h-10 rounded-xl bg-[#C26D53]/20 border border-[#C26D53]/40 flex items-center justify-center text-[#C26D53] shrink-0">
              <Sparkles className="w-5 h-5 text-[#C8A261]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FBF8F3]">100% Handcrafted Luxury</h4>
              <p className="text-xs text-[#A89F95]">Poured, carved, and stitched with love by Komal Kang</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 p-4 rounded-2xl bg-[#282421]/60 border border-[#3D3732]">
            <div className="w-10 h-10 rounded-xl bg-[#C8A261]/20 border border-[#C8A261]/40 flex items-center justify-center text-[#C8A261] shrink-0">
              <Truck className="w-5 h-5 text-[#C8A261]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FBF8F3]">Pan-India Safe Delivery</h4>
              <p className="text-xs text-[#A89F95]">Free shipping over ₹999 with shatter-safe packaging</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 p-4 rounded-2xl bg-[#282421]/60 border border-[#3D3732]">
            <div className="w-10 h-10 rounded-xl bg-[#4E6B4F]/20 border border-[#4E6B4F]/40 flex items-center justify-center text-[#82B383] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#82B383]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FBF8F3]">Verified Quality & Care</h4>
              <p className="text-xs text-[#A89F95]">Archival grade pigments, resins & pure linens</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="font-editorial text-2xl font-semibold tracking-wider text-[#FBF8F3] group-hover:text-[#C8A261] transition-colors">
                KAMVORA STUDIO
              </span>
            </Link>
            <p className="text-sm text-[#A89F95] leading-relaxed max-w-sm">
              Art that speaks. Crafts that tell stories. We craft bespoke embroidery hoops, crystal resin masterpieces, fine portraits, and customized sentimental gifts that celebrate life’s heartfelt milestones.
            </p>

            <div className="pt-2">
              <a
                href="https://www.instagram.com/iamkomalkang?igsh=MWh4aWlhNzU1emd5cQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2A2623] hover:bg-[#C26D53] border border-[#3D3732] hover:border-[#C26D53] text-xs font-semibold text-[#FBF8F3] transition-all"
              >
                <InstagramIcon className="w-4 h-4 text-[#E8A598]" />
                <span>Follow @iamkomalkang on Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#C8A261]">
              Explore
            </h5>
            <ul className="space-y-2 text-sm text-[#A89F95]">
              <li>
                <Link to="/shop" className="hover:text-[#FBF8F3] transition-colors">
                  All Artworks & Crafts
                </Link>
              </li>
              <li>
                <Link to="/custom-order" className="hover:text-[#FBF8F3] transition-colors">
                  Request Custom Gift
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FBF8F3] transition-colors">
                  Our Story & Artisan
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="hover:text-[#FBF8F3] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#FBF8F3] transition-colors">
                  FAQs & Craft Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#C8A261]">
              Categories
            </h5>
            <ul className="space-y-2 text-sm text-[#A89F95]">
              <li>
                <Link to="/category/handmade-embroidery" className="hover:text-[#FBF8F3] transition-colors">
                  Handmade Embroidery
                </Link>
              </li>
              <li>
                <Link to="/category/resin-art" className="hover:text-[#FBF8F3] transition-colors">
                  Resin Ocean Art & Clocks
                </Link>
              </li>
              <li>
                <Link to="/category/fabric-painting" className="hover:text-[#FBF8F3] transition-colors">
                  Fabric Painting & Sarees
                </Link>
              </li>
              <li>
                <Link to="/category/portraits" className="hover:text-[#FBF8F3] transition-colors">
                  Custom Charcoal Portraits
                </Link>
              </li>
              <li>
                <Link to="/category/customized-gifts" className="hover:text-[#FBF8F3] transition-colors">
                  Personalized Keepsakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#C8A261]">
              Studio Information
            </h5>
            <div className="space-y-2.5 text-xs text-[#A89F95]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C26D53] shrink-0 mt-0.5" />
                <span>Shop Number 399, Janta Market, Mohali, Punjab, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C26D53] shrink-0" />
                <a href="tel:+919915088706" className="hover:text-white transition-colors">
                  +91 99150-88706
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C26D53] shrink-0" />
                <a href="mailto:Kamvorastudio@gmail.com" className="hover:text-white transition-colors">
                  Kamvorastudio@gmail.com
                </a>
              </div>
              <div className="pt-2 text-[11px] text-[#7A7168]">
                Studio Hours: Mon - Sat: 10:00 AM - 7:30 PM IST
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Legal */}
        <div className="pt-8 mt-4 border-t border-[#332E2A] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8C8276]">
          <p>
            &copy; {new Date().getFullYear()} Kamvora Studio. Handcrafted in Mohali, Punjab, India. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-[#EDE7DE] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#EDE7DE] transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/shipping-policy" className="hover:text-[#EDE7DE] transition-colors">
              Shipping Policy
            </Link>
            <Link to="/refund-policy" className="hover:text-[#EDE7DE] transition-colors">
              Return & Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
