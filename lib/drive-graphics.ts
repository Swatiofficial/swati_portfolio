import 'server-only';

import { GRAPHIC_COLLECTIONS } from '@/data/graphics';

export interface DriveGraphic {
  id: string;
  title: string;
  thumbnailUrl: string;
  fileUrl: string;
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export async function getDriveGraphics(folderId: string): Promise<DriveGraphic[]> {
  const folder = GRAPHIC_COLLECTIONS.find((item) => item.folderId === folderId);
  if (!folder) {
    throw new Error('Graphics folder not found.');
  }

  const response = await fetch(
    `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(folder.folderId)}`,
    { next: { revalidate: 3600 } }
  );
  if (!response.ok) {
    throw new Error(`Google Drive returned ${response.status} for folder "${folder.label}".`);
  }

  const html = await response.text();
  const entries = html.matchAll(
    /<div class="flip-entry" id="entry-([^"]+)"[^>]*>([\s\S]*?)(?=<div class="flip-entry"|<\/body>)/g
  );

  return Array.from(entries, ([, id, entry]) => {
    const titleMatch = entry.match(/<div class="flip-entry-title">([\s\S]*?)<\/div>/);
    const thumbnailMatch = entry.match(/<img src="([^"]+)" alt="([^"]*)"/);
    const title = titleMatch
      ? decodeHtmlEntities(titleMatch[1].replace(/<[^>]*>/g, '')).trim()
      : '';
    const thumbnailUrl = thumbnailMatch ? decodeHtmlEntities(thumbnailMatch[1]) : '';
    const fileType = thumbnailMatch ? decodeHtmlEntities(thumbnailMatch[2]) : '';

    if (!/^[\w-]{10,}$/.test(id) || !title || !/image|pdf/i.test(fileType)) {
      return null;
    }

    let highResolutionThumbnail = '';
    if (thumbnailUrl.startsWith('https://lh3.googleusercontent.com/')) {
      highResolutionThumbnail = thumbnailUrl.replace(/=s\d+$/, '=w1200');
    }

    return {
      id,
      title,
      thumbnailUrl: highResolutionThumbnail,
      fileUrl: `https://drive.google.com/file/d/${encodeURIComponent(id)}/view`,
    };
  }).filter((graphic): graphic is DriveGraphic => graphic !== null);
}
