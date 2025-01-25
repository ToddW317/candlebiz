import './globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Cormorant_Garamond } from 'next/font/google';
config.autoAddCss = false;

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata = {
  title: 'Fleur | Custom Dried Flower Bouquets',
  description: 'Handcrafted dried flower arrangements for your home and special occasions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body className="min-h-screen bg-[#F5EBE6] font-sans">
        {children}
      </body>
    </html>
  );
}
