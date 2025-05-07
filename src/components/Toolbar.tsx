import React, { useEffect, useState } from 'react';
import { 
  File, Save, Printer, Copy, Trash2, Moon, Sun,
  Scissors, Undo, Redo, Users, Maximize2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Toolbar.css';

interface ToolbarProps {
  onNew: () => void;
  onSave: (filename: string) => void;
  onPrint: () => void;
  onCopy: () => void;
  onCut: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFullscreen: () => void;
  isSaved: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onNew, 
  onSave, 
  onPrint, 
  onCopy,
  onCut,
  onClear,
  onUndo,
  onRedo,
  onFullscreen,
  isSaved,
  canUndo,
  canRedo
}) => {
  const { theme, toggleTheme } = useTheme();
  const [filename, setFilename] = useState('notepad');
  const [showFilenameInput, setShowFilenameInput] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const handleSaveShortcut = () => {
      onSave(filename);
    };

    document.addEventListener('save-document', handleSaveShortcut);
    return () => {
      document.removeEventListener('save-document', handleSaveShortcut);
    };
  }, [onSave, filename]);

  const handleSaveClick = () => {
    if (showFilenameInput) {
      onSave(filename);
      setShowFilenameInput(false);
    } else {
      setShowFilenameInput(true);
    }
  };

  const handleFilenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSave(filename);
      setShowFilenameInput(false);
    } else if (e.key === 'Escape') {
      setShowFilenameInput(false);
    }
  };

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.menu-item')) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="toolbar-container">
      <div className="toolbar-title">
        <h1> Notepad</h1>
        {!isSaved && <span className="unsaved-indicator">*</span>}
      </div>
      
      <div className="menu-bar">
        <div className="menu-item">
          <button 
            className={`menu-button ${activeDropdown === 'file' ? 'active' : ''}`}
            onClick={() => toggleDropdown('file')}
          >
            File
          </button>
          {activeDropdown === 'file' && (
            <div className="dropdown-menu">
              <button onClick={onNew}><File size={16} /> New</button>
              <button onClick={handleSaveClick}><Save size={16} /> Save</button>
              <button onClick={onPrint}><Printer size={16} /> Print</button>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button 
            className={`menu-button ${activeDropdown === 'edit' ? 'active' : ''}`}
            onClick={() => toggleDropdown('edit')}
          >
            Edit
          </button>
          {activeDropdown === 'edit' && (
            <div className="dropdown-menu">
              <button onClick={onCopy}><Copy size={16} /> Copy</button>
              <button onClick={onCut}><Scissors size={16} /> Cut</button>
              <button onClick={onUndo} disabled={!canUndo}><Undo size={16} /> Undo</button>
              <button onClick={onRedo} disabled={!canRedo}><Redo size={16} /> Redo</button>
              <button onClick={onClear}><Trash2 size={16} /> Clear All</button>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button 
            className={`menu-button ${activeDropdown === 'view' ? 'active' : ''}`}
            onClick={() => toggleDropdown('view')}
          >
            View
          </button>
          {activeDropdown === 'view' && (
            <div className="dropdown-menu">
              <button onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} Theme
              </button>
              <button onClick={onFullscreen}><Maximize2 size={16} /> Full Screen</button>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button 
            className={`menu-button ${activeDropdown === 'help' ? 'active' : ''}`}
            onClick={() => toggleDropdown('help')}
          >
            Help
          </button>
          {activeDropdown === 'help' && (
            <div className="dropdown-menu">
              <button onClick={() => setShowAbout(true)}><Users size={16} /> About</button>
            </div>
          )}
        </div>
      </div>

      <div className="toolbar-actions">
        <div className="button-group">
          <button className="action-btn" onClick={onNew} title="New (Ctrl+N)">
            <File size={18} />
          </button>
          <button className="action-btn" onClick={handleSaveClick} title="Save (Ctrl+S)">
            <Save size={18} />
          </button>
          <button className="action-btn" onClick={onPrint} title="Print (Ctrl+P)">
            <Printer size={18} />
          </button>
        </div>

        <div className="button-group">
          <button className="action-btn" onClick={onCopy} title="Copy (Ctrl+C)">
            <Copy size={18} />
          </button>
          <button className="action-btn" onClick={onCut} title="Cut (Ctrl+X)">
            <Scissors size={18} />
          </button>
        </div>

        <div className="button-group">
          <button className="action-btn" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <Undo size={18} />
          </button>
          <button className="action-btn" onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
            <Redo size={18} />
          </button>
        </div>
      </div>

      {showFilenameInput && (
        <div className="filename-input-container">
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            onKeyDown={handleFilenameKeyDown}
            className="filename-input"
            placeholder="Enter filename"
            autoFocus
          />
        </div>
      )}

      {showAbout && (
        <div className="modal">
          <div className="modal-content">
            <h2>About Online Notepad</h2>
            <p>A simple, fast, and reliable online text editor.</p>
            <p>Version 1.0.0</p>
            <button onClick={() => setShowAbout(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;