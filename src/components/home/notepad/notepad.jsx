"use client";

import React, { useRef, useEffect } from "react";
import { useNotepad } from "@/context/NotepadContext";

const Notepad = () => {
  const textareaRef = useRef(null);
  const {
    content,
    updateContent,
    wordWrap,
    fontSize,
    zoom,
    showFindDialog,
    showReplaceDialog,
    setShowFindDialog,
    setShowReplaceDialog,
    findText,
    setFindText,
    replaceText,
    setReplaceText,
    find,
    replace,
    replaceAll,
    activeTabId
  } = useNotepad();

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Reset scroll position when tab changes
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      
      // Reset scroll position to top
      textarea.scrollTop = 0;
      textarea.scrollLeft = 0;
      
      // Reset cursor position to start
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;
      
      // Focus the textarea
      textarea.focus();
    }
  }, [activeTabId]);

  // Force re-render when content changes and ensure proper formatting
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const cursorPosition = textarea.selectionStart;
      
      // Only update if content is different
      if (textarea.value !== content) {
        textarea.value = content;
        
        // If content is empty (new file), reset scroll and cursor position
        if (content === '') {
          textarea.scrollTop = 0;
          textarea.scrollLeft = 0;
          textarea.selectionStart = 0;
          textarea.selectionEnd = 0;
        } else {
          // Restore cursor position for existing content
          setTimeout(() => {
            textarea.selectionStart = cursorPosition;
            textarea.selectionEnd = cursorPosition;
          }, 0);
        }
      }
    }
  }, [content]);

  const handleFindSubmit = (e) => {
    e.preventDefault();
    find(findText);
  };

  const handleReplaceSubmit = (e) => {
    e.preventDefault();
    replace(findText, replaceText);
  };

  const handleReplaceAll = () => {
    replaceAll(findText, replaceText);
    setShowReplaceDialog(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-0 notepad-container">
      {/* Main Textarea - Microsoft Notepad Style */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => updateContent(e.target.value)}
        className={`flex-1 w-full pl-8 pr-12 py-4 bg-white text-black resize-none outline-none border-none ${wordWrap ? 'word-wrap' : ''}`}
        style={{
          fontSize: `${Math.round(fontSize * (zoom / 100))}px`,
          lineHeight: '1.5',
          fontFamily: 'Consolas, "Courier New", Monaco, monospace',
          tabSize: 4,
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowWrap: wordWrap ? 'break-word' : 'normal',
          wordBreak: wordWrap ? 'break-word' : 'normal',
          overflow: 'auto'
        }}
        placeholder=""
        spellCheck={false}
        autoFocus
        wrap={wordWrap ? 'soft' : 'off'}
      />

      {/* Find Dialog */}
      {showFindDialog && (
        <div className="fixed top-20 right-8 bg-white border border-gray-300 p-4 rounded-lg shadow-lg z-50 min-w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-800 text-sm font-medium">Find</h3>
            <button
              onClick={() => setShowFindDialog(false)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleFindSubmit} className="space-y-3">
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Find what:"
              className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
              >
                Find Next
              </button>
              <button
                type="button"
                onClick={() => setShowFindDialog(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Replace Dialog */}
      {showReplaceDialog && (
        <div className="fixed top-20 right-8 bg-white border border-gray-300 p-4 rounded-lg shadow-lg z-50 min-w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-800 text-sm font-medium">Replace</h3>
            <button
              onClick={() => setShowReplaceDialog(false)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleReplaceSubmit} className="space-y-3">
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Find what:"
              className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replace with:"
              className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => find(findText)}
                className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
              >
                Find Next
              </button>
              <button
                type="submit"
                className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleReplaceAll}
                className="px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition"
              >
                Replace All
              </button>
              <button
                type="button"
                onClick={() => setShowReplaceDialog(false)}
                className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Notepad;