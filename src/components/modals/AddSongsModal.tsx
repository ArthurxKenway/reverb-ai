
import { X } from 'lucide-react';
import {type Song, type Space } from '../../types';

interface AddSongsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSpace: Space;
  songs: Song[];
  toggleSongInSpace: (spaceId: string, songId: string) => void;
}

export const AddSongsModal: React.FC<AddSongsModalProps> = ({
  isOpen,
  onClose,
  activeSpace,
  songs,
  toggleSongInSpace
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-[var(--bg-content)] text-[var(--text-content)] w-full max-w-2xl p-12 shadow-2xl relative max-h-[80vh] flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-[var(--text-content)] hover:opacity-70"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-4xl mb-8 tracking-tight">Add Songs to {activeSpace.name}</h2>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 flex flex-col gap-4">
          {songs.map(song => {
            const isInSpace = activeSpace.songIds.includes(song.id);
            return (
              <div key={song.id} className="flex justify-between items-center p-3 hover:bg-[var(--border-color)] rounded">
                <div className="truncate pr-4">
                  <div className="text-base truncate">{song.title}</div>
                  <div className="text-xs opacity-50 truncate">{song.artist}</div>
                </div>
                <button
                  onClick={() => toggleSongInSpace(activeSpace.id, song.id)}
                  className={`px-4 py-2 text-xs tracking-widest ${isInSpace ? 'bg-[var(--text-content)] text-[var(--bg-content)]' : 'border border-[var(--border-color)] text-[var(--text-content)] hover:bg-[var(--border-color)]'}`}
                >
                  {isInSpace ? 'ADDED' : 'ADD'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
