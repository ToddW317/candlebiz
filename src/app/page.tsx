import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import GiftIdeas from '@/components/GiftIdeas';
import PopularProducts from '@/components/PopularProducts';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <GiftIdeas />
      <PopularProducts />
      <Newsletter />
      <Footer />
    </>
  );
}
