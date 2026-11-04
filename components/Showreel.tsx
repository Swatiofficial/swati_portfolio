'use client';

import React, { useState } from 'react';
import { SHOWREEL_CONFIG, SITE_CONFIG } from '@/data/projects';
import { Play, Film, HelpCircle } from 'lucide-react';
import { parseVideoSource } from '@/lib/video';

export function Showreel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const parsed = parseVideoSource(SHOWREEL_CONFIG.videoUrl);

  return (
    <section id="showreel" className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-8 lg:px-14 bg-black border-t border-white/5 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-x-0 top-1/2 mx-auto -translate-y-1/2 w-full max-w-[700px] h-[500px] bg-amber-950/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <Film className="w-3.5 h-3.5 text-[#D7FF64]" />
            <span className="text-xs font-mono tracking-widest text-[#D7FF64] uppercase">
              Showreel
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">
            {SHOWREEL_CONFIG.headline}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            {SHOWREEL_CONFIG.subtitle}
          </p>
        </div>

        {/* Widescreen 16:9 Showcase Player / Facade */}
        <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-zinc-950/90 shadow-2xl shadow-black/90 group">
          {isPlaying && parsed.isValid ? (
            parsed.type === 'drive' ? (
              <iframe
                src={parsed.embedUrl}
                title={`${SHOWREEL_CONFIG.headline} — ${SITE_CONFIG.ownerName}`}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : parsed.type === 'youtube' ? (
              <iframe
                src={parsed.embedUrl}
                title={`${SHOWREEL_CONFIG.headline} — ${SITE_CONFIG.ownerName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                src={parsed.embedUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video.
              </video>
            )
          ) : (
            /* Cinematic Facade / Unconfigured Placeholder */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 text-center bg-gradient-to-b from-zinc-900/60 to-black">
              {/* Subtle film grain & grid texture */}
              <div className="absolute inset-0 film-grain opacity-20 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

              {/* Timecode overlay */}
              <div className="absolute top-5 left-5 font-mono text-[11px] text-zinc-500 tracking-widest">
                SHOWREEL PREVIEW
              </div>
              <div className="absolute top-5 right-5 hidden font-mono text-[11px] text-zinc-500 tracking-widest sm:block">
                VIDEO &bull; DESIGN &bull; CONTENT
              </div>

              {parsed.isValid ? (
                /* Has valid URL -> Big Play Button */
                <button
                  onClick={() => setIsPlaying(true)}
                  type="button"
                  className="relative z-10 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#D7FF64] group-hover:text-black group-hover:border-[#D7FF64] group-hover:scale-105 transition-all duration-300 shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#D7FF64]"
                  aria-label={`Play ${SITE_CONFIG.ownerName} showreel`}
                >
                  <Play className="w-8 sm:w-10 h-8 sm:h-10 fill-current ml-1" />
                </button>
              ) : (
                /* Unconfigured state with clear copy-paste instructions */
                <div className="relative z-10 max-w-md flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D7FF64] mb-4">
                    <Play className="w-7 h-7 fill-current ml-1 opacity-80" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    Showreel coming soon
                  </h3>
                  <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                    Add a video link to the <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[#D7FF64]">showreel.videoUrl</code> field in <code className="text-white font-mono">data/portfolio.json</code>.
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
                    <HelpCircle className="w-3.5 h-3.5 text-[#D7FF64]" />
                    <span>Supports YouTube, Drive preview, and direct MP4</span>
                  </div>
                </div>
              )}

              {/* Bottom Framing Marks */}
              <div className="absolute bottom-5 inset-x-5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>VIDEO EDITING &bull; DIGITAL DESIGN</span>
                <span className="hidden sm:inline">BRAND-ALIGNED CONTENT</span>
                <span>VISUAL STORYTELLING</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
