export interface User {
    name: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  url: string; 
  file?: File; 
  path?: string;
}

export interface Space {
    id: string;
    name: string;
    songIds: string[];
    historyIds: string[];
    theme?: string;
    crossfade?: boolean;
    highQuality?: boolean;
}