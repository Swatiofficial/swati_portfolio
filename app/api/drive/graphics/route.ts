import { GRAPHIC_COLLECTIONS } from '@/data/graphics';
import { getDriveGraphics } from '@/lib/drive-graphics';

export async function GET() {
  try {
    const collections = await Promise.all(
      GRAPHIC_COLLECTIONS.map(async ({ id, label, folderId }) => ({
        id,
        label,
        images: await getDriveGraphics(folderId),
      }))
    );
    return Response.json(collections);
  } catch (error) {
    console.error('Unable to load public Google Drive graphics:', error);
    return Response.json({ error: 'Graphics could not be loaded.' }, { status: 502 });
  }
}
