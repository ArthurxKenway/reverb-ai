
import { X, Loader2 } from 'lucide-react';
import { type Song } from '../../types';

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  isAiLoading: boolean;
  songs: Song[];
  handleAiGenerate: () => void;
}

export const AiModal: React.FC<AiModalProps> = ({
  isOpen,
  onClose,
  aiPrompt,
  setAiPrompt,
  isAiLoading,
  songs,
  handleAiGenerate
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-[var(--bg-content)] text-[var(--text-content)] w-full max-w-2xl p-12 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-[var(--text-content)] hover:opacity-70"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-4xl mb-4 tracking-tight">Create AI Space</h2>
        <p className="opacity-70 mb-8">Describe your mood, and our AI will curate a space from your local library.</p>
        
        <textarea 
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="e.g. Chill indie vibes for a rainy afternoon..."
          className="w-full h-32 bg-[var(--bg-surface)] text-[var(--text-surface)] border border-[var(--border-color)] p-4 mb-8 resize-none focus:outline-none focus:border-[var(--accent)]"
        />
        
        <div className="flex justify-between items-center">
          <div className="text-xs opacity-50">
            {songs.length} songs available in library
          </div>
          <button 
            onClick={handleAiGenerate}
            disabled={isAiLoading || !aiPrompt || songs.length === 0}
            className="bg-[var(--text-content)] text-[var(--bg-content)] px-8 py-4 tracking-widest hover:opacity-80 disabled:opacity-50 flex items-center gap-3"
          >
            {isAiLoading ? <Loader2 className="animate-spin" size={18} /> : null}
            {isAiLoading ? 'GENERATING...' : 'GENERATE SPACE'}
          </button>
        </div>
      </div>
    </div>
  );
};
