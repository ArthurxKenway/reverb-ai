
import { X, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSpaceName: string;
  theme: string;
  setTheme: (theme: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  crossfade: boolean;
  setCrossfade: (val: boolean) => void;
  highQuality: boolean;
  setHighQuality: (val: boolean) => void;
}

const THEMES = [
  { id: 'base', name: 'Base Brutalist' },
  { id: 'midnight', name: 'Midnight Blue' },
  { id: 'forest', name: 'Deep Forest' },
  { id: 'sunset', name: 'Warm Sunset' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon' },
  { id: 'minimal', name: 'Minimal Light' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  activeSpaceName,
  theme,
  setTheme,
  apiKey,
  setApiKey,
  crossfade,
  setCrossfade,
  highQuality,
  setHighQuality
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-[var(--bg-content)] text-[var(--text-content)] w-full max-w-2xl p-12 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-[var(--text-content)] hover:opacity-70"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-4xl mb-8 tracking-tight">Settings for {activeSpaceName}</h2>
        
        {/* Appearance */}
        <div className="mb-10">
          <h3 className="text-xl mb-4 tracking-widest border-b border-[var(--border-color)] pb-2">Appearance</h3>
          <div className="grid grid-cols-2 gap-4">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 border text-left flex justify-between items-center transition-colors ${
                  theme === t.id 
                    ? 'border-[var(--accent)] bg-[var(--border-color)]' 
                    : 'border-[var(--border-color)] hover:bg-[var(--border-color)]'
                }`}
              >
                <span>{t.name}</span>
                {theme === t.id && <Check size={18} className="text-[var(--accent)]" />}
              </button>
            ))}
          </div>
        </div>

        {/* AI Configuration */}
        <div className="mb-10">
          <h3 className="text-xl mb-4 tracking-widest border-b border-[var(--border-color)] pb-2">AI Configuration</h3>
          <p className="text-sm opacity-70 mb-4">
            Provide your own Gemini API key to generate AI spaces. If left blank, the default system key will be used (if available).
          </p>
          <input 
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter Gemini API Key..."
            className="w-full bg-[var(--bg-surface)] text-[var(--text-surface)] border border-[var(--border-color)] p-4 focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        {/* Audio Settings */}
        <div className="mb-10">
          <h3 className="text-xl mb-4 tracking-widest border-b border-[var(--border-color)] pb-2">Audio</h3>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-base">Crossfade Tracks</div>
              <div className="text-xs opacity-70">Smoothly transition between songs</div>
            </div>
            <button 
              onClick={() => setCrossfade(!crossfade)}
              className={`w-12 h-6 rounded-full relative transition-colors ${crossfade ? 'bg-[var(--accent)]' : 'bg-[var(--border-color)]'}`}
            >
              <div className={`w-4 h-4 bg-[var(--bg-content)] rounded-full absolute top-1 transition-transform ${crossfade ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-base">High Quality Audio</div>
              <div className="text-xs opacity-70">Prefer lossless formats when available</div>
            </div>
            <button 
              onClick={() => setHighQuality(!highQuality)}
              className={`w-12 h-6 rounded-full relative transition-colors ${highQuality ? 'bg-[var(--accent)]' : 'bg-[var(--border-color)]'}`}
            >
              <div className={`w-4 h-4 bg-[var(--bg-content)] rounded-full absolute top-1 transition-transform ${highQuality ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
