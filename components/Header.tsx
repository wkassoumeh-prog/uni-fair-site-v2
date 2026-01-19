
import React from 'react';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Exhibitors', href: '#why-exhibit' },
    { name: 'Visitors', href: '#for-visitors' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-white py-3 shadow-lg' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className={`flex items-center space-x-2`}>
        {/* Logo */}
            <img
              src={isScrolled ? "/logo/logo-full.png" : "/logo/logo-full-w.png"}
              alt="Career Expo Syria 2026 Logo"
              className="object-contain h-24"
            />
        </div>
 
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-base font-semibold uppercase tracking-wider transition-colors duration-300 hover:text-amber-500 ${
                isScrolled ? 'text-slate-700' : 'text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#registration"
            className={`px-6 py-2 rounded-full font-bold text-base items-center justify-center transition-all duration-300 border-2 ${
            isScrolled 
              ? 'bg-blue-900 border-blue-900 text-white hover:bg-transparent hover:text-blue-900' 
              : 'bg-white border-white text-blue-900 hover:bg-transparent hover:text-white'
          }`}>
            REGISTER NOW
          </a>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button className={isScrolled ? 'text-blue-900' : 'text-white'}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
