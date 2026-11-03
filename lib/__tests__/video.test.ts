import assert from 'node:assert';
import {
  extractGoogleDriveId,
  isGoogleDriveUrl,
  buildGoogleDrivePreviewUrl,
  buildGoogleDriveThumbnailUrl,
  parseYouTubeUrl,
  isYouTubeUrl,
  buildYouTubeEmbedUrl,
  buildYouTubeThumbnailUrl,
  isMp4Url,
  parseVideoSource,
} from '../video';

console.log('--- RUNNING VIDEO UTILITY UNIT TESTS ---');

// 1. Google Drive Tests
{
  const driveSharingUrl = 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P/view?usp=sharing';
  const id = extractGoogleDriveId(driveSharingUrl);
  assert.strictEqual(id, '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P', 'Drive ID extracted from standard sharing URL');
  assert.strictEqual(isGoogleDriveUrl(driveSharingUrl), true);
  assert.strictEqual(
    buildGoogleDrivePreviewUrl(id!),
    'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P/preview'
  );
  assert.strictEqual(
    buildGoogleDriveThumbnailUrl(id!),
    'https://drive.google.com/thumbnail?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P&sz=w1280'
  );

  // Variant: ?id=
  const openUrl = 'https://drive.google.com/open?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P';
  assert.strictEqual(extractGoogleDriveId(openUrl), '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P');

  // Variant: /uc?id=
  const ucUrl = 'https://drive.google.com/uc?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P';
  assert.strictEqual(extractGoogleDriveId(ucUrl), '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P');

  // Invalid Drive URL
  assert.strictEqual(extractGoogleDriveId('https://drive.google.com/drive/folders/short'), null);
  console.log('✓ Google Drive URL parsing passed');
}

// 2. YouTube & Shorts Tests
{
  const ytWatch = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const ytParsed1 = parseYouTubeUrl(ytWatch);
  assert.deepStrictEqual(ytParsed1, { id: 'dQw4w9WgXcQ', isShort: false });
  assert.strictEqual(isYouTubeUrl(ytWatch), true);
  assert.strictEqual(
    buildYouTubeEmbedUrl('dQw4w9WgXcQ'),
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1'
  );
  assert.strictEqual(
    buildYouTubeThumbnailUrl('dQw4w9WgXcQ'),
    'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
  );

  // youtu.be
  const ytShortUrl = 'https://youtu.be/dQw4w9WgXcQ';
  assert.deepStrictEqual(parseYouTubeUrl(ytShortUrl), { id: 'dQw4w9WgXcQ', isShort: false });

  // YouTube Shorts (9:16)
  const ytShorts = 'https://www.youtube.com/shorts/3jz_K9mP_2A';
  const shortsParsed = parseYouTubeUrl(ytShorts);
  assert.deepStrictEqual(shortsParsed, { id: '3jz_K9mP_2A', isShort: true });

  const parsedShortSource = parseVideoSource(ytShorts);
  assert.strictEqual(parsedShortSource.isValid, true);
  assert.strictEqual(parsedShortSource.aspectRatio, '9:16');
  console.log('✓ YouTube standard & Shorts URL parsing passed');
}

// 3. Direct MP4 Tests
{
  const mp4Url = 'https://assets.example.com/videos/showreel-2026.mp4';
  assert.strictEqual(isMp4Url(mp4Url), true);
  const parsedMp4 = parseVideoSource(mp4Url);
  assert.strictEqual(parsedMp4.isValid, true);
  assert.strictEqual(parsedMp4.type, 'mp4');
  console.log('✓ MP4 URL parsing passed');
}

// 4. Empty and Edge Case URL Tests
{
  const emptyRes = parseVideoSource('');
  assert.strictEqual(emptyRes.isValid, false);
  assert.strictEqual(emptyRes.type, 'unknown');

  const nullRes = parseVideoSource(null);
  assert.strictEqual(nullRes.isValid, false);

  const invalidUrlRes = parseVideoSource('https://vimeo.com/123456');
  assert.strictEqual(invalidUrlRes.isValid, false);

  const whitespaceRes = parseVideoSource('   ');
  assert.strictEqual(whitespaceRes.isValid, false);
  console.log('✓ Empty and edge case validations passed');
}

console.log('🎉 ALL VIDEO TESTS PASSED SUCCESSFULLY!');
