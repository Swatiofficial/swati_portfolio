'use client';

import React from 'react';
import { SITE_CONFIG } from '@/data/projects';
import { ArrowUp } from 'lucide-react';

export function Footer() {
  const currentYear = 2026;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black text-white py-16 px-4 sm:px-8 lg:px-14 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Top Row: Wordmark, Tagline, Back to top */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white block uppercase">
              {SITE_CONFIG.ownerName}
            </span>
            <span className="text-xs font-mono text-zinc-500 tracking-widest mt-1 block">
              {SITE_CONFIG.titleRole}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              type="button"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-[#D7FF64] transition-colors p-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-1 focus:ring-[#D7FF64]"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Dynamic Copyright and Closing Line */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>
            &copy; {currentYear} {SITE_CONFIG.ownerName}. ALL RIGHTS RESERVED.
          </p>

          <p className="text-zinc-400 tracking-widest uppercase">
            MADE WITH INTENTION. FRAME BY FRAME.
          </p>
        </div>
      </div>
    </footer>
  );
}
