export function getYoutubeId(input?: string) {
  if (!input) return null;

  // iframe embed
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

export function getYoutubeThumbnail(embedUrl?: string) {
  const id = getYoutubeId(embedUrl);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
