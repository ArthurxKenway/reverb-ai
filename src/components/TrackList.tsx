import { Plus, X, Play, Pause, Trash2 } from 'lucide-react'; // Added Trash2
import { type Song, type Space } from '../types';

interface TrackListProps {
  activeSpace: Space;
  activeSongs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  setAddSongsModalOpen: (open: boolean) => void;
  removeSongFromSpace: (spaceId: string, songId: string) => void;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  deleteSong: (songId: string) => void; // Added this
}

export const TrackList: React.FC<TrackListProps> = ({
  activeSpace,
  activeSongs,
  currentSong,
  isPlaying,
  setAddSongsModalOpen,
  removeSongFromSpace,
  playSong,
  togglePlay,
  deleteSong // Added this
}) => {
  return (
    <div className="bg-[var(--bg-card)] text-[var(--text-card)] p-10 shadow-xl h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-3xl tracking-tight">Space: {activeSpace.name}</h2>
        {activeSpace.id !== 'default' && (
          <button 
            onClick={() => setAddSongsModalOpen(true)}
            className="text-sm opacity-70 hover:opacity-100 flex items-center gap-2"
          >
            <Plus size={16} /> Add Songs
          </button>
        )}
      </div>
      
      <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-4 custom-scrollbar">
        {activeSongs.length === 0 ? (
          <div className="opacity-70 text-sm">No songs in this space. Add some music!</div>
        ) : (
          activeSongs.map((track) => (
            <div key={track.id} className="flex justify-between items-center group">
              <div className="truncate pr-4">
                <div className="text-base mb-1 truncate">{track.title}</div>
                <div className="text-[11px] opacity-70 truncate">{track.artist}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {/* Global Delete Button - Visible on Hover */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm('Permanently delete this song from library?')) {
                      deleteSong(track.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-60 hover:opacity-100 hover:text-red-500 transition-all p-1"
                  title="Delete from Library"
                >
                  <Trash2 size={14} />
                </button>

                {activeSpace.id !== 'default' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSongFromSpace(activeSpace.id, track.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-[var(--accent)] transition-opacity"
                    title="Remove from Space"
                  >
                    <X size={16} />
                  </button>
                )}
                
                <button 
                  onClick={() => currentSong?.id === track.id ? togglePlay() : playSong(track)}
                  className="w-12 h-12 bg-[var(--text-card)] rounded-full flex items-center justify-center text-[var(--bg-card)] opacity-90 hover:opacity-100 transition-opacity"
                >
                  {currentSong?.id === track.id && isPlaying ? (
                    <Pause size={20} fill="currentColor" />
                  ) : (
                    <Play size={20} className="ml-1" fill="currentColor" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};