# Swati Kumari — Creative Portfolio

A Next.js portfolio for showcasing graphic design, video editing, digital content, and professional experience. The portfolio content is centralized in [`data/portfolio.json`](./data/portfolio.json), while the React components define the presentation and interactions.

## Updating the portfolio for another person

Edit `data/portfolio.json` and replace the `site` and `resume` values with the person's information. The JSON currently includes:

- Profile details, role, summary, email, phone, and social links
- Resume expertise, experience, education, and achievements
- Services/capabilities and design/video tools
- Project categories and project entries
- Showreel settings and section copy

The JSON is imported by the app at build time; it does not make a separate browser request. Changes appear in development immediately and require a new production build/deployment after publishing.

## Adding a project

Only add real work and working URLs. Put project media in `public/` or use a public Google Drive, YouTube, or direct MP4/WebM URL. Add categories under `categories` and project objects under `projects`, for example:

```json
{
  "id": "project-name",
  "title": "Project title",
  "category": "Graphic Design",
  "source": "youtube",
  "videoUrl": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  "description": "A short description of the work.",
  "year": "2025"
}
```

For Google Drive videos, set access to **Anyone with the link — Viewer**. To add a custom thumbnail, include `"thumbnailUrl": "/images/project-thumbnail.jpg"` and place the image in `public/images/`. The same project entries power the hero previews and selected-work grid.

To configure the showreel, set `showreel.videoUrl` in the JSON file. Supported sources are Google Drive, YouTube/Shorts, and direct MP4/WebM URLs.

## Contact form setup

The public contact email and phone number are configured in `site.contactEmail` and `site.contactPhone`. Contact form delivery requires a server-side provider configuration; do not put provider credentials in the JSON file.

Configure either:

- `RESEND_API_KEY` (and optionally `RESEND_FROM`), or
- SMTP credentials such as `SMTP_USER` and `SMTP_PASS`.

The optional `CONTACT_RECIPIENT_EMAIL` environment variable overrides the recipient email in the portfolio JSON.

## Running locally

```bash
npm run dev
npm test
npx tsx lib/__tests__/contact.test.ts
npm run lint
npm run build
```
