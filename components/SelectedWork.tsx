'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Project, CATEGORIES, PROJECTS, SECTION_COPY } from '@/data/projects';
import { Play, Film, Sparkles, FolderOpen } from 'lucide-react';
import { resolveThumbnail } from '@/lib/video';

interface SelectedWorkProps {
  onSelectProject: (project: Project) => void;
}

interface VideoFolder {
  id: string;
  label: string;
  videos: VideoItem[];
}

interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  embedPath: string;
}

function isVideoFolder(value: unknown): value is VideoFolder {
  if (!value || typeof value !== 'object') return false;
  const folder = value as Record<string, unknown>;
  return (
    typeof folder.id === 'string' &&
    typeof folder.label === 'string' &&
    Array.isArray(folder.videos) &&
    folder.videos.every(
      (video: unknown) =>
        Boolean(video) &&
        typeof video === 'object' &&
        typeof (video as Record<string, unknown>).id === 'string' &&
        typeof (video as Record<string, unknown>).title === 'string' &&
        typeof (video as Record<string, unknown>).thumbnailUrl === 'string' &&
        typeof (video as Record<string, unknown>).embedPath === 'string'
    )
  );
}

export function SelectedWork({ onSelectProject }: SelectedWorkProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Videos');
  const [videoFolders, setVideoFolders] = useState<VideoFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [folderLoadError, setFolderLoadError] = useState<string | null>(null);
  const selectedFolder = videoFolders.find((folder) => folder.id === selectedFolderId);

  // Filter projects based on active filter button
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All Videos') {
      return PROJECTS;
    }
    return PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (PROJECTS.length > 0) return;

    let isMounted = true;
    const loadFolders = async () => {
      try {
        const response = await fetch('/api/drive/folders');
        if (!response.ok) {
          throw new Error(`Failed to load video folders (${response.status}).`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('The video folder response has an invalid format.');
        }

        const folders = data.filter(isVideoFolder);
        if (folders.length !== data.length) {
          throw new Error('The video folder response has an invalid format.');
        }

        if (isMounted) {
          setVideoFolders(folders);
          setSelectedFolderId(folders[0]?.id ?? '');
        }
      } catch (error) {
        console.error('Unable to load portfolio video folders:', error);
        if (isMounted) {
          setFolderLoadError('Video folders could not be loaded. Please try again later.');
        }
      }
    };

    void loadFolders();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="work" className="relative overflow-x-clip py-20 sm:py-28 lg:py-36 px-4 sm:px-8 lg:px-14 bg-black border-t border-white/5">
      {/* Background radial accent */}
      <div className="absolute inset-x-0 top-1/2 mx-auto -translate-y-1/2 w-full max-w-[800px] h-[500px] bg-zinc-900/30 rounded-full blur-[180px] pointer-events-none" />

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
        {PROJECTS.length > 0 && (
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
        )}

        {/* Drive folders when no curated projects are configured */}
        {PROJECTS.length === 0 ? (
          videoFolders.length > 0 ? (
            <div className="space-y-5">
              <div role="group" aria-label="Video folders" className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {videoFolders.map((folder) => {
                  const isSelected = folder.id === selectedFolderId;
                  return (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setSelectedFolderId(folder.id)}
                      aria-pressed={isSelected}
                      className={`inline-flex min-h-11 shrink-0 items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
                        isSelected
                          ? 'border-[#D7FF64] bg-[#D7FF64] text-black font-bold'
                          : 'border-white/10 bg-zinc-950/80 text-zinc-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{folder.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedFolder && (
                <div className="glass-panel overflow-hidden rounded-2xl p-4 sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="truncate text-sm font-semibold text-white">{selectedFolder.label}</h3>
                    <span className="shrink-0 text-xs font-mono text-zinc-500">
                      {selectedFolder.videos.length} VIDEOS
                    </span>
                  </div>
                  {selectedFolder.videos.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {selectedFolder.videos.map((video, index) => (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() =>
                            onSelectProject({
                              id: video.id,
                              title: video.title.replace(/\.[^.]+$/, ''),
                              category: selectedFolder.label,
                              source: 'Google Drive',
                              videoUrl: '',
                              embedUrl: video.embedPath,
                              description: `Video from ${selectedFolder.label}.`,
                              year: 'Portfolio',
                            })
                          }
                          className="group overflow-hidden rounded-xl border border-white/10 bg-black/30 text-left transition hover:border-[#D7FF64]/50 focus:outline-none focus:ring-2 focus:ring-[#D7FF64]"
                        >
                          <div className="relative aspect-video overflow-hidden bg-zinc-900">
                            {video.thumbnailUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={video.thumbnailUrl}
                                alt=""
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black" />
                            )}
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-md transition group-hover:border-[#D7FF64] group-hover:bg-[#D7FF64] group-hover:text-black">
                                <Play className="ml-0.5 h-5 w-5 fill-current" />
                              </span>
                            </span>
                            <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[10px] font-mono text-zinc-200 backdrop-blur">
                              VIDEO {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <span className="block truncate px-4 py-3 text-sm font-medium text-zinc-200 transition group-hover:text-[#D7FF64]">
                            {video.title.replace(/\.[^.]+$/, '')}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="py-12 text-center text-sm text-zinc-400">No videos found in this collection.</p>
                  )}
                </div>
              )}
            </div>
          ) : folderLoadError ? (
            <div role="alert" className="glass-panel rounded-2xl px-6 py-10 text-center text-sm text-zinc-300">
              {folderLoadError}
            </div>
          ) : (
            <div role="status" className="py-20 text-center text-sm text-zinc-400">
              Loading video gallery...
            </div>
          )
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl p-8 bg-zinc-950/40">
            <FolderOpen className="w-12 h-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">{SECTION_COPY.workEmptyTitle}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
              {SECTION_COPY.workEmptyDescription}
            </p>
            <button
              onClick={() => setSelectedCategory('All Videos')}
              type="button"
              className="glass-button text-xs font-mono uppercase tracking-wider hover:bg-[#D7FF64] hover:text-black px-6 py-2.5 rounded-full transition-colors"
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
