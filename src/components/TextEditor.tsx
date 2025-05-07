import React from 'react';
import '../styles/TextEditor.css';

interface TextEditorProps {
  text: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const TextEditor: React.FC<TextEditorProps> = ({ text, onChange, textareaRef }) => {
  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Save - Ctrl+S / Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      const event = new CustomEvent('save-document');
      document.dispatchEvent(event);
    }
  };

  return (
    <div className="editor-container">
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={text}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Start typing here..."
        spellCheck={true}
        autoFocus
      ></textarea>
    </div>
  );
};

export default TextEditor;