
import { useAppState } from './hooks/useAppState';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SpaceList } from './components/SpaceList';
import {AiMix} from './components/AiMix'
import { NowPlayingBanner } from './components/NowPlayingBanner';
import { TrackList } from './components/TrackList';
import { AiModal } from './components/modals/AiModal';
import { AddSongsModal } from './components/modals/AddSongsModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { RightSidebar } from './components/RightSidebar';
import { TitleBar} from './components/TitleBar'

export default function App() {
  const state = useAppState();

  const removeSongFromSpace = (spaceId: string, songId: string) => {
    state.setSpaces(state.spaces.map(s => {
      if (s.id === spaceId) {
        return { ...s, songIds: s.songIds.filter(id => id !== songId) };
      }
      return s;
    }));
  };

  const toggleSongInSpace = (spaceId: string, songId: string) => {
    state.setSpaces(state.spaces.map(s => {
      if (s.id === spaceId) {
        const isInSpace = s.songIds.includes(songId);
        return {
          ...s,
          songIds: isInSpace 
            ? s.songIds.filter(id => id !== songId)
            : [...s.songIds, songId]
        };
      }
      return s;
    }));
  };

  return (

    <div className="flex h-screen w-full overflow-hidden font-mono text-sm bg-[var(--bg-main)] text-[var(--text-main)]">
          <TitleBar />
      <audio ref={state.audioRef} 
  onTimeUpdate={() => {
    if (state.audioRef.current) {
      state.setProgress(state.audioRef.current.currentTime);
    }
  }}
        onLoadedMetadata={() => {
          if (state.audioRef.current) {
            state.setDuration(state.audioRef.current.duration);
          }
        }}
        onEnded={() => {
          if (state.isRepeat) {
            if (state.audioRef.current) {
              state.audioRef.current.currentTime = 0;
              state.audioRef.current.play();
            }
          } else {
            state.playNext();
          }
        }} 
      />
      <input 
        type="file" 
        ref={state.fileInputRef} 
        onChange={state.handleFileUpload} 
        multiple 
        accept="audio/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={state.dirInputRef} 
        onChange={state.handleFileUpload} 
        // @ts-ignore
        webkitdirectory="true" 
        directory="true" 
        multiple 
        className="hidden" 
      />

      <Sidebar 
        spaces={state.spaces} 
        songs={state.songs} 
        setActiveSpaceId={state.setActiveSpaceId} 
        setAiModalOpen={state.setAiModalOpen} 
        setSettingsOpen={state.setSettingsOpen}
      />

      <main className="flex-1 bg-[var(--bg-content)] text-[var(--text-content)] flex flex-col overflow-y-auto relative">
        <div className="p-12 max-w-[1200px] mx-auto w-full flex flex-col gap-12">
          
          <TopBar 
            onAddFiles={() => state.fileInputRef.current?.click()} 
            onAddFolder={() => state.dirInputRef.current?.click()} 
          />

          <SpaceList 
            spaces={state.spaces}
            activeSpaceId={state.activeSpaceId}
            isEditingSpace={state.isEditingSpace}
            editingSpaceName={state.editingSpaceName}
            setActiveSpaceId={state.setActiveSpaceId}
            setEditingSpaceName={state.setEditingSpaceName}
            setIsEditingSpace={state.setIsEditingSpace}
            renameSpace={state.renameSpace}
            deleteSpace={state.deleteSpace}
            createSpace={state.createSpace}
          />

          <NowPlayingBanner 
            currentSong={state.currentSong}
            isPlaying={state.isPlaying}
            isShuffle={state.isShuffle}
            isRepeat={state.isRepeat}
            progress={state.progress}
            duration={state.duration}
            togglePlay={state.togglePlay}
            playNext={state.playNext}
            playPrevious={state.playPrevious}
            setIsShuffle={state.setIsShuffle}
            setIsRepeat={state.setIsRepeat}
            onSeek={(pos) => {
              if (state.audioRef.current) {
                state.audioRef.current.currentTime = pos * state.duration;
              }
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 h-[400px]">
            <TrackList 
              activeSpace={state.activeSpace}
              activeSongs={state.activeSongs}
              currentSong={state.currentSong}
              isPlaying={state.isPlaying}
              setAddSongsModalOpen={state.setAddSongsModalOpen}
              removeSongFromSpace={removeSongFromSpace} 
              playSong={state.playSong}
              togglePlay={state.togglePlay}
              deleteSong={state.deleteSong} 
            />
            <AiMix onClick={() => state.setAiModalOpen(true)} />
          </div>

        </div>

        <AiModal 
          isOpen={state.aiModalOpen}
          onClose={() => state.setAiModalOpen(false)}
          aiPrompt={state.aiPrompt}
          setAiPrompt={state.setAiPrompt}
          isAiLoading={state.isAiLoading}
          songs={state.songs}
          handleAiGenerate={state.handleAiGenerate}
        />

        <AddSongsModal 
          isOpen={state.addSongsModalOpen}
          onClose={() => state.setAddSongsModalOpen(false)}
          activeSpace={state.activeSpace}
          songs={state.songs}
          toggleSongInSpace={toggleSongInSpace}
        />

        <SettingsModal
          isOpen={state.settingsOpen}
          onClose={() => state.setSettingsOpen(false)}
          activeSpaceName={state.activeSpace.name}
          theme={state.theme}
          setTheme={state.setTheme}
          apiKey={state.apiKey}
          setApiKey={state.setApiKey}
          crossfade={state.crossfade}
          setCrossfade={state.setCrossfade}
          highQuality={state.highQuality}
          setHighQuality={state.setHighQuality}
        />
      </main>

      <RightSidebar 
        history={state.history}
        currentSong={state.currentSong}
        isPlaying={state.isPlaying}
        togglePlay={state.togglePlay}
        playSong={state.playSong}
      />
    </div>
  );
}
