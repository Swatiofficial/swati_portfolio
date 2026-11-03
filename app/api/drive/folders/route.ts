import { DRIVE_FOLDERS, getDriveVideos } from '@/lib/drive-folders';

export async function GET() {
  try {
    const folders = await Promise.all(
      DRIVE_FOLDERS.map(async ({ id, label }) => ({
        id,
        label,
        videos: await getDriveVideos(id),
      }))
    );
    return Response.json(folders);
  } catch (error) {
    console.error('Unable to load public Google Drive videos:', error);
    return Response.json({ error: 'Video gallery could not be loaded.' }, { status: 502 });
  }
}
