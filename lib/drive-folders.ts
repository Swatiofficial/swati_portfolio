import 'server-only';

export interface DriveFolder {
  id: string;
  label: string;
  folderId: string;
  url: string;
}

export interface DriveVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  embedPath: string;
}

export const DRIVE_FOLDERS: DriveFolder[] = [
  {
    id: 'instagram',
    label: 'Insta Videos',
    folderId: '18fbXvp8t6I-mATjlOhgnD7dDcshUgQbP',
    url: 'https://drive.google.com/drive/folders/18fbXvp8t6I-mATjlOhgnD7dDcshUgQbP?usp=drive_link',
  },
  {
    id: 'treading',
    label: 'Treading Videos',
    folderId: '1p6oMBB0fCMGvXKh5P9hviaajs9xe72YL',
    url: 'https://drive.google.com/drive/folders/1p6oMBB0fCMGvXKh5P9hviaajs9xe72YL?usp=drive_link',
  },
  {
    id: 'youtube',
    label: 'YT Videos',
    folderId: '1h6CSk7nmhbj-BDeeC6O1ti-mpfV2o7TJ',
    url: 'https://drive.google.com/drive/folders/1h6CSk7nmhbj-BDeeC6O1ti-mpfV2o7TJ?usp=drive_link',
  },
];

function decodeHtmlEntities(value: string) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, code: string) => {
    if (code[0] === '#') {
      const isHex = code[1]?.toLowerCase() === 'x';
      const point = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    }

    const namedEntities: Record<string, string> = {
      amp: '&',
      quot: '"',
      apos: "'",
      lt: '<',
      gt: '>',
      nbsp: ' ',
    };
    return namedEntities[code.toLowerCase()] ?? entity;
  });
}

export async function getDriveVideos(folderId: string): Promise<DriveVideo[]> {
  const folder = DRIVE_FOLDERS.find((item) => item.id === folderId);
  if (!folder) {
    throw new Error('Video folder not found.');
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
    const thumbnailMatch = entry.match(/<img src="([^"]+)" alt="Video"/);
    const isVideo = /drive-thirdparty\.googleusercontent\.com\/16\/type\/video\//.test(entry);
    const title = titleMatch ? decodeHtmlEntities(titleMatch[1].replace(/<[^>]*>/g, '')).trim() : '';

    if (!isVideo || !title || !/^[\w-]{10,}$/.test(id)) {
      return null;
    }

    const thumbnailUrl = thumbnailMatch ? decodeHtmlEntities(thumbnailMatch[1]) : '';
    if (thumbnailUrl && new URL(thumbnailUrl).hostname !== 'lh3.googleusercontent.com') {
      throw new Error(`Unexpected video thumbnail host in folder "${folder.label}".`);
    }

    return {
      id,
      title,
      thumbnailUrl,
      embedPath: `/api/drive/video?id=${encodeURIComponent(id)}`,
    };
  }).filter((video): video is DriveVideo => video !== null);
}
