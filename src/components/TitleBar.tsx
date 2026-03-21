
const { ipcRenderer } = window.require('electron');

export const TitleBar = () => {
  return (
    <div className="title-bar">

      <div className="drag-region"></div>
      
      <div className="controls">
        <button onClick={() => ipcRenderer.send('window-minimize')}>
          —
        </button>
        <button onClick={() => ipcRenderer.send('window-maximize')}>
          ▢
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
