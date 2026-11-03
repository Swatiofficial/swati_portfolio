'use client';

import React, { useState, useMemo } from 'react';
import { Project, CATEGORIES, PROJECTS, SECTION_COPY } from '@/data/projects';
import { Play, Film, Sparkles, FolderOpen } from 'lucide-react';
import { resolveThumbnail } from '@/lib/video';

interface SelectedWorkProps {
  onSelectProject: (project: Project) => void;
}

export function SelectedWork({ onSelectProject }: SelectedWorkProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Videos');

  // Filter projects based on active filter button
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All Videos') {
      return PROJECTS;
    }
    return PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="work" className="relative py-28 sm:py-36 px-4 sm:px-8 lg:px-14 bg-black border-t border-white/5">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-zinc-900/30 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-4 h-4 text-[#D7FF64]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#D7FF64]">
                {SECTION_COPY.workTitle}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
              {SECTION_COPY.workTitle}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md leading-relaxed">
            {SECTION_COPY.workSubtitle}
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('All Videos')}
            className={`shrink-0 text-xs font-mono tracking-wider px-4 py-2.5 rounded-full transition-all duration-200 border ${
              selectedCategory === 'All Videos'
                ? 'bg-[#D7FF64] text-black border-[#D7FF64] font-bold shadow-md shadow-[#D7FF64]/10'
                : 'bg-zinc-950/80 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            All Work ({PROJECTS.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = PROJECTS.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 text-xs font-mono tracking-wider px-4 py-2.5 rounded-full transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#D7FF64] text-black border-[#D7FF64] font-bold shadow-md shadow-[#D7FF64]/10'
                    : 'bg-zinc-950/80 text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Projects Grid / Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl p-8 bg-zinc-950/40">
            <FolderOpen className="w-12 h-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">{SECTION_COPY.workEmptyTitle}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
              {SECTION_COPY.workEmptyDescription}
            </p>
            <button
              onClick={() => setSelectedCategory('All Videos')}
              type="button"
              className="text-xs font-mono uppercase tracking-wider text-black bg-white hover:bg-[#D7FF64] px-6 py-2.5 rounded-full transition-colors"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project, idx) => {
              // Asymmetric sizing for visual rhythm
              const isLarge = idx === 0 || idx === 3;
              const thumbUrl = resolveThumbnail(project.videoUrl, project.thumbnailUrl);

              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectProject(project);
                    }
                  }}
                  className={`group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/70 hover:border-[#D7FF64]/50 transition-all duration-300 flex flex-col cursor-pointer ${
                    isLarge ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
                  }`}
                >
                  {/* Thumbnail / Video Preview Facade */}
                  <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
                    {/* Real thumbnail or simulated film frame background */}
                    {thumbUrl && project.videoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={thumbUrl}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-85"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-black group-hover:scale-105 transition-transform duration-700">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                      </div>
                    )}

                    {/* Subtle watermarked index */}
                    <div className="absolute top-4 left-4 z-10 text-xs font-mono text-zinc-500 tracking-widest">
                      REF &bull; 00{idx + 1}
                    </div>

                    {/* Source Provider Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10">
                        {project.source.toUpperCase()}
                      </span>
                    </div>

                    {/* Center Play Button Overlay */}
                    <div className="relative z-10 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#D7FF64] group-hover:text-black group-hover:border-[#D7FF64] group-hover:scale-110 transition-all duration-300 shadow-xl">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>

                    {/* Status note if empty URL */}
                    {!project.videoUrl && (
                      <div className="absolute bottom-3 inset-x-3 z-10 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-black/80 text-amber-300/90 px-2.5 py-1 rounded border border-amber-300/20 backdrop-blur-sm">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          Add media URL in portfolio JSON
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Metadata Details */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-black/40">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#D7FF64]">
                          {project.category}
                        </span>
                        <span className="text-xs font-mono text-zinc-500">
                          {project.year} {project.client ? `&bull; ${project.client}` : ''}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#D7FF64] transition-colors leading-snug mb-2">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                      <span>WATCH CUT</span>
                      <span className="group-hover:translate-x-1 group-hover:text-[#D7FF64] transition-all">&rarr;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
