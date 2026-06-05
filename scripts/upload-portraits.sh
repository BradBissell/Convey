#!/usr/bin/env bash
#
# Upload public/portraits to S3-compatible object storage (AWS S3, Cloudflare R2,
# etc.) so the ~232MB of images can be served from a CDN instead of the repo.
#
# This is OPTIONAL. By default the app serves images from /public/portraits and
# works with no external dependency. Run this only if you want to move the
# images off-repo (see "Image hosting" in the README).
#
# Usage:
#   BUCKET=my-bucket [ENDPOINT=https://<acct>.r2.cloudflarestorage.com] \
#     ./scripts/upload-portraits.sh
#
# After uploading:
#   1. Make the bucket/objects publicly readable (or front them with a CDN:
#      CloudFront for S3, the public r2.dev domain or a custom domain for R2).
#   2. Set NEXT_PUBLIC_IMAGE_BASE_URL=<public-base-url>/portraits in your Vercel
#      project (and .env.local for local testing), then redeploy.
#   3. Verify images load from the CDN, then remove public/portraits from git:
#        git rm -r --cached public/portraits && echo "public/portraits/" >> .gitignore
#
# Requires the AWS CLI (works against R2 via --endpoint-url).
set -euo pipefail

: "${BUCKET:?Set BUCKET to the destination bucket name}"
SRC="$(cd "$(dirname "$0")/.." && pwd)/public/portraits"
ENDPOINT_ARG=()
[ -n "${ENDPOINT:-}" ] && ENDPOINT_ARG=(--endpoint-url "$ENDPOINT")

echo "Uploading $SRC -> s3://$BUCKET/portraits ${ENDPOINT:+(endpoint: $ENDPOINT)}"
aws s3 sync "$SRC" "s3://$BUCKET/portraits" \
  "${ENDPOINT_ARG[@]}" \
  --content-type image/jpeg \
  --cache-control "public, max-age=31536000, immutable" \
  --no-progress

echo "Done. Now set NEXT_PUBLIC_IMAGE_BASE_URL to your CDN base, e.g.:"
echo "  https://<cdn-domain>/portraits"
