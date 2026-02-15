export interface Playlist {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  videoCount?: number;
}
export interface Video {
  _id: string;
  title: string;
  youtubeId: string;
  description: string;
  category: string;
  duration?: string;
  notesUrl?: string;
  codeUrl?: string;
}
