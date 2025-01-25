import Image from 'next/image';
import Link from 'next/link';

const ServiceCard = ({ 
  title, 
  description, 
  image, 
  alt 
}: { 
  title: string; 
  description: string; 
  image: string; 
  alt: string; 
}) => {
  return (
    <div className="flex flex-col items-center text-center px-4 md:px-6">
      <div className="relative w-full max-w-[280px] aspect-square mb-6 rounded-t-full overflow-hidden bg-[#E8D5C4]/20">
        <div className="absolute inset-0 p-6 md:p-8">
          <div className="relative w-full h-full">
            <Image
              src={image}
              alt={alt}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
      <h3 className="text-xl md:text-2xl font-serif mb-3">{title}</h3>
      <p className="text-gray-600 text-sm md:text-base mb-4 max-w-xs">
        {description}
      </p>
      <Link
        href="/shop"
        className="text-gray-800 hover:text-gray-600 uppercase text-sm tracking-wide"
      >
        READ MORE
      </Link>
    </div>
  );
};

const Services = () => {
  return (
    <section className="py-12 md:py-20 px-4 bg-[#F5EBE6]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 md:mb-16">
          <p className="text-gray-600 uppercase tracking-wide mb-3 md:mb-4 text-sm">THIS IS WHAT WE DO</p>
          <h2 className="text-3xl md:text-4xl font-serif">Our Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <ServiceCard
            title="Custom Bouquets"
            description="Do you have an idea/style in mind? From modern minimalist to vintage-inspired modern classics, we know what you need."
            image="/custom-bouquet.jpg"
            alt="Custom dried flower bouquet"
          />
          <ServiceCard
            title="Occasion Flowers"
            description="Beautiful flowers for your special day or the perfect touch for your next business event."
            image="/occasion-flowers.jpg"
            alt="Occasion flowers arrangement"
          />
          <ServiceCard
            title="Premade Bouquets"
            description="Our timely and seasonless pieces combine classic silhouettes with contemporary combinations of selected dried flowers."
            image="/premade-bouquet.jpg"
            alt="Premade dried flower bouquet"
          />
        </div>
      </div>
    </section>
  );
};

export default Services; 