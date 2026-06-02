import type { Metadata } from 'next';
import { Providers } from './provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'RASANUSA Resto',
  description: 'Eksplorasi Menu Kuliner Nusantara Terbaik',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}