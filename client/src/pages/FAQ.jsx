import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Sparkles, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How long does a custom embroidery hoop or portrait order take to make?',
      a: 'Because every artwork is painstakingly crafted by hand, custom embroidery hoops typically require 4 to 8 business days for stitching, finishing, and mounting. Hand-drawn charcoal portraits and layered ocean resin clocks require 5 to 10 days to allow for fixative curing and multi-layer crystal resin hardening. If you need urgent rush delivery for an anniversary or birthday, please contact us on WhatsApp (+91 99150-88706) and we will do our best to accommodate your date!'
    },
    {
      q: 'How do I care for my handmade resin art clock or geode coasters?',
      a: 'Our crystal resin pieces are UV-resistant and heat-tested. Simply dust with a soft, clean dry microfiber cloth or gently wipe with a damp cloth and mild dish soap. Do not submerge completely in boiling water, do not place in a microwave or dishwasher, and keep away from direct contact with harsh alcohol-based chemical cleaners.'
    },
    {
      q: 'How are fragile resin and framed artworks packaged for shipping?',
      a: 'We pack every creation with supreme care. Pieces are first wrapped in acid-free craft butter paper, cushioned with multiple layers of shock-absorbent honeycomb padding, protected with corner edge protectors, and secured inside heavy-duty 5-ply corrugated transit boxes marked "FRAGILE ARTWORK". We guarantee 100% safe transit replacement if any damage occurs during shipping.'
    },
    {
      q: 'Can I request specific names, dates, or custom color palettes for a gift?',
      a: 'Absolutely! Personalization is at the core of Kamvora Studio. You can specify names, wedding dates, meaningful quotes, or custom floral hues in the customization notes during checkout or by submitting our dedicated Custom Order Request form.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Cash on Delivery (COD) across India, as well as safe online payments via Razorpay (UPI - Google Pay, PhonePe, Paytm, all major Credit/Debit Cards, and Net Banking).'
    },
    {
      q: 'Can I visit the studio in Mohali to view pieces in person?',
      a: 'Yes, we love meeting art lovers! You are warmly welcome to visit us at Shop Number 399, Janta Market, Mohali, Punjab during studio hours (Monday through Saturday, 10:00 AM to 7:30 PM).'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C26D53]">
          Got Questions?
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-medium text-[#24211E]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#736A62]">
          Everything you need to know about our handcrafted processes, customization options, shipping, and artwork care.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-[#FAF6EE] border border-[#EDE5D8] overflow-hidden transition-all shadow-2xs"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-art text-base sm:text-lg font-bold text-[#24211E] hover:text-[#C26D53] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-[#C26D53] transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#665E56] leading-relaxed border-t border-[#EAE2D5] pt-3 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-8 rounded-3xl bg-[#FAF5ED] border border-[#E5DAC8] text-center space-y-3">
        <h3 className="font-art text-xl font-bold text-[#24211E]">
          Have a question not listed here?
        </h3>
        <p className="text-xs text-[#736A62]">
          Speak directly with our studio artisans. We’re always delighted to chat.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C26D53] text-white text-xs font-bold hover:bg-[#AD5940] transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contact Studio Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
