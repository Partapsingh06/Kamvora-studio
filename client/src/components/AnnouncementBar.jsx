import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import api from '../utils/api.js';

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [announcement, setAnnouncement] = useState({
    text: 'Handcrafted with Love | Discover Something Unique | Free Shipping on Orders Over ₹999',
    isActive: true,
    link: '/shop'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data.success && data.data?.announcement) {
          setAnnouncement(data.data.announcement);
        }
      } catch {
        // Fallback default
      }
    };
    fetchSettings();
  }, []);

  if (!isVisible || !announcement.isActive) return null;

  return (
    <div className="bg-[#262220] text-[#EFEBE4] text-xs sm:text-sm py-2 px-4 relative z-40 border-b border-[#3E3834] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2 pr-6">
        <Sparkles className="w-3.5 h-3.5 text-[#C8A261] shrink-0 animate-pulse" />
        <Link
          to={announcement.link || '/shop'}
          className="hover:text-[#C8A261] transition-colors tracking-wide font-medium"
        >
          {announcement.text}
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#A89F95] hover:text-white transition-colors"
        aria-label="Close announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
