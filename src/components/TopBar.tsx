
import { Bell, Plus } from 'lucide-react';

interface TopBarProps {
  onAddFiles: () => void;
  onAddFolder: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onAddFiles, onAddFolder }) => {
  return (
    <header className="flex justify-between items-center">
      <div className="bg-[var(--bg-surface)] px-6 py-4 w-[500px] text-[var(--text-surface)] shadow-sm text-sm flex items-center gap-4">
        <button 
          onClick={onAddFiles}
          className="hover:underline flex items-center gap-2"
        >
          <Plus size={16} /> Add Files
        </button>
        <span className="opacity-50">|</span>
        <button 
          onClick={onAddFolder}
          className="hover:underline flex items-center gap-2"
        >
          <Plus size={16} /> Add Folder
        </button>
      </div>
      <button className="w-14 h-14 bg-[var(--bg-surface)] rounded-full flex items-center justify-center shadow-sm hover:opacity-80 transition-colors">
        <Bell size={20} className="text-[var(--text-surface)]" />
      </button>
    </header>
  );
};
