"use client";

import { useEffect } from 'react';
import { useNotepad } from '@/context/NotepadContext';

const KeyboardHandler = () => {
  const {
    newFile,
    openFile,
    saveFile,
    saveAsFile,
    insertDateTime,
    setShowFindDialog,
    setShowReplaceDialog,
    find,
    findText
  } = useNotepad();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when not typing in input fields
      if (e.target.tagName === 'INPUT' && e.target.type === 'text') {
        return;
      }

      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            newFile();
            break;
          case 'o':
            e.preventDefault();
            openFile();
            break;
          case 's':
            e.preventDefault();
            if (e.shiftKey) {
              saveAsFile();
            } else {
              saveFile();
            }
            break;
          case 'f':
            e.preventDefault();
            setShowFindDialog(true);
            break;
          case 'h':
            e.preventDefault();
            setShowReplaceDialog(true);
            break;
          case 'p':
            e.preventDefault();
            window.print();
            break;
        }
      } else if (e.key === 'F5') {
        e.preventDefault();
        insertDateTime();
      } else if (e.key === 'F3') {
        e.preventDefault();
        if (findText) {
          find(findText);
        }
      } else if (e.key === 'Escape') {
        setShowFindDialog(false);
        setShowReplaceDialog(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    newFile,
    openFile,
    saveFile,
    saveAsFile,
    insertDateTime,
    setShowFindDialog,
    setShowReplaceDialog,
    find,
    findText
  ]);

  return null; // This component doesn't render anything
};

export default KeyboardHandler;