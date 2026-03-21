import { Heart, Settings } from 'lucide-react'
import { type Space, type Song } from '../types';
import Logo from '../assets/re_logo.png'

interface SidebarProps {
    spaces: Space[];
    songs: Song[];
    setActiveSpaceId: (id: string) => void;
    setAiModalOpen: (open: boolean) => void;
    setSettingsOpen: (open: boolean) => void;
}

export const Sidebar = ({ spaces, songs, setActiveSpaceId, setAiModalOpen, setSettingsOpen }: SidebarProps) => {
    return (
        <div className='w-[90px] shrink-0 z-20'>
            <nav className='w-[90px] hover:w-[240px] transition-all duration-300 bg-[var(--bg-main)] flex flex-col items-center py-8 justify-between fixed h-full left-0 top-0 border-r border-[var(--bg-border-light)] group overflow-hidden z-20'>
                
                {/* TOP SECTION: Logo & Nav */}
                <div className='w-full flex flex-col items-center gap-8'>
                    <div className='flex flex-col items-center gap-8 w-full mb-[10px]'>
                        <img src={Logo} alt="Logo" height={100} />
                    </div>

                    <div className='w-full px-3 flex flex-col gap-4'>
                        <button onClick={() => setActiveSpaceId('default')} className='w-full h-12 rounded-full border border-[var(--bg-border-light)] flex items-center px-5 text-[var(--text-main)] hover:bg-[var(--bg-border-light)] cursor-pointer transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)] overflow-hidden shrink-0'>
                            <div className='w-6 flex justify-center shrink-0 items-center' >
                                <Heart size={18} />
                            </div>
                            <span className='ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap tracking-widest'>Favorites</span>
                        </button>
                        
                        <button onClick={() => setAiModalOpen(true)} className='w-full h-12 rounded-full border border-[var(--bg-border-light)] flex items-center px-6 text-[var(--text-main)] hover:bg-[var(--bg-border-light)] cursor-pointer transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)] overflow-hidden shrink-0'>
                            <div className='w-6 flex justify-center shrink-0 font-bold'>AI</div>
                            <span className='ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap tracking-widest'>RE-AI</span>
                        </button>
                    </div>

                    {/* MIDDLE SECTION: Albums */}
                    <div className="w-full mt-4 flex flex-col overflow-hidden">
                        <div className="text-[var(--text-main)] text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-widest mb-4 whitespace-nowrap shrink-0">
                            Albums
                        </div>
                        <div className="flex flex-col gap-4 px-4 w-full overflow-y-auto custom-scrollbar pb-4">
                            {spaces.filter(s => s.id !== 'default').map(space => {
                                const firstSong = songs.find(s => s.id === space.songIds[0]);
                                const coverUrl = firstSong?.coverUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop";
                                return (
                                    <div key={space.id} onClick={() => setActiveSpaceId(space.id)} className="w-full h-12 group-hover:h-20 transition-all duration-300 cursor-pointer relative overflow-hidden flex items-center justify-center shrink-0 rounded-sm">
                                        <img src={coverUrl} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION: Settings */}
                <div className="w-full px-4 shrink-0 mt-auto">
                    <button onClick={() => setSettingsOpen(true)} className="w-full h-12 rounded-full border border-[var(--bg-border-light)] flex items-center px-3 text-[var(--text-main)] hover:bg-[var(--bg-border-light)] cursor-pointer transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)] overflow-hidden shrink-0">
                        <div className="w-6 flex justify-center shrink-0">
                            <Settings size={18} />
                        </div>
                        <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap tracking-widest">Settings</span>
                    </button>
                </div>

            </nav>
        </div>
    )
}

export default Sidebar;
