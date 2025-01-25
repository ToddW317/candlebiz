import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-white py-16 px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Newsletter */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-serif mb-4 inline-block">
              FLEUR
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Custom dried flower arrangement that can last up to years.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="email"
                placeholder="Email Address"
                className="px-4 py-2 rounded-full border border-gray-200 flex-grow max-w-xs focus:outline-none focus:border-[#E8D5C4]"
              />
              <button className="bg-[#E8D5C4] text-gray-800 px-6 py-2 rounded-full hover:bg-[#E8D5C4]/90">
                SUBSCRIBE
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-800">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-800">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-800">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-800">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-600">
              <li>+1 234 567 8900</li>
              <li>hello@fleur.com</li>
              <li>123 Flower Street</li>
              <li>San Francisco, CA 94102</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Fleur. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
              <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 