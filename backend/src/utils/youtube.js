export function extractYoutubeId(input) {
  if (!input) return null;

  // iframe
  const iframeMatch = input.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (iframeMatch) return iframeMatch[1];

  // watch?v=
  const watchMatch = input.match(/v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return watchMatch[1];

  // youtu.be
  const shortMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];

  return null;
}
