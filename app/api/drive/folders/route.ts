import { DRIVE_FOLDERS, getWebsiteDriveVideos } from '@/lib/drive-folders';

export async function GET() {
  try {
    const folders = await Promise.all(
      DRIVE_FOLDERS.filter(({ websiteVideoTitles }) => websiteVideoTitles.length > 0).map(
        async ({ id, label }) => ({
          id,
          label,
          videos: await getWebsiteDriveVideos(id),
        })
      )
    );
    return Response.json(folders);
  } catch (error) {
    console.error('Unable to load public Google Drive videos:', error);
    return Response.json({ error: 'Video gallery could not be loaded.' }, { status: 502 });
  }
}
