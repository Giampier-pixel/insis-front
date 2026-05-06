import { Inter } from 'next/font/google';
import '@/styles/global.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'INSIS Platform',
  description: 'INSIS EdTech B2B/B2C Learning Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
