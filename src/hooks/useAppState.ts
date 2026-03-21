import { useState, useRef, useEffect } from 'react';
import { type Song, type Space } from '../types';
import { parseAudioFile } from '../utils/audio';
import { GoogleGenAI, Type } from '@google/genai';
import localforage from 'localforage';

type SongMeta = Omit<Song, 'url' | 'file'>;

const DEFAULT_SPACES: Space[] = [
  { id: 'default', name: 'Default', songIds: [], historyIds: [], theme: 'base', crossfade: false, highQuality: true },
  { id: '01', name: '01', songIds: [], historyIds: [], theme: 'base', crossfade: false, highQuality: true },
  { id: '02', name: '02', songIds: [], historyIds: [], theme: 'base', crossfade: false, highQuality: true },
];

export function useAppState() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [spaces, setSpaces] = useState<Space[]>(DEFAULT_SPACES);
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeSpaceId, setActiveSpaceId] = useState('default');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey') || '');

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isEditingSpace, setIsEditingSpace] = useState(false);
  const [editingSpaceName, setEditingSpaceName] = useState('');
  const [addSongsModalOpen, setAddSongsModalOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dirInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadFromDB = async () => {
      try {
        const savedSpaces = await localforage.getItem<Space[]>('spaces');
        if (savedSpaces && savedSpaces.length > 0) {
          setSpaces(savedSpaces);
        }

        const savedMeta = await localforage.getItem<SongMeta[]>('my_songs');
        if (savedMeta && savedMeta.length > 0) {
          const loadedSongs = await Promise.all(
            savedMeta.map(async (meta) => {
              const blob = await localforage.getItem<Blob>(`song_blob_${meta.id}`);
              const url = blob ? URL.createObjectURL(blob) : '';
              return { ...meta, url };
            })
          );
          setSongs(loadedSongs.filter((s) => s.url !== ''));
        }
      } catch (err) {
        console.error('Failed to load from IndexedDB:', err);
      } finally {
        setIsLoaded(true);
      }
    };

    loadFromDB();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localforage.setItem('spaces', spaces).catch(console.error);
    }
  }, [spaces, isLoaded]);

  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  const activeSpace = spaces.find((s) => s.id === activeSpaceId) || spaces[0];
  const theme = activeSpace.theme || 'base';
  const crossfade = activeSpace.crossfade ?? false;
  const highQuality = activeSpace.highQuality ?? true;

  const activeSongs = songs.filter((s: Song) => activeSpace.songIds.includes(s.id));
  const history = (activeSpace.historyIds || [])
    .map((id) => songs.find((s: Song) => s.id === id))
    .filter((s): s is Song => s !== undefined);

  const setTheme = (newTheme: string) => {
    setSpaces((prev) => prev.map((s) => (s.id === activeSpaceId ? { ...s, theme: newTheme } : s)));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setCrossfade = (val: boolean) => {
    setSpaces((prev) => prev.map((s) => (s.id === activeSpaceId ? { ...s, crossfade: val } : s)));
  };

  const setHighQuality = (val: boolean) => {
    setSpaces((prev) => prev.map((s) => (s.id === activeSpaceId ? { ...s, highQuality: val } : s)));
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch((e) => console.error('Playback error:', e));
      setIsPlaying(!isPlaying);
    }
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) => {
        if (space.id === activeSpaceId) {
          const newHistoryIds = [
            song.id,
            ...(space.historyIds || []).filter((id) => id !== song.id),
          ].slice(0, 10);
          return { ...space, historyIds: newHistoryIds };
        }
        return space;
      })
    );

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = song.url;
    audio.play().catch((e) => console.error('Playback failed:', e));
  };

  const deleteSong = (id: string) => {
    setSongs((prev) => {
      const newSongs = prev.filter((s) => s.id !== id);
      const metaOnly: SongMeta[] = newSongs.map(({ url, file, ...meta }) => meta);
      localforage.setItem('my_songs', metaOnly).catch(console.error);
      return newSongs;
    });

    localforage.removeItem(`song_blob_${id}`).catch(console.error);

    setSpaces((prev) =>
      prev.map((s) => ({
        ...s,
        songIds: s.songIds.filter((sid) => sid !== id),
        historyIds: (s.historyIds || []).filter((sid) => sid !== id),
      }))
    );

    if (currentSong?.id === id) {
      if (audioRef.current) audioRef.current.pause();
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    if (!currentSong || activeSongs.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * activeSongs.length);
    } else {
      const currentIndex = activeSongs.findIndex((s: Song) => s.id === currentSong.id);
      nextIndex = (currentIndex + 1) % activeSongs.length;
    }
    playSong(activeSongs[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentSong || activeSongs.length === 0) return;
    const currentIndex = activeSongs.findIndex((s: Song) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + activeSongs.length) % activeSongs.length;
    playSong(activeSongs[prevIndex]);
  };

  const createSpace = () => {
    const newSpace: Space = {
      id: crypto.randomUUID(),
      name: `Space ${spaces.length}`,
      songIds: [],
      historyIds: [],
      theme: 'base',
      crossfade: false,
      highQuality: true,
    };
    setSpaces([...spaces, newSpace]);
    setActiveSpaceId(newSpace.id);
    setEditingSpaceName(newSpace.name);
    setIsEditingSpace(true);
  };

  const deleteSpace = (id: string) => {
    if (id === 'default') return;
    setSpaces(spaces.filter((s) => s.id !== id));
    if (activeSpaceId === id) setActiveSpaceId('default');
  };

  const renameSpace = (id: string, newName: string) => {
    if (id === 'default' || !newName.trim()) {
      setIsEditingSpace(false);
      return;
    }
    setSpaces(spaces.map((s) => (s.id === id ? { ...s, name: newName.trim() } : s)));
    setIsEditingSpace(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const audioFiles = files.filter(
      (f) => f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)
    );

    if (audioFiles.length === 0) return;

    const parsedSongs = await Promise.all(
      audioFiles.map(async (file) => {
        const metadata = await parseAudioFile(file);
        await localforage.setItem(`song_blob_${metadata.id}`, file);
        return metadata;
      })
    );

    setSongs((prev: Song[]) => {
      const newSongs = [...prev, ...parsedSongs];

      const metaOnly: SongMeta[] = newSongs.map(({ url, file, ...meta }) => meta);
      localforage.setItem('my_songs', metaOnly).catch(console.error);

      setSpaces((sp) =>
        sp.map((space) => {
          if (space.id === 'default') {
            return { ...space, songIds: newSongs.map((s) => s.id) };
          }
          return space;
        })
      );

      return newSongs;
    });
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt || songs.length === 0) return;
    setIsAiLoading(true);
    try {
      if (!apiKey) {
        alert('Please provide a Gemini API Key in Settings.');
        setIsAiLoading(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const library = songs.map((s: Song) => ({ id: s.id, title: s.title, artist: s.artist }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: `You are an AI music curator named ReverbAI. The user wants a music space (playlist) for the following mood/request: "${aiPrompt}".
        Here is their library of available songs:
        ${JSON.stringify(library)}
        
        Select a subset of these songs that best fit the request.
        Return a JSON object with exactly two properties:
        - spaceName: A short, cool name for this space (max 2 words, e.g., "Indie Chill", "Focus").
        - songIds: An array of the selected song IDs.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              spaceName: { type: Type.STRING },
              songIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['spaceName', 'songIds'],
          },
        },
      });

      const data = JSON.parse(response.text || '{}');
      const newSpace: Space = {
        id: crypto.randomUUID(),
        name: data.spaceName,
        songIds: data.songIds,
        historyIds: [],
        theme: 'base',
        crossfade: false,
        highQuality: true,
      };

      setSpaces((prev) => [...prev, newSpace]);
      setActiveSpaceId(newSpace.id);
      setAiModalOpen(false);
      setAiPrompt('');
    } catch (error) {
      console.error('AI Error:', error);
      alert('Failed to generate space.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return {
    songs, setSongs,
    spaces, setSpaces,
    activeSpaceId, setActiveSpaceId,
    currentSong, setCurrentSong,
    isPlaying, setIsPlaying,
    history,
    aiModalOpen, setAiModalOpen,
    aiPrompt, setAiPrompt,
    isAiLoading, setIsAiLoading,
    isShuffle, setIsShuffle,
    isRepeat, setIsRepeat,
    progress, setProgress,
    duration, setDuration,
    isEditingSpace, setIsEditingSpace,
    editingSpaceName, setEditingSpaceName,
    addSongsModalOpen, setAddSongsModalOpen,
    settingsOpen, setSettingsOpen,
    theme, setTheme,
    apiKey, setApiKey,
    crossfade, setCrossfade,
    highQuality, setHighQuality,
    audioRef, fileInputRef, dirInputRef,
    activeSpace, activeSongs,
    togglePlay, playSong, playNext, playPrevious,
    createSpace, deleteSpace, renameSpace,
    handleFileUpload, handleAiGenerate,
    deleteSong,
  };
}
