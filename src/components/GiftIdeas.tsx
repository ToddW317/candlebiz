import Image from 'next/image';
import Link from 'next/link';

const GiftIdeas = () => {
  return (
    <section className="relative py-12 md:py-16 px-4 md:px-16 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="max-w-lg">
            <p className="text-gray-600 uppercase tracking-wide mb-3 md:mb-4 text-sm">
              REMEMBER YOUR LOVED ONES
            </p>
            <h2 className="text-3xl md:text-4xl font-serif mb-4 md:mb-6">
              Gift Ideas That Last Longer
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
              Who doesn&apos;t love flowers? Whether you&apos;re giving or receiving flowers, the only downside is how short-lived the happiness with a fresh bouquet of cut bouquets. We are passionate about creating bouquets that not only look beautiful, but last longer. Our premium dried flower bouquets can last up to years. Ask our staff for more information for your perfect bouquet.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#E8D5C4] text-gray-800 px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:bg-[#E8D5C4]/90 transition-colors text-sm md:text-base"
            >
              LET&apos;S GO
            </Link>
          </div>
        </div>
      </div>

      {/* Banner shaped image container */}
      <div className="absolute right-4 md:right-16 -bottom-20 md:-bottom-32">
        <div className="relative w-[240px] md:w-[380px] aspect-[3/4] bg-[#E8D5C4]/10 rounded-b-[380px] overflow-hidden">
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