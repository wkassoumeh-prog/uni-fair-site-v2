import React, { useState } from 'react';
import type { Copy } from '@/content/copy.en';
import type { Locale } from '@/content/getCopy';

interface HeaderProps {
  isScrolled: boolean;
  locale: Locale;
  copy: Copy;
}

const Header: React.FC<HeaderProps> = ({ isScrolled, locale, copy }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: copy.header.nav.about, href: `/${locale}#about` },
    { name: copy.header.nav.exhibitors, href: `/${locale}#why-exhibit` },
    { name: copy.header.nav.visitors, href: `/${locale}#for-visitors` },
    { name: copy.header.nav.faq, href: `/${locale}#faq` },
  ];

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const currentHash = window.location.hash;
    window.location.href = `/${newLocale}${currentHash}`;
  };

  return (
    <header
      // 1. REMOVED 'py-3' and 'py-6'.
      // 2. Kept transition and z-index.
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-white shadow-lg py-2'  // Removed py-3 here
          : 'bg-transparent py-3'      // Removed py-6 here
      }`}
    >
      {/* 3. Added 'h-full' to container to ensure it respects the parent header 
         (though flex items usually handle this automatically).
      */}
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        <div className="flex items-center gap-y-4">
          {/* Logo */}
          {/* 4. MOVED SIZE CONTROL HERE:
              Instead of padding the header, we resize the logo.
              The header will shrink/grow to fit the logo perfectly.
          */}
          <a 
            href={`/${locale}`}
            className="flex items-center"
            aria-label="Go to homepage"
          >
            <img
              src={isScrolled ? "/logo/logo-small.png" : "/logo/logo-small-w.png"}
              alt="Career Expo Syria 2026 Logo"
              className={`object-cover transition-all duration-300 ${
                isScrolled ? 'h-12' : 'h-14' 
              }`} 
              // h-20 (80px) when scrolled, h-28 (112px) when at top. 
              // Adjust these numbers to make the header taller/shorter.
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm xl:text-base font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-amber-500 ${
                isScrolled ? 'text-slate-700' : 'text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href={`/${locale}#contact`}
            className={`px-6 py-2 rounded-full font-bold text-sm xl:text-base flex items-center justify-center transition-all duration-300 border-2 ${
              isScrolled 
                ? 'bg-blue-900 border-blue-900 text-white hover:bg-transparent hover:text-blue-900' 
                : 'bg-white border-white text-blue-900 hover:bg-transparent hover:text-white'
            }`}
          >
            {copy.header.nav.contactUs}
          </a>
          <button
            onClick={toggleLocale}
            className={`px-4 py-2 rounded-full font-bold text-sm xl:text-base transition-all duration-300 border-2 ${
              isScrolled 
                ? 'border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white' 
                : 'border-white text-white hover:bg-white hover:text-blue-900'
            }`}
            aria-label="Toggle language"
          >
            {locale === 'en' ? 'العربية' : 'EN'}
          </button>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="lg:hidden">
          <button 
            className={isScrolled ? 'text-blue-900' : 'text-white'}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`px-6 pt-2 pb-6 space-y-2 shadow-xl ${
          isScrolled ? 'bg-white' : 'bg-blue-900/95 backdrop-blur-md'
        }`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-3 text-lg font-semibold uppercase tracking-wider border-b border-white/10 ${
                isScrolled ? 'text-slate-700' : 'text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 space-y-3">
            <a
              href={`/${locale}#contact`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block w-full text-center px-6 py-4 rounded-full font-bold text-lg transition-all duration-300 border-2 ${
                isScrolled 
                  ? 'bg-blue-900 border-blue-900 text-white' 
                  : 'bg-white border-white text-blue-900'
              }`}
            >
              {copy.header.nav.contactUs}
            </a>
            <button
              onClick={() => {
                toggleLocale();
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-center px-6 py-4 rounded-full font-bold text-lg transition-all duration-300 border-2 ${
                isScrolled 
                  ? 'border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white' 
                  : 'border-white text-white hover:bg-white hover:text-blue-900'
              }`}
            >
              {locale === 'en' ? 'العربية' : 'EN'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;