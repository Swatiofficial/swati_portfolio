'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { Project } from '@/data/projects';
import { parseVideoSource } from '@/lib/video';

interface VideoModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ project, isOpen, onClose }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Save previous focus & restore on close; lock body scroll
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Focus close button on mount
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key and focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Simple focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const parsed = parseVideoSource(project.videoUrl);
  const isShort = parsed.isShort || false;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${
          isShort ? 'max-w-md' : 'max-w-5xl'
        } bg-[#0d0d0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 max-h-[95vh]`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/40">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-[#D7FF64]/10 text-[#D7FF64] border border-[#D7FF64]/20">
                {project.category}
              </span>
              <span className="text-xs text-[#888888] font-mono">&bull; {project.year}</span>
              {project.client && (
                <span className="text-xs text-[#888888]">&bull; {project.client}</span>
              )}
            </div>
            <h2 id="video-modal-title" className="text-base sm:text-lg font-bold text-white tracking-tight">
              {project.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            type="button"
            className="p-2 rounded-full text-[#888888] hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#D7FF64] transition-colors"
            aria-label="Close video dialog (Escape)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative bg-black flex items-center justify-center overflow-hidden">
          {/* Aspect Ratio Box */}
          <div
            className={`w-full relative ${
              isShort ? 'aspect-[9/16] max-h-[70vh]' : 'aspect-video'
            } bg-black flex items-center justify-center`}
          >
            {/* Loading Indicator */}
            {isLoading && !loadError && parsed.isValid && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm gap-2">
                <Loader2 className="w-8 h-8 text-[#D7FF64] animate-spin" />
                <span className="text-xs font-mono text-zinc-400">Loading stream...</span>
              </div>
            )}

            {/* Error or Unconfigured State */}
            {!parsed.isValid || loadError ? (
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
                <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">
                  Video Stream Not Configured Yet
                </h3>
                <p className="text-xs text-[#888888] mb-4">
                  {parsed.errorMessage ||
                    'Add your Google Drive, YouTube, or MP4 link to a project in data/portfolio.json.'}
                </p>
                {project.videoUrl && (
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D7FF64] hover:underline"
                  >
                    <span>Attempt Direct Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : parsed.type === 'drive' ? (
              /* Google Drive Embed */
              <div className="w-full h-full relative">
                <iframe
                  src={parsed.embedUrl}
                  title={project.title}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="w-full h-full border-0"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setLoadError(true);
                  }}
                />
              </div>
            ) : parsed.type === 'youtube' ? (
              /* YouTube Embed */
              <div className="w-full h-full relative">
                <iframe
                  src={parsed.embedUrl}
                  title={project.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    setLoadError(true);
                  }}
                />
              </div>
            ) : parsed.type === 'mp4' ? (
              /* Direct MP4 HTML5 Video */
              <video
                src={parsed.embedUrl}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
                onLoadedData={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setLoadError(true);
                }}
              >
                Your browser does not support HTML5 video playback.
              </video>
            ) : null}
          </div>
        </div>

        {/* Modal Footer & Information */}
        <div className="px-5 py-3.5 bg-black/60 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-[#888888] line-clamp-2 max-w-xl">
            {project.description}
          </p>

          <div className="flex items-center gap-3 shrink-0">
            {parsed.type === 'drive' && (
              <span className="text-[11px] text-amber-300/80 font-mono hidden md:inline">
                *Shared via Google Drive
              </span>
            )}
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#888888] hover:text-[#D7FF64] transition-colors font-mono text-[11px]"
              >
                <span>Open in new tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
