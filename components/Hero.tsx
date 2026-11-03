'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Project, SECTION_COPY, SITE_CONFIG, PROJECTS } from '@/data/projects';
import { Play, ChevronLeft, ChevronRight, ArrowDown, X } from 'lucide-react';
import { parseVideoSource, resolveThumbnail } from '@/lib/video';

interface HeroCardVideoProps {
  previewUrl?: string;
  isHovered: boolean;
  title: string;
}

function HeroCardVideo({ previewUrl, isHovered, title }: HeroCardVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !previewUrl) return;

    if (isHovered) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled gracefully if browser denies or interrupts
        });
      }
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered, previewUrl]);

  if (!previewUrl) return null;

  return (
    <video
      ref={videoRef}
      src={previewUrl}
      muted
      playsInline
      loop
      preload="metadata"
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-[2] pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}
      aria-label={`Preview of ${title}`}
    />
  );
}

export function Hero() {
  // Show up to four configured projects in the hero preview carousel.
  const heroProjects = PROJECTS.slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePlayerProject, setActivePlayerProject] = useState<Project | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Auto-progress subtle timer (paused when a video is being watched or hovered)
  useEffect(() => {
    if (heroProjects.length < 2 || activePlayerProject || hoveredCardId) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroProjects.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroProjects.length, activePlayerProject, hoveredCardId]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? heroProjects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % heroProjects.length);
  };

  const handlePlayCard = (project: Project, idx: number) => {
    setActiveIndex(idx);
    setActivePlayerProject(project);
    setHoveredCardId(null);
    // Smooth scroll to the large player directly on the webpage
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleClosePlayer = () => {
    setActivePlayerProject(null);
  };

  const activePlayerParsed = activePlayerProject
    ? parseVideoSource(activePlayerProject.videoUrl)
    : null;

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className={`relative min-h-[88vh] lg:min-h-screen ${
        activePlayerProject ? 'lg:max-h-none' : 'lg:max-h-[880px]'
      } w-full bg-[#000000] text-white flex flex-col justify-between pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-8 lg:px-12 overflow-hidden select-none`}
    >
      {/* Abstract background, avoiding a portrait until the portfolio owner provides one */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(215,255,100,0.10),transparent_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
        <div className="absolute inset-0 film-grain opacity-20" />
      </div>

      {/* Top Header Eyebrow info (Brand identity & availability) */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D7FF64] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D7FF64]"></span>
          </div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-400">
            {SITE_CONFIG.availabilityStatus}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-zinc-500 tracking-wider">
          <span>{SITE_CONFIG.titleRole}</span>
        </div>
      </div>

      {/* Center/Bottom Grid: Compact, balanced composition with reduced inter-column gap */}
      <div className="relative z-10 w-full my-auto py-4 sm:py-6 lg:py-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 xl:gap-8 items-end">
        {/* Left Column: Editorial Headline and Dual CTAs (shifted 20–24px downward) */}
        <div className="lg:col-span-7 flex flex-col justify-end max-w-2xl translate-y-5 sm:translate-y-6">
          {/* Eyebrow / Kicker */}
          <div className="mb-2.5 sm:mb-3 flex items-center gap-2">
            <span className="inline-block w-5 h-[1px] bg-[#D7FF64]" />
            <p className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-400 uppercase">
              {SITE_CONFIG.heroSupportingText}
            </p>
          </div>

          {/* Main Headline */}
          <h1 className="text-[clamp(2.25rem,4.5vw,4.1rem)] font-extrabold tracking-tight text-white leading-[1.08] mb-6 sm:mb-7">
            {SITE_CONFIG.heroHeadline}
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-6">
            {SITE_CONFIG.heroDescription}
          </p>

          {/* CTA Buttons - Resized to ~48-50px height with compact padding & gap */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-3.5">
            {/* Primary Action */}
            <button
              onClick={() => scrollToSection('#work')}
              type="button"
              className="inline-flex items-center justify-center h-[48px] sm:h-[50px] text-xs sm:text-[13px] font-semibold tracking-wider uppercase px-6 sm:px-7 rounded-full bg-white text-black hover:bg-[#D7FF64] transition-all duration-300 shadow-md shadow-white/5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D7FF64]"
            >
              Watch My Work
            </button>

            {/* Secondary Action */}
            <button
              onClick={() => scrollToSection('#contact')}
              type="button"
              className="inline-flex items-center justify-center h-[48px] sm:h-[50px] text-xs sm:text-[13px] font-semibold tracking-wider uppercase px-6 sm:px-7 rounded-full border border-white/20 bg-white/[0.03] hover:bg-white/10 text-white hover:border-white/50 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D7FF64]"
            >
              Let&apos;s Create Together
            </button>
          </div>

          {/* Slide Down Small Size in Bottom Left Side (Reduced top spacing) */}
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500 uppercase select-none">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D7FF64] animate-ping" />
            <span>SLIDE DOWN</span>
            <ArrowDown className="w-3 h-3 text-[#D7FF64] animate-bounce" />
          </div>
        </div>

        {/* Right Column: Interactive Video Preview Cards & Slider Controls */}
        <div className="lg:col-span-5 flex flex-col justify-end w-full mt-6 lg:mt-0">
          {/* Large Video Player (Opens above the slider when any card is clicked) */}
          {activePlayerProject && activePlayerParsed && (
            <div
              ref={playerRef}
              className="relative w-full mb-3 rounded-2xl overflow-hidden border border-white/20 bg-zinc-950 shadow-2xl shadow-black scroll-mt-24 transition-all duration-300 animate-in fade-in"
            >
              {/* Header Bar with Title, Category, and Close Button */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-900/90 border-b border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D7FF64] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D7FF64]" />
                  </span>
                  <span className="text-xs font-mono font-semibold text-white tracking-wider truncate">
                    {activePlayerProject.title}
                  </span>
                  <span className="hidden sm:inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#D7FF64] border border-white/10 shrink-0">
                    {activePlayerProject.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleClosePlayer}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D7FF64] shrink-0"
                  aria-label="Close video player"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 16:9 Google Drive Video Embed Player */}
              <div className="relative aspect-video w-full bg-black">
                {activePlayerParsed.isValid && activePlayerParsed.embedUrl ? (
                  <iframe
                    key={activePlayerProject.id}
                    src={activePlayerParsed.embedUrl}
                    title={activePlayerProject.title}
                    allow="autoplay; fullscreen; encrypted-media"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-zinc-400 font-mono">
                    Unable to load preview player.
                  </div>
                )}
              </div>
            </div>
          )}

          {heroProjects.length > 0 ? (
          <>
          {/* Card Carousel Preview Stack (Tighter card gap and smooth alignment) */}
          <div className="relative overflow-hidden py-1">
            <div
              className="flex gap-1.5 sm:gap-2 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 41}%)` }}
            >
              {heroProjects.map((project, idx) => {
                const isSelected = activeIndex === idx;
                const isPlayingThis = activePlayerProject?.id === project.id;
                const isHovered = hoveredCardId === project.id;
                const thumbUrl = resolveThumbnail(project.videoUrl, project.thumbnailUrl);

                return (
                  <div
                    key={project.id}
                    onClick={() => handlePlayCard(project, idx)}
                    onMouseEnter={() => setHoveredCardId(project.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePlayCard(project, idx);
                      }
                    }}
                    className={`relative shrink-0 w-36 sm:w-44 h-52 sm:h-60 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 border ${
                      isPlayingThis
                        ? 'border-[#D7FF64] ring-2 ring-[#D7FF64]/40 shadow-xl shadow-black/90 scale-[1.02]'
                        : isHovered
                        ? 'border-[#D7FF64] shadow-2xl shadow-black/90 scale-[1.02]'
                        : isSelected
                        ? 'border-[#D7FF64]/60 shadow-xl shadow-black/80 scale-[1.01]'
                        : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    {/* Fallback film frame background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900/80 to-zinc-950 flex items-center justify-center">
                      <div className="text-zinc-800 text-5xl font-mono font-bold select-none opacity-40">
                        0{idx + 1}
                      </div>
                    </div>

                    {/* Real Video Thumbnail Preview from updated Google Drive URL */}
                    {thumbUrl && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={thumbUrl}
                        alt={project.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                          isHovered ? 'opacity-20 scale-105' : 'opacity-65 group-hover:opacity-95'
                        }`}
                        loading="lazy"
                      />
                    )}

                    {/* Muted Autoplay Video Preview on Hover */}
                    <HeroCardVideo
                      previewUrl={project.previewVideoUrl}
                      isHovered={isHovered}
                      title={project.title}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 z-[3] pointer-events-none" />

                    {/* Top-left: Card number badge OR PREVIEW indicator on hover */}
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      {isHovered ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-[#D7FF64] text-black font-semibold shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                          PREVIEW
                        </span>
                      ) : (
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isPlayingThis
                              ? 'bg-[#D7FF64] text-black'
                              : 'bg-white/10 backdrop-blur-md border border-white/20 text-white group-hover:bg-[#D7FF64] group-hover:text-black group-hover:border-[#D7FF64]'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      )}
                    </div>

                    {/* Year pill at top-right */}
                    <div className="absolute top-3 right-3 z-10 pointer-events-none">
                      <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-zinc-400 border border-white/10">
                        {project.year}
                      </span>
                    </div>

                    {/* Center Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div
                        className={`w-10 sm:w-11 h-10 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                          isPlayingThis
                            ? 'bg-[#D7FF64] text-black scale-105 shadow-[#D7FF64]/40 ring-2 ring-[#D7FF64]'
                            : isHovered
                            ? 'bg-[#D7FF64] text-black scale-110 shadow-[#D7FF64]/50 ring-2 ring-[#D7FF64]'
                            : 'bg-black/60 backdrop-blur-md border border-white/25 text-white group-hover:bg-[#D7FF64] group-hover:text-black group-hover:border-[#D7FF64] group-hover:scale-110 shadow-black/80'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Title & Label */}
                    <div className="absolute bottom-0 inset-x-0 p-3.5 z-10 flex flex-col justify-end pointer-events-none">
                      <span className="text-[9px] font-mono tracking-widest text-[#D7FF64] uppercase mb-0.5 truncate">
                        {project.category}
                      </span>
                      <h4 className="text-xs sm:text-[13px] font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#D7FF64] transition-colors">
                        {project.title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Slider Navigation Controls */}
          <div className="flex items-center gap-3.5 mt-4 pt-1">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              type="button"
              className="w-9 h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40 flex items-center justify-center text-white transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D7FF64]"
              aria-label="Previous preview project"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              type="button"
              className="w-9 h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 hover:border-white/40 flex items-center justify-center text-white transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D7FF64]"
              aria-label="Next preview project"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Horizontal Track Slider / Progress Bar */}
            <div className="flex-1 h-[2px] bg-white/15 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#D7FF64] transition-all duration-500 rounded-full"
                style={{
                  width: `${((activeIndex + 1) / heroProjects.length) * 100}%`,
                }}
              />
            </div>

            {/* Counter */}
            <span className="text-[11px] font-mono text-zinc-400 tracking-wider">
              0{activeIndex + 1} / 0{heroProjects.length}
            </span>
          </div>
          </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm p-6 sm:p-8">
              <p className="text-xs font-mono uppercase tracking-widest text-[#D7FF64] mb-3">
                {SECTION_COPY.workTitle}
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed mb-5">
                {SECTION_COPY.workSubtitle}
              </p>
              <button
                type="button"
                onClick={() => scrollToSection('#work')}
                className="text-xs font-mono uppercase tracking-wider text-white hover:text-[#D7FF64] transition-colors"
              >
                View portfolio section &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-10 w-full flex items-center justify-between pt-3 border-t border-white/5 text-[10px] font-mono text-zinc-500 tracking-wider">
        <div className="flex items-center gap-2">
          <span>PORTFOLIO &bull; {SITE_CONFIG.ownerName}</span>
        </div>
        <div className="hidden sm:block">
          <span>{SITE_CONFIG.brandName}</span>
        </div>
      </div>
    </section>
  );
}
