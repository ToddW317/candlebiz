'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faBox, 
  faShoppingCart, 
  faUsers, 
  faTags,
  faChartLine,
  faSignOutAlt,
  faBars,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: faHome },
  { name: 'Products', href: '/admin/products', icon: faBox },
  { name: 'Orders', href: '/admin/orders', icon: faShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: faUsers },
  { name: 'Categories', href: '/admin/categories', icon: faTags },
  { name: 'Analytics', href: '/admin/analytics', icon: faChartLine },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('auth-token');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-skin-primary">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-skin-primary px-4 py-3">
        <button
          onClick={toggleSidebar}
          className="text-skin-primary hover:text-skin-secondary transition-colors"
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faXmark : faBars} className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-30 w-64 bg-white border-r border-skin-primary transition-transform duration-200 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Header */}
          <div className="p-4 border-b border-skin-primary">
            <h1 className="text-2xl font-cormorant font-bold text-skin-primary">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-light text-primary-dark'
                      : 'text-skin-secondary hover:bg-skin-primary hover:text-primary-dark'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-skin-primary">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-skin-secondary hover:bg-skin-primary hover:text-primary-dark rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'md:ml-64' : ''} transition-margin duration-200 ease-in-out`}>
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
} 