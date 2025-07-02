"use client";

import React, { useRef, useEffect, useState } from "react";
import { useNotepad } from "@/context/NotepadContext";

const Notepad = () => {
  const textareaRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
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
    findPrevious,
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
    <div className="flex-1 flex flex-col bg-gray-900 min-h-0 notepad-container">
      {/* Main Textarea - Microsoft Notepad Dark Style */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => updateContent(e.target.value)}
        className={`flex-1 w-full pr-12 py-4 bg-gray-900 text-white resize-none outline-none border-none ${wordWrap ? 'word-wrap' : ''}`}
        style={{
          fontSize: `${Math.round(fontSize * (zoom / 100))}px`,
          lineHeight: '1.5',
          fontFamily: 'Consolas, "Courier New", Monaco, monospace',
          tabSize: 4,
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowWrap: wordWrap ? 'break-word' : 'normal',
          wordBreak: wordWrap ? 'break-word' : 'normal',
          overflow: 'auto',
          paddingLeft: '40px',
          caretColor: 'white'
        }}
        placeholder=""
        spellCheck={false}
        autoFocus
        wrap={wordWrap ? 'soft' : 'off'}
      />

      {/* Find/Replace Dialog - Dark Windows 11 Style */}
      {(showFindDialog || showReplaceDialog) && (
        <div className="fixed inset-0 flex items-start justify-center pt-16 z-50 dialog-overlay animate-fadeIn">
          <div className="bg-gray-800 border border-gray-600 shadow-xl w-80 rounded-lg animate-slideDown">
          {/* Title Bar */}
          <div className="bg-gray-700 px-3 py-2 border-b border-gray-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-200">Find and Replace</span>
              <button
                onClick={() => {
                  if (showReplaceDialog) {
                    setShowReplaceDialog(false);
                    setShowFindDialog(true);
                  } else {
                    setShowFindDialog(false);
                    setShowReplaceDialog(true);
                  }
                }}
                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-600 rounded text-xs"
                title={showReplaceDialog ? "Switch to Find" : "Switch to Replace"}
              >
                {showReplaceDialog ? '▲' : '▼'}
              </button>
            </div>
            <button
              onClick={() => {
                setShowFindDialog(false);
                setShowReplaceDialog(false);
              }}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-600 rounded text-xs"
            >
              ×
            </button>
          </div>
          
          {/* Content */}
          <div className="p-3 space-y-3">
            <form onSubmit={showReplaceDialog ? handleReplaceSubmit : handleFindSubmit}>
              {/* Find Input */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300 w-16">Find what:</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    className="w-full px-2 py-1 pr-16 border border-gray-600 bg-gray-700 text-white text-sm focus:outline-none focus:border-blue-400"
                    autoFocus
                  />
                  {/* Navigation Arrows inside input */}
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0">
                    <button
                      type="button"
                      onClick={() => findPrevious(findText)}
                      disabled={!findText}
                      className="w-5 h-5 flex items-center justify-center hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs text-gray-300"
                      title="Find Previous"
                    >
                      ˄
                    </button>
                    <button
                      type="button"
                      onClick={() => find(findText)}
                      disabled={!findText}
                      className="w-5 h-5 flex items-center justify-center hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs text-gray-300"
                      title="Find Next"
                    >
                      ˅
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Replace Input - Only show when in replace mode */}
              {showReplaceDialog && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-300 w-16">Replace with:</label>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={replaceText}
                      onChange={(e) => setReplaceText(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-600 bg-gray-700 text-white text-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              )}
              
              {/* Settings and Match Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {/* Settings Icon */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowOptions(!showOptions)}
                      className="w-6 h-6 flex items-center justify-center border border-gray-600 bg-gray-700 hover:bg-gray-600 text-xs text-gray-300"
                      title="Search Options"
                    >
                      ⚙
                    </button>
                    
                    {/* Options Dropdown */}
                    {showOptions && (
                      <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 shadow-lg rounded p-2 z-10 w-40">
                        <div className="space-y-1">
                          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                            <input type="checkbox" className="w-3 h-3" />
                            <span>Match case</span>
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                            <input type="checkbox" className="w-3 h-3" />
                            <span>Wrap around</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {findText && (
                  <span className="text-xs text-gray-400">
                    {content.toLowerCase().split(findText.toLowerCase()).length - 1} matches
                  </span>
                )}
              </div>
              
              {/* Buttons */}
              {showReplaceDialog ? (
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => find(findText)}
                    disabled={!findText}
                    className="px-3 py-1 bg-gray-700 border border-gray-600 text-sm hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-gray-200"
                  >
                    Find Next
                  </button>
                  <button
                    type="submit"
                    disabled={!findText}
                    className="px-3 py-1 bg-gray-700 border border-gray-600 text-sm hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-gray-200"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleReplaceAll}
                    disabled={!findText}
                    className="px-3 py-1 bg-gray-700 border border-gray-600 text-sm hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-gray-200"
                  >
                    Replace All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFindDialog(false);
                      setShowReplaceDialog(false);
                    }}
                    className="px-3 py-1 bg-gray-700 border border-gray-600 text-sm hover:bg-gray-600 text-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
            </form>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notepad;