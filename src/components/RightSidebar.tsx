
import { Play, Pause, X } from 'lucide-react';
import { type Song } from '../types';

interface RightSidebarProps {
  history: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  togglePlay: () => void;
  playSong: (song: Song) => void;
}



export const RightSidebar: React.FC<RightSidebarProps> = ({
  history,
  currentSong,
  isPlaying,
  togglePlay,
  playSong
}) => {
  return (
    <aside className="w-[360px] bg-[var(--bg-sidebar)] text-[var(--text-sidebar)] flex flex-col p-12 shrink-0 z-10 overflow-y-auto custom-scrollbar">
      <div className="text-xl tracking-widest mb-16 text-center">
        Arthur Kenway
      </div>

      <div className="mb-16">
        <h3 className="text-lg mb-8 tracking-widest">Recently Listened</h3>
        <div className="flex flex-col gap-6">
          {history.length === 0 ? (
            <div className="opacity-50 text-xs">No history yet.</div>
          ) : (
            history.map((track, i) => (
              <div key={`${track.id}-${i}`} className="flex justify-between items-center group">
                <div className="truncate pr-4">
                  <div className="text-[15px] mb-1 truncate">{track.title}</div>
                  <div className="text-[10px] opacity-70 truncate">{track.artist}</div>
                </div>
                <button 
                  onClick={() => currentSong?.id === track.id ? togglePlay() : playSong(track)}
                  className="w-9 h-9 bg-[var(--text-sidebar)] rounded-full flex items-center justify-center text-[var(--bg-sidebar)] opacity-90 hover:opacity-100 transition-opacity shrink-0"
                >
                  {currentSong?.id === track.id && isPlaying ? (
                    <Pause size={16} fill="currentColor" />
                  ) : (
                    <Play size={16} className="ml-0.5" fill="currentColor" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mb-auto">
        <h3 className="text-lg mb-8 tracking-widest">Recent Albums</h3>
        <div className="grid grid-cols-2 gap-4">
          {history.slice(0, 4).map((song, i) => (
            <img key={i} src={song.coverUrl} alt="Album" className={`w-full aspect-square object-cover ${i === 1 ? 'rounded-full' : ''} ${i === 2 ? 'grayscale' : ''}`} />
          ))}
          {/* Fillers if history < 4 */}
          {Array.from({ length: Math.max(0, 4 - history.length) }).map((_, i) => (
            <div key={`filler-${i}`} className="w-full aspect-square bg-[var(--border-light)]" />
          ))}
        </div>
      </div>

      <button className="mt-12 w-full bg-[var(--text-sidebar)] hover:opacity-80 text-[var(--bg-sidebar)] py-4 px-6 rounded-full flex items-center justify-center gap-4 transition-colors" id='exitBtn'  onClick={() => {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.send('quit-app');
  }}>
        <X size={18} />
        <span className="tracking-widest">Exit</span>
      </button>
    </aside>
  );
};
