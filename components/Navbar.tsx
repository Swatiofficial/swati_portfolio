'use client';

import React, { useState } from 'react';
import { SITE_CONFIG } from '@/data/projects';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenContact?: () => void;
}

export function Navbar({ onOpenContact }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Skills', href: '#expertise' },
    { label: 'Contact', href: '#contact' },
  ];
  const initials = SITE_CONFIG.ownerName
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pb-2 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-pill rounded-full px-5 sm:px-7 py-3 border border-white/10 shadow-2xl shadow-black/80">
        {/* Brand / Logo */}
        <a
          href="#hero"
          onClick={(e) => handleScrollTo(e, '#hero')}
          className="flex min-h-11 items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#D7FF64] rounded-full px-1"
          aria-label={`${SITE_CONFIG.ownerName} Home`}
        >
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-mono font-bold tracking-tighter text-[#D7FF64] group-hover:bg-[#D7FF64] group-hover:text-black transition-colors">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider uppercase text-white group-hover:text-[#D7FF64] transition-colors">
              {SITE_CONFIG.ownerName}
            </span>
            <span className="text-[10px] tracking-widest text-[#888888] font-mono -mt-0.5">
              {SITE_CONFIG.titleRole}
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="inline-flex min-h-11 items-center text-xs lg:text-sm font-medium tracking-wide text-[#888888] hover:text-white px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D7FF64]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Header Right Action */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            onClick={(e) => {
              if (onOpenContact) {
                e.preventDefault();
                onOpenContact();
              } else {
                handleScrollTo(e, '#contact');
              }
            }}
            className="glass-button hidden sm:inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold tracking-wide hover:bg-[#D7FF64] hover:text-black px-5 py-2 rounded-full transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D7FF64] focus:ring-offset-2 focus:ring-offset-black"
          >
            <span>Contact</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-h-11 min-w-11 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D7FF64]"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 mx-auto max-w-md glass-panel rounded-2xl p-4 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="min-h-11 text-sm font-medium text-[#F5F5F5] hover:text-[#D7FF64] px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="mt-2 min-h-11 text-center text-xs font-semibold uppercase tracking-wider bg-[#D7FF64] text-black py-2.5 rounded-xl transition-colors hover:brightness-110"
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
