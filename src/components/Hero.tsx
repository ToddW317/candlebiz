import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative h-[70vh] bg-[#F5EBE6] flex items-center justify-center overflow-hidden">
      {/* Arch Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-4xl h-[60vh] bg-[#E8D5C4]/60 rounded-t-full transform translate-y-1/3" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-serif mb-4">
          Custom Dried Flower Bouquets
        </h1>
        <p className="text-gray-600 mb-8">
          Free delivery on orders over $75
        </p>
        <Link
          href="/shop"
          className="inline-block bg-white text-gray-800 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors"
        >
          SHOP
        </Link>
      </div>

      {/* Decorative Images */}
      <div className="absolute right-4 bottom-4 md:right-20 md:bottom-20 flex items-center space-x-4">
        <div className="relative w-24 h-36 md:w-40 md:h-56">
          <Image
            src="/vase-1.jpg"
            alt="Decorative vase with dried flowers"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="relative w-20 h-28 md:w-32 md:h-44">
          <Image
            src="/vase-2.jpg"
            alt="Modern circular vase"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="absolute bottom-8 left-8 flex space-x-6 text-gray-600">
        <Link href="#" className="hover:text-gray-800">Instagram</Link>
        <Link href="#" className="hover:text-gray-800">Twitter</Link>
        <Link href="#" className="hover:text-gray-800">Facebook</Link>
        <Link href="#" className="hover:text-gray-800">TikTok</Link>
      </div>
    </section>
  );
};

export default Hero; 