import React, { useState, useEffect, useRef } from 'react';
import Toolbar from './Toolbar';
import TextEditor from './TextEditor';
import Statistics from './Statistics';
import { useTheme } from '../context/ThemeContext';
import '../styles/Notepad.css';

const Notepad: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();
  
  // Load saved text from localStorage on component mount
  useEffect(() => {
    const savedText = localStorage.getItem('notepadText');
    if (savedText) {
      setText(savedText);
      setUndoStack([savedText]);
    }
  }, []);

  // Auto-save text to localStorage whenever it changes
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem('notepadText', text);
      setIsSaved(true);
    }, 1000);
    
    return () => clearTimeout(saveTimer);
  }, [text]);

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setIsSaved(false);
    setUndoStack([...undoStack, text]);
    setRedoStack([]);
  };

  // Calculate text statistics
  const calculateStats = () => {
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const charCount = text.length;
    const lineCount = text === '' ? 0 : text.split('\n').length;
    
    return { wordCount, charCount, lineCount };
  };

  // Create a new document
  const handleNew = () => {
    if (!isSaved && text.trim() !== '') {
      if (window.confirm('You have unsaved changes. Are you sure you want to create a new document?')) {
        setText('');
        setIsSaved(true);
        setUndoStack([]);
        setRedoStack([]);
      }
    } else {
      setText('');
      setIsSaved(true);
      setUndoStack([]);
      setRedoStack([]);
    }
    
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Save document as a text file
  const handleSave = (filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsSaved(true);
  };

  // Print document
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Notepad</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.5;
                white-space: pre-wrap;
                padding: 20px;
              }
            </style>
          </head>
          <body>${text.replace(/\n/g, '<br>')}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Copy text to clipboard
  const handleCopy = () => {
    if (text.trim() !== '') {
      navigator.clipboard.writeText(text);
    }
  };

  // Cut text to clipboard
  const handleCut = () => {
    if (text.trim() !== '') {
      navigator.clipboard.writeText(text);
      setText('');
      setIsSaved(false);
    }
  };

  // Clear all text
  const handleClear = () => {
    if (text.trim() !== '') {
      if (window.confirm('Are you sure you want to clear all text?')) {
        setText('');
        setIsSaved(false);
      }
    }
  };

  // Undo last change
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousText = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, text]);
      setUndoStack(undoStack.slice(0, -1));
      setText(previousText);
      setIsSaved(false);
    }
  };

  // Redo last undone change
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextText = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, text]);
      setRedoStack(redoStack.slice(0, -1));
      setText(nextText);
      setIsSaved(false);
    }
  };

  // Toggle fullscreen
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const stats = calculateStats();

  return (
    <div className={`notepad-container ${theme}`}>
      <div className="notepad-wrapper">
        <Toolbar 
          onNew={handleNew}
          onSave={handleSave}
          onPrint={handlePrint}
          onCopy={handleCopy}
          onCut={handleCut}
          onClear={handleClear}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onFullscreen={handleFullscreen}
          isSaved={isSaved}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
        />
        <TextEditor 
          text={text}
          onChange={handleTextChange}
          textareaRef={textareaRef}
        />
        <Statistics stats={stats} />
      </div>
    </div>
  );
};

export default Notepad;