import React from 'react';
import Notepad from './components/Notepad';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Notepad />
    </ThemeProvider>
  );
}

export default App;