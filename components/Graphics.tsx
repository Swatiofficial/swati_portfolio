'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Image as ImageIcon, Palette } from 'lucide-react';
import { GRAPHIC_COLLECTIONS } from '@/data/graphics';

interface GraphicImage {
  id: string;
  title: string;
  thumbnailUrl: string;
  fileUrl: string;
}

interface GraphicsCollectionData {
  id: string;
  images: GraphicImage[];
}

function isGraphicImage(value: unknown): value is GraphicImage {
  if (!value || typeof value !== 'object') return false;
  const image = value as Record<string, unknown>;
  return (
    typeof image.id === 'string' &&
    typeof image.title === 'string' &&
    typeof image.thumbnailUrl === 'string' &&
    typeof image.fileUrl === 'string'
  );
}

function isGraphicsCollection(value: unknown): value is GraphicsCollectionData {
  if (!value || typeof value !== 'object') return false;
  const collection = value as Record<string, unknown>;
  return (
    typeof collection.id === 'string' &&
    Array.isArray(collection.images) &&
    collection.images.every(isGraphicImage)
  );
}

export function Graphics() {
  const [selectedCollection, setSelectedCollection] = useState<
    (typeof GRAPHIC_COLLECTIONS)[number]
  >(GRAPHIC_COLLECTIONS[0]);
  const [imagesByCollection, setImagesByCollection] = useState<Record<string, GraphicImage[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadGraphics = async () => {
      try {
        const response = await fetch('/api/drive/graphics');
        if (!response.ok) {
          throw new Error(`Failed to load graphics (${response.status}).`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data) || !data.every(isGraphicsCollection)) {
          throw new Error('The graphics response has an invalid format.');
        }

        if (isMounted) {
          setImagesByCollection(
            Object.fromEntries(data.map((collection) => [collection.id, collection.images]))
          );
        }
      } catch (error) {
        console.error('Unable to load portfolio graphics:', error);
        if (isMounted) {
          setLoadError('Graphics could not be loaded. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadGraphics();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedImages = imagesByCollection[selectedCollection.id] ?? [];

  return (
    <section
      id="graphics"
      className="relative overflow-x-clip py-20 sm:py-28 lg:py-36 px-4 sm:px-8 lg:px-14 bg-black border-t border-white/5"
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-[500px] w-full max-w-[800px] -translate-y-1/2 rounded-full bg-zinc-900/30 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 sm:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-[#D7FF64]" aria-hidden="true" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#D7FF64]">
                Graphics
              </span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
              Graphics
            </h2>
          </div>

          <p className="max-w-md text-xs font-light leading-relaxed text-zinc-400 sm:text-sm">
            A selection of creative work across social campaigns, advertising, and print.
          </p>
        </div>

        <div
          role="group"
          aria-label="Graphic design collections"
          className="mb-12 flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none"
        >
          {GRAPHIC_COLLECTIONS.map((collection) => {
            const isSelected = collection.id === selectedCollection.id;

            return (
              <button
                key={collection.id}
                type="button"
                onClick={() => setSelectedCollection(collection)}
                aria-pressed={isSelected}
                className={`min-h-11 shrink-0 rounded-full border px-4 py-2.5 text-xs font-mono tracking-wider transition-all duration-200 ${
                  isSelected
                    ? 'border-[#D7FF64] bg-[#D7FF64] font-bold text-black shadow-md shadow-[#D7FF64]/10'
                    : 'border-white/10 bg-zinc-950/80 text-zinc-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {collection.label}
              </button>
            );
          })}
        </div>

        <div className="glass-panel overflow-hidden rounded-2xl p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="truncate text-sm font-semibold text-white">
                {selectedCollection.label}
              </h3>
              <span className="shrink-0 text-xs font-mono text-zinc-500">
                {selectedImages.length} ITEMS
              </span>
            </div>
            <a
              href={selectedCollection.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-mono text-zinc-300 transition-colors hover:border-[#D7FF64]/50 hover:text-[#D7FF64] focus:outline-none focus:ring-2 focus:ring-[#D7FF64]"
            >
              Open folder
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          {isLoading ? (
            <div role="status" className="py-20 text-center text-sm text-zinc-400">
              Loading graphics...
            </div>
          ) : loadError ? (
            <div role="alert" className="rounded-xl border border-white/10 bg-black/30 px-6 py-10 text-center text-sm text-zinc-300">
              {loadError}
            </div>
          ) : selectedImages.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedImages.map((image, index) => (
                <a
                  key={image.id}
                  href={image.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-xl border border-white/10 bg-black/30 transition hover:border-[#D7FF64]/50 focus:outline-none focus:ring-2 focus:ring-[#D7FF64]"
                  aria-label={`Open ${image.title} in Google Drive`}
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-zinc-900">
                    {image.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={image.thumbnailUrl}
                        alt={image.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-zinc-600" aria-hidden="true" />
                    )}
                    <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-[10px] font-mono text-zinc-200 backdrop-blur">
                      GRAPHIC {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/70 p-2 text-zinc-300 opacity-0 backdrop-blur transition group-hover:opacity-100">
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                  <span className="block truncate px-4 py-3 text-sm font-medium text-zinc-200 transition group-hover:text-[#D7FF64]">
                    {image.title}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-zinc-400">
              No graphic files found in this collection.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
