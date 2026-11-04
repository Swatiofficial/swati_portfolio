import { DRIVE_FOLDERS, getWebsiteDriveVideos } from '@/lib/drive-folders';

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return new Response('Video not found.', { status: 404 });
  }

  try {
    const folders = await Promise.all(
      DRIVE_FOLDERS.filter(({ websiteVideoTitles }) => websiteVideoTitles.length > 0).map(
        (folder) => getWebsiteDriveVideos(folder.id)
      )
    );
    const videoExists = folders.some((videos) => videos.some((video) => video.id === id));
    if (!videoExists) {
      return new Response('Video not found.', { status: 404 });
    }

    return Response.redirect(`https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`, 307);
  } catch (error) {
    console.error('Unable to resolve Google Drive video:', error);
    return new Response('Video preview is temporarily unavailable.', { status: 502 });
  }
}
