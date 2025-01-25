import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif">
            FLEUR
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/collections" className="text-gray-800 hover:text-gray-600">
              COLLECTIONS
            </Link>
            <Link href="/about" className="text-gray-800 hover:text-gray-600">
              ABOUT
            </Link>
            <Link href="/contact" className="text-gray-800 hover:text-gray-600">
              CONTACT
            </Link>
            <Link 
              href="/shop"
              className="bg-[#E8D5C4] text-gray-800 px-6 py-2 rounded-full hover:bg-[#E8D5C4]/90"
            >
              SHOP
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-800">
            <FontAwesomeIcon icon={faShoppingBag} className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 