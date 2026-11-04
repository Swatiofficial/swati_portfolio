'use client';

import React from 'react';
import Image from 'next/image';
import { SECTION_COPY, SITE_CONFIG } from '@/data/projects';
import { Sparkles, Clapperboard, Compass } from 'lucide-react';

export function About() {
  const { about } = SITE_CONFIG;

  return (
    <section id="about" className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-8 lg:px-14 bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Portrait / BTS Image Slot with designed placeholder frame */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 p-3 shadow-2xl">
              {/* Inner frame */}
              <div className="relative isolate aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-black flex flex-col items-center justify-between p-6 border border-white/5">
                {about.portraitImage && (
                  <>
                    <Image
                      src={about.portraitImage}
                      alt={`${SITE_CONFIG.ownerName}, portfolio portrait`}
                      fill
                      sizes="(max-width: 1023px) 100vw, 42vw"
                      className="object-cover object-[center_42%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/65" />
                  </>
                )}

                {/* Film viewfinder overlay corners */}
                <div className="absolute top-4 left-4 z-10 w-4 h-4 border-t-2 border-l-2 border-[#D7FF64]" />
                <div className="absolute top-4 right-4 z-10 w-4 h-4 border-t-2 border-r-2 border-[#D7FF64]" />
                <div className="absolute bottom-4 left-4 z-10 w-4 h-4 border-b-2 border-l-2 border-[#D7FF64]" />
                <div className="absolute bottom-4 right-4 z-10 w-4 h-4 border-b-2 border-r-2 border-[#D7FF64]" />

                {/* Top header */}
                <div className="relative z-10 w-full flex items-center justify-between text-[10px] font-mono text-white/80 uppercase tracking-widest">
                  <span>PORTFOLIO PROFILE</span>
                  <span>{SITE_CONFIG.ownerName.toUpperCase()}</span>
                </div>

                {/* Center silhouette / portrait placeholder */}
                {!about.portraitImage && (
                  <div className="relative z-10 my-auto flex flex-col items-center text-center p-6">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#D7FF64] mb-4 shadow-inner">
                      <Clapperboard className="w-10 h-10" />
                    </div>
                    <h4 className="text-base font-bold text-white tracking-wide uppercase">
                      {SITE_CONFIG.ownerName}
                    </h4>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      {SITE_CONFIG.titleRole}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-mono mt-3 max-w-[200px]">
                      [ Add a portrait path in data/portfolio.json ]
                    </p>
                  </div>
                )}

                {/* Bottom timecode */}
                <div className="relative z-10 w-full flex items-center justify-between text-[10px] font-mono text-white/80">
                  <span>VISUAL CONTENT</span>
                  <span className="text-[#D7FF64]">&bull; CREATIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Copy & Philosophy */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D7FF64]" />
              <span className="text-xs font-mono tracking-widest text-[#D7FF64] uppercase">
                {SECTION_COPY.aboutLabel}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[1.12] mb-6">
              {about.heading}
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed mb-6">
              {about.bio}
            </p>

            {/* Philosophy quote */}
            <div className="relative border-l-2 border-[#D7FF64] pl-5 py-2 my-4 bg-white/[0.02] rounded-r-xl">
              <p className="text-sm sm:text-base italic text-zinc-300 font-serif leading-relaxed">
                &ldquo;{about.philosophy}&rdquo;
              </p>
            </div>

            {/* Creative Interests */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                <Compass className="w-3.5 h-3.5 text-[#D7FF64]" />
                <span>Creative Focus &amp; Interests</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {about.interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-xs font-mono text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
