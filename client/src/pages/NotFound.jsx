import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ShoppingBag, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative inline-block">
          <span className="font-editorial text-8xl sm:text-9xl font-bold text-[#EADDCF] select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FAF5ED] border border-[#DED4C5] flex items-center justify-center text-[#C26D53] shadow-md animate-bounce">
              <Sparkles className="w-8 h-8 text-[#C8A261]" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-art text-3xl font-bold text-[#24211E]">
            Lost in the Studio?
          </h1>
          <p className="text-xs sm:text-sm text-[#736A62] leading-relaxed">
            The artwork or studio page you are searching for might have been moved, renamed, or is currently being repainted on our easels.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-[#24211E] hover:bg-[#C26D53] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Studio Home</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#FAF5ED] text-[#24211E] border border-[#DED4C5] text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#C26D53]" />
            <span>Explore Collection</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
