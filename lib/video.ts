/**
 * Video URL utilities for the portfolio
 * Robust parsing, validation, embedding and thumbnail extraction for:
 * - Google Drive (Public 'Anyone with the link' videos)
 * - YouTube (Standard videos & YouTube Shorts)
 * - Direct MP4 / WebM
 */

export type VideoSourceType = 'drive' | 'youtube' | 'mp4' | 'unknown';

export interface ParsedVideoInfo {
  isValid: boolean;
  type: VideoSourceType;
  id?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  isShort?: boolean;
  aspectRatio: '16:9' | '9:16';
  errorMessage?: string;
}

/**
 * Validates and extracts Google Drive file ID.
 * Supports:
 * - https://drive.google.com/file/d/{FILE_ID}/view...
 * - https://drive.google.com/open?id={FILE_ID}
 * - https://drive.google.com/uc?id={FILE_ID}
 * - https://drive.google.com/file/d/{FILE_ID}/preview
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/{ID}
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: ?id={ID} or &id={ID}
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  return null;
}

export function isGoogleDriveUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com') && extractGoogleDriveId(url) !== null;
}

export function buildGoogleDrivePreviewUrl(id: string): string {
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function buildGoogleDriveThumbnailUrl(id: string): string {
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1280`;
}

/**
 * YouTube parsing supporting:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export interface YouTubeParsedData {
  id: string;
  isShort: boolean;
}

export function parseYouTubeUrl(url: string): YouTubeParsedData | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // 1. Shorts: /shorts/{11-char-id}
  const shortsMatch = trimmed.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return { id: shortsMatch[1], isShort: true };
  }

  // 2. Standard watch: ?v={11-char-id}
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return { id: watchMatch[1], isShort: false };
  }

  // 3. Short URL: youtu.be/{11-char-id}
  const youtuBeMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return { id: youtuBeMatch[1], isShort: false };
  }

  // 4. Embed: /embed/{11-char-id}
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) {
    return { id: embedMatch[1], isShort: false };
  }

  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return parseYouTubeUrl(url) !== null;
}

export function buildYouTubeEmbedUrl(id: string, autoplay: boolean = true): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function buildYouTubeThumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Direct MP4 validation
 */
export function isMp4Url(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.includes('.mp4?') ||
    clean.includes('.webm?')
  );
}

/**
 * Universal video parser
 */
export function parseVideoSource(url?: string | null): ParsedVideoInfo {
  if (!url || url.trim() === '') {
    return {
      isValid: false,
      type: 'unknown',
      aspectRatio: '16:9',
      errorMessage: 'No video link configured yet.',
    };
  }

  const trimmed = url.trim();

  // Check YouTube first
  const ytData = parseYouTubeUrl(trimmed);
  if (ytData) {
    return {
      isValid: true,
      type: 'youtube',
      id: ytData.id,
      embedUrl: buildYouTubeEmbedUrl(ytData.id),
      thumbnailUrl: buildYouTubeThumbnailUrl(ytData.id),
      isShort: ytData.isShort,
      aspectRatio: ytData.isShort ? '9:16' : '16:9',
    };
  }

  // Check Google Drive
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    return {
      isValid: true,
      type: 'drive',
      id: driveId,
      embedUrl: buildGoogleDrivePreviewUrl(driveId),
      thumbnailUrl: buildGoogleDriveThumbnailUrl(driveId),
      isShort: false,
      aspectRatio: '16:9',
    };
  }

  // Check Direct MP4
  if (isMp4Url(trimmed)) {
    return {
      isValid: true,
      type: 'mp4',
      embedUrl: trimmed,
      isShort: false,
      aspectRatio: '16:9',
    };
  }

  // Inconclusive / invalid format
  return {
    isValid: false,
    type: 'unknown',
    aspectRatio: '16:9',
    errorMessage: 'Unrecognized video URL format. Please provide a valid YouTube, Google Drive, or MP4 link.',
  };
}

/**
 * Resolves the display thumbnail for a project
 */
export function resolveThumbnail(
  videoUrl?: string | null,
  customThumbnail?: string | null,
  fallbackPlaceholder: string = '/thumbnails/placeholder-cinema.jpg'
): string {
  if (customThumbnail && customThumbnail.trim() !== '') {
    return customThumbnail.trim();
  }

  if (videoUrl && videoUrl.trim() !== '') {
    const parsed = parseVideoSource(videoUrl);
    if (parsed.isValid && parsed.thumbnailUrl) {
      return parsed.thumbnailUrl;
    }
  }

  return fallbackPlaceholder;
}
