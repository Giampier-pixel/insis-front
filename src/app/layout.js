import { DM_Sans, DM_Mono } from 'next/font/google';
import '@/styles/global.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
});

export const metadata = {
  title: 'INSIS Platform',
  description: 'INSIS EdTech B2B/B2C Learning Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${dmSans.variable} ${dmMono.variable}`}
        style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
