// Resolves the public URL for a portrait image.
//
// By default images are served from the bundled `/public/portraits` folder, so
// the app is self-contained for the demo. To serve them from a CDN / object
// store instead (recommended for production — see README), set
// NEXT_PUBLIC_IMAGE_BASE_URL to the base URL where the portraits live, e.g.
// `https://cdn.example.com/portraits`. No code change or redeploy of assets
// required beyond uploading the files and setting the env var.
const PORTRAIT_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '/portraits';

export const portraitSrc = (image: string): string =>
  `${PORTRAIT_BASE_URL}/${image}`;
