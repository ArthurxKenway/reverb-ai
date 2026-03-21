
import { Plus, X } from 'lucide-react';
import { type Space } from '../types';

interface SpaceListProps {
  spaces: Space[];
  activeSpaceId: string;
  isEditingSpace: boolean;
  editingSpaceName: string;
  setActiveSpaceId: (id: string) => void;
  setEditingSpaceName: (name: string) => void;
  setIsEditingSpace: (isEditing: boolean) => void;
  renameSpace: (id: string, newName: string) => void;
  deleteSpace: (id: string) => void;
  createSpace: () => void;
}

export const SpaceList: React.FC<SpaceListProps> = ({
  spaces,
  activeSpaceId,
  isEditingSpace,
  editingSpaceName,
  setActiveSpaceId,
  setEditingSpaceName,
  setIsEditingSpace,
  renameSpace,
  deleteSpace,
  createSpace
}) => {
  return (
    <div className="flex justify-between items-end">
      <h1 className="text-[44px] leading-none tracking-tight">Good Evening</h1>
      <div className="flex items-center gap-6 text-sm overflow-x-auto max-w-[60%] pb-2 custom-scrollbar">
        {spaces.map(space => (
          <div key={space.id} className="flex items-center gap-2 group shrink-0">
            {isEditingSpace && activeSpaceId === space.id && space.id !== 'default' ? (
              <input
                autoFocus
                type="text"
                value={editingSpaceName}
                onChange={(e) => setEditingSpaceName(e.target.value)}
                onBlur={() => renameSpace(space.id, editingSpaceName)}
                onKeyDown={(e) => e.key === 'Enter' && renameSpace(space.id, editingSpaceName)}
                className="bg-transparent border-b border-[var(--text-content)] outline-none w-24"
              />
            ) : (
              <span 
                onClick={() => setActiveSpaceId(space.id)}
                onDoubleClick={() => {
                  if (space.id !== 'default') {
                    setEditingSpaceName(space.name);
                    setIsEditingSpace(true);
                    setActiveSpaceId(space.id);
                  }
                }}
                className={`cursor-pointer hover:underline whitespace-nowrap ${activeSpaceId === space.id ? 'font-bold underline' : ''}`}
              >
                {space.name}
              </span>
            )}
            {space.id !== 'default' && activeSpaceId === space.id && !isEditingSpace && (
              <button onClick={() => deleteSpace(space.id)} className="opacity-0 group-hover:opacity-100 text-[var(--accent)] hover:opacity-70 transition-opacity">
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        <button onClick={createSpace} className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-[var(--border-color)] hover:bg-[var(--border-color)] transition-colors">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};
