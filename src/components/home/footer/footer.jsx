"use client";

import { useState, useEffect } from "react";
import { useNotepad } from "@/context/NotepadContext";

const Footer = () => {
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(1);
  const { content, zoom } = useNotepad();

  useEffect(() => {
    const updateFooterInfo = () => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const text = textarea.value;
        const cursorPos = textarea.selectionStart;
        
        // Calculate character count
        setCharacterCount(text.length);
        
        // Calculate word count
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
        
        // Calculate line count
        setLineCount(text.split('\n').length);
        
        // Calculate line number
        const textBeforeCursor = text.substring(0, cursorPos);
        const line = textBeforeCursor.split('\n').length;
        
        // Calculate column number
        const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n');
        const col = cursorPos - lastNewlineIndex;
        
        setCursorPosition({ line, col });
      }
    };

    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.addEventListener('input', updateFooterInfo);
      textarea.addEventListener('keyup', updateFooterInfo);
      textarea.addEventListener('click', updateFooterInfo);
      textarea.addEventListener('focus', updateFooterInfo);
      
      // Initial update
      updateFooterInfo();
      
      return () => {
        textarea.removeEventListener('input', updateFooterInfo);
        textarea.removeEventListener('keyup', updateFooterInfo);
        textarea.removeEventListener('click', updateFooterInfo);
        textarea.removeEventListener('focus', updateFooterInfo);
      };
    }
  }, []);

  return (
    <div className="w-full h-8 bg-gray-800 text-gray-300 flex justify-between items-center text-xs flex-shrink-0 border-t border-gray-700" style={{paddingLeft: '100px', paddingRight: '32px'}}>
      <div className="flex gap-4">
        <span className="font-medium">Ln {cursorPosition.line}, Col {cursorPosition.col}</span>
        <span className="hidden sm:inline">{characterCount} characters</span>
        <span className="hidden md:inline">{wordCount} words</span>
      </div>
      <div className="flex gap-4">
        <span>{zoom}%</span>
        <span className="hidden sm:inline">Windows (CRLF)</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};

export default Footer;