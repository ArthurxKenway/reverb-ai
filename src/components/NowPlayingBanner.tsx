
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react';
import { type Song } from '../types';
import { formatTime } from '../utils/time';


interface NowPlayingBanner {
    currentSong: Song | null;
    isPlaying: boolean;
    isShuffle: boolean;
    isRepeat: boolean;
    progress: number;
    duration: number;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious:() => void;
    setIsShuffle: (val: boolean) => void;
    setIsRepeat: (val: boolean) => void;
    onSeek: (pos: number) => void;
}

export const NowPlayingBanner = ({  currentSong,
  isPlaying,
  isShuffle,
  isRepeat,
  progress,
  duration,
  togglePlay,
  playNext,
  playPrevious,
  setIsShuffle,
  setIsRepeat,
  onSeek
}: NowPlayingBanner) => {
  return (
    <div className='relative w-full h-[340px] bg-[var(--bg-banner)] text-[var(--text-banner)] overflow-hidden shadow-xl'>
        <img  src={currentSong?.coverUrl || ""}  alt="" className='absolute inset-0 w-full h-full object-cover opacity-50='/>
        
         <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-banner)] via-[var(--bg-banner)]/40 to-transparent"></div>
         
         <div className='relative h-full p-12 flex flex-col justify-between'>
           <div>
          <h2 className="text-[40px] mb-8 tracking-tight">Now Playing</h2>
          <div className="mb-2 text-base">{currentSong?.title || "No track selected"}</div>
          <div className="text-xs opacity-70">{currentSong?.artist || "---"}</div>
        </div>

            <div className="flex justify-between items-end">
          <div>
            <div className="text-xs opacity-70 mb-2">From</div>
            <div className="text-sm">{currentSong?.album || "---"}</div>
          </div>

                  <div className="flex items-center gap-6">
            <button onClick={() => setIsShuffle(!isShuffle)} className={`text-[var(--text-banner)] hover:text-[var(--accent)] transition-colors ${isShuffle ? 'text-[var(--accent)]' : 'opacity-50'}`}>
              <Shuffle size={20} />
            </button>
            <button onClick={playPrevious} className="text-[var(--text-banner)] hover:text-[var(--accent)] transition-colors">
              <SkipBack size={24} />
            </button>
            <button onClick={togglePlay} className="w-16 h-16 bg-[var(--text-banner)] rounded-full flex items-center justify-center text-[var(--bg-banner)] hover:scale-105 transition-transform">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
            </button>
            <button onClick={playNext} className="text-[var(--text-banner)] hover:text-[var(--accent)] transition-colors">
              <SkipForward size={24} />
            </button>
            <button onClick={() => setIsRepeat(!isRepeat)} className={`text-[var(--text-banner)] hover:text-[var(--accent)] transition-colors ${isRepeat ? 'text-[var(--accent)]' : 'opacity-50'}`}>
              <Repeat size={20} />
            </button>
          </div>
          
        </div>

            {/* PROGRESS BAR */}

        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[var(--text-banner)]/20 group cursor-pointer"
             onClick={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const pos = (e.clientX - rect.left) / rect.width;
               onSeek(pos);
             }}>
          <div 
            className="h-full bg-[var(--accent)] relative" 
            style={{ width: `${(progress / duration) * 100 || 0}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[var(--text-banner)] rounded-full opacity-0 group-hover:opacity-100 shadow-md transform translate-x-1/2"></div>
          </div>
        </div>
        <div className="absolute bottom-3 right-4 text-xs opacity-70 font-mono">
          {formatTime(progress)} / {formatTime(duration)}
        </div>

        </div>
    </div>
  )
}

export default NowPlayingBanner
