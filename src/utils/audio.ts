// @ts-ignore
import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';
import { type Song } from '../types';

export const parseAudioFile = (file: File): Promise<Song> => {
  return new Promise((resolve) => {
    jsmediatags.read(file, {
      onSuccess: (tag: any) => {
        const tags = tag.tags;
        let coverUrl = "";
        if (tags.picture) {
          const data = tags.picture.data;
          const format = tags.picture.format;
          let base64String = "";
          for (let i = 0; i < data.length; i++) {
            base64String += String.fromCharCode(data[i]);
          }
          coverUrl = `data:${format};base64,${window.btoa(base64String)}`;
        }
        resolve({
          id: crypto.randomUUID(),
          file,
          title: tags.title || file.name.replace(/\.[^/.]+$/, ""),
          artist: tags.artist || "Unknown Artist",
          album: tags.album || "Unknown Album",
          coverUrl: coverUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop",
          url: URL.createObjectURL(file)
          // path is omitted here, which is fine now because it's optional
        });
      },
      onError: () => {
        resolve({
          id: crypto.randomUUID(),
          file,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Unknown Artist",
          album: "Unknown Album",
          coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop",
          url: URL.createObjectURL(file)
        });
      }
    });
  });
};