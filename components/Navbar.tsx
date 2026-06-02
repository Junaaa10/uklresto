'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Beranda', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Pemesanan', href: '/pemesanan' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Brand */}
        <Link href="/" className="text-2xl font-black text-orange-600 tracking-tight">
          RasaNusantara
        </Link>

        {/* Menu Navigasi Tengah */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  isActive ? 'text-orange-600 font-extrabold' : 'text-gray-600 hover:text-orange-600'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Tombol Samping */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-orange-600 transition">
            Masuk
          </Link>
          <Link href="/register" className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-full text-sm transition shadow-md shadow-orange-600/10">
            Daftar
          </Link>
        </div>
      </div>
    </nav>
  );
}