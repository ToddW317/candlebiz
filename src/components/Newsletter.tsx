'use client';

import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Arch Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-4xl h-[80vh] bg-[#E8D5C4]/30 rounded-t-full transform translate-y-1/2" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-serif mb-6">Talk To Our Staff</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Trouble choosing your bouquet? Talk to our friendly customer service who can help you during your journey to finding your dream bouquet. We are a long line of passionate florists and believe that love and care make the best dried flower bouquets.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="px-6 py-3 rounded-full bg-white border border-gray-200 focus:outline-none focus:border-[#E8D5C4] flex-grow max-w-md"
              required
            />
            <button
              type="submit"
              className="bg-[#E8D5C4] text-gray-800 px-8 py-3 rounded-full hover:bg-[#E8D5C4]/90 transition-colors whitespace-nowrap"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter; 