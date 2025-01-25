import Image from 'next/image';
import Link from 'next/link';

const GiftIdeas = () => {
  return (
    <section className="relative py-16 px-8 md:px-16 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-center">
          <div className="max-w-lg">
            <p className="text-gray-600 uppercase tracking-wide mb-4">REMEMBER YOUR LOVED ONES</p>
            <h2 className="text-4xl font-serif mb-6">Gift Ideas That Last Longer</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Who doesn't love flowers? Whether you're giving or receiving flowers, the only downside is how short-lived the happiness with a fresh bouquet of cut bouquets. We are passionate about creating bouquets that not only look beautiful, but last longer. Our premium dried flower bouquets can last up to years. Ask our staff for more information for your perfect bouquet.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#E8D5C4] text-gray-800 px-8 py-3 rounded-full hover:bg-[#E8D5C4]/90 transition-colors"
            >
              LET'S GO
            </Link>
          </div>
        </div>
      </div>

      {/* Banner shaped image container */}
      <div className="absolute right-4 md:right-16 -bottom-24 md:-bottom-32">
        <div className="relative w-[280px] md:w-[380px] aspect-[3/4] bg-[#E8D5C4]/10 rounded-b-[380px] overflow-hidden">
          <Image
            src="/gift-bouquet.jpg"
            alt="Beautiful dried flower arrangement"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default GiftIdeas; 