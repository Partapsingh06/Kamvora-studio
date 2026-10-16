import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-[#4A443E]">
      <div className="border-b border-[#EDE5D8] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">Legal & Compliance</span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E] mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#8C8276]">Last updated: October 2026 | Kamvora Studio</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-[#665E56]">
        <p>
          At <b>Kamvora Studio</b>, we deeply value the trust you place in us when sharing your personal details, custom gift photographs, and delivery information. This Privacy Policy details our transparent commitment to safeguarding your privacy.
        </p>

        <h3 className="font-art text-lg font-bold text-[#24211E]">1. Information We Collect</h3>
        <p>
          When you place an order, create an account, or submit a custom craft request, we collect your name, email address, phone number, delivery address, and reference photos you upload.
        </p>

        <h3 className="font-art text-lg font-bold text-[#24211E]">2. How We Use Your Information</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>To handcraft, customize, and fulfill your ordered artwork.</li>
          <li>To generate courier shipping labels and deliver parcels safely to your doorstep.</li>
          <li>To provide order tracking updates via SMS, WhatsApp, or email.</li>
          <li>We never sell, rent, or trade your personal data with third-party advertisers.</li>
        </ul>

        <h3 className="font-art text-lg font-bold text-[#24211E]">3. Payment Security</h3>
        <p>
          Online payments are processed securely through certified PCI-DSS compliant gateways like Razorpay. Kamvora Studio does not store your credit card numbers, debit card details, or banking passwords.
        </p>

        <h3 className="font-art text-lg font-bold text-[#24211E]">4. Studio Contact</h3>
        <p>
          If you have questions regarding your data or wish to have your details deleted, contact us at: <a href="mailto:Kamvorastudio@gmail.com" className="text-[#C26D53] underline font-semibold">Kamvorastudio@gmail.com</a> or call <a href="tel:+919915088706" className="text-[#C26D53] underline font-semibold">+91 99150-88706</a>.
        </p>
      </div>
    </div>
  );
};

export const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-[#4A443E]">
      <div className="border-b border-[#EDE5D8] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">Terms of Service</span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E] mt-1">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#8C8276]">Kamvora Studio, Mohali, Punjab</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-[#665E56]">
        <h3 className="font-art text-lg font-bold text-[#24211E]">1. Handmade Craft Characteristics</h3>
        <p>
          Because every item is handcrafted individually by our artisans, subtle variations in wood grain, thread tension, pigment swirl, or flower placement are natural hallmarks of authentic handmade artistry. These nuances ensure your piece is one-of-a-kind.
        </p>

        <h3 className="font-art text-lg font-bold text-[#24211E]">2. Custom Commissions</h3>
        <p>
          Custom orders with personalized names, dates, or reference sketches are crafted to your exact instructions. Once the creation process has commenced, custom orders cannot be cancelled.
        </p>

        <h3 className="font-art text-lg font-bold text-[#24211E]">3. Pricing & Promotions</h3>
        <p>
          All prices are quoted in Indian National Rupees (INR) and are inclusive of standard GST. Valid promotional coupon codes must be applied before checkout completion.
        </p>
      </div>
    </div>
  );
};

export const ShippingPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-[#4A443E]">
      <div className="border-b border-[#EDE5D8] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">Delivery Guide</span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E] mt-1">
          Shipping & Packaging Policy
        </h1>
        <p className="text-xs text-[#8C8276]">Pan-India Insured Dispatch from Mohali</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-[#665E56]">
        <h3 className="font-art text-lg font-bold text-[#24211E]">1. Free Shipping Threshold</h3>
        <p>
          We offer <b>Free Standard Shipping</b> on all orders above ₹999 across India. For orders below ₹999, a nominal flat packaging and shipping charge of ₹80 applies.
        </p>

        <h3 className="font-art text-lg font-bold text-[#24211E]">2. Dispatch & Delivery Timelines</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><b>Ready In-Stock Pieces:</b> Dispatched within 24 to 48 hours of order confirmation.</li>
          <li><b>Bespoke / Custom Orders:</b> Crafting and curing takes 4 to 8 days, followed by 3 to 5 business days transit time.</li>
          <li>A live tracking link with courier AWB is provided via SMS and accessible on our tracking portal.</li>
        </ul>

        <h3 className="font-art text-lg font-bold text-[#24211E]">3. Shatter-Proof Transit Guarantee</h3>
        <p>
          We wrap all resin clocks, glassware, and framed portraits in multi-layered honeycomb cushioning inside reinforced 5-ply cartons. In the rare event of transit damage, we provide an immediate free repair or replacement.
        </p>
      </div>
    </div>
  );
};

export const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-[#4A443E]">
      <div className="border-b border-[#EDE5D8] pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C26D53]">Peace of Mind</span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24211E] mt-1">
          Return & Refund Policy
        </h1>
        <p className="text-xs text-[#8C8276]">Handcrafted with integrity at Kamvora Studio</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-[#665E56]">
        <h3 className="font-art text-lg font-bold text-[#24211E]">1. Transit Damage or Defects</h3>
        <p>
          If your artwork arrives damaged in transit, please notify us within 48 hours of delivery at <a href="mailto:Kamvorastudio@gmail.com" className="text-[#C26D53] underline">Kamvorastudio@gmail.com</a> or WhatsApp (+91 99150-88706) with an unboxing photo or video. We will promptly dispatch a replacement at zero extra cost to you.
        </p>

        <h3 className="font-art text-lg font-bold text-[#24211E]">2. Non-Customized Products</h3>
        <p>
          For standard catalog items that have not been personalized with names or custom dates, we accept returns within 7 days of delivery in their original unblemished condition and packaging.
        </p>

        <h3 className="font-art text-lg font-bold text-[#24211E]">3. Customized / Personalized Creations</h3>
        <p>
          Artworks customized with specific names, portraits, or commissioned color requests cannot be returned or refunded unless there is a physical transit defect.
        </p>
      </div>
    </div>
  );
};
