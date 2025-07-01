"use client";

import { useState, useRef, useEffect } from "react";
import { useNotepad } from "@/context/NotepadContext";

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const {
    fileName,
    isModified,
    newFile,
    openFile,
    saveFile,
    saveAsFile,
    undo,
    cut,
    copy,
    paste,
    selectAll,
    insertDateTime,
    toggleWordWrap,
    wordWrap,
    setShowFindDialog,
    setShowReplaceDialog,
    zoomIn,
    zoomOut,
    resetZoom,
    zoom,
    tabs,
    activeTabId,
    addNewTab,
    closeTab,
    switchTab
  } = useNotepad();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleMenuItemClick = (action) => {
    setActiveDropdown(null);
    action();
  };

  return (
    <div className="w-full bg-gray-50 text-black flex-shrink-0">
      {/* Modern Title Bar with Integrated Tabs - Windows 11 Style */}
      <div className="h-12 flex items-center justify-between px-8 bg-gray-50 border-b border-gray-200">
        {/* Left: App Icon + Tabs */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          
          {/* Tabs integrated in title bar */}
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center min-w-0 max-w-48 rounded-lg px-3 py-1 ${
                  tab.id === activeTabId 
                    ? 'bg-white text-gray-800 shadow-sm border border-gray-200' 
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                {/* Tab content */}
                <button
                  onClick={() => switchTab(tab.id)}
                  className="flex items-center gap-2 min-w-0 flex-1 text-left"
                >
                  <span className="text-sm truncate font-medium">
                    {tab.isModified ? '• ' : ''}{tab.fileName}
                  </span>
                </button>
                
                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="flex items-center justify-center w-5 h-5 hover:bg-gray-200 hover:text-gray-800 rounded-full text-gray-400 ml-2 transition-all duration-200"
                  title="Close tab"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            ))}
            
            {/* Add new tab button */}
            <button
              onClick={addNewTab}
              className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition ml-2"
              title="New tab"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 110-2h4V3a1 1 0 011-1z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Window controls - Modern */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="w-12 h-8 flex items-center justify-center hover:bg-gray-200 text-gray-500 rounded">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M0 6h12v1H0z"/>
            </svg>
          </button>
          <button className="w-12 h-8 flex items-center justify-center hover:bg-gray-200 text-gray-500 rounded">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M1 1v10h10V1H1zm1 1h8v8H2V2z"/>
            </svg>
          </button>
          <button className="w-12 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white text-gray-500 rounded">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 4.586L10.293.293a1 1 0 011.414 1.414L7.414 6l4.293 4.293a1 1 0 01-1.414 1.414L6 7.414l-4.293 4.293a1 1 0 01-1.414-1.414L4.586 6 .293 1.707A1 1 0 011.707.293L6 4.586z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Modern Menu Bar - Windows 11 Style */}
      <div className="h-10 bg-gray-50 flex items-center px-8 text-sm relative border-b border-gray-200 gap-6" ref={dropdownRef}>
        {/* File Menu */}
        <div className="relative">
          <button 
            className={`hover:bg-gray-200 transition px-3 py-2 text-gray-600 rounded ${activeDropdown === 'file' ? 'bg-gray-200 text-gray-800' : ''}`}
            onClick={() => handleMenuClick('file')}
          >
            File
          </button>
          {activeDropdown === 'file' && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg min-w-48 z-50 rounded-lg">
              <div className="py-2">
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(newFile)}
                >
                  <span>New</span>
                  <span className="text-gray-400 text-xs">Ctrl+N</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(() => window.open(window.location.href, '_blank'))}
                >
                  <span>New Window</span>
                  <span className="text-gray-400 text-xs">Ctrl+Shift+N</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(openFile)}
                >
                  <span>Open...</span>
                  <span className="text-gray-400 text-xs">Ctrl+O</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(saveFile)}
                >
                  <span>Save</span>
                  <span className="text-gray-400 text-xs">Ctrl+S</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(saveAsFile)}
                >
                  <span>Save As...</span>
                  <span className="text-gray-400 text-xs">Ctrl+Shift+S</span>
                </button>
                <hr className="border-gray-200 my-2" />
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                  onClick={() => handleMenuItemClick(() => window.print())}
                >
                  Page Setup...
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(() => window.print())}
                >
                  <span>Print...</span>
                  <span className="text-gray-400 text-xs">Ctrl+P</span>
                </button>
                <hr className="border-gray-200 my-2" />
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                  onClick={() => handleMenuItemClick(() => window.close())}
                >
                  Exit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className="relative">
          <button 
            className={`hover:bg-gray-200 transition px-3 py-2 text-gray-600 rounded ${activeDropdown === 'edit' ? 'bg-gray-200 text-gray-800' : ''}`}
            onClick={() => handleMenuClick('edit')}
          >
            Edit
          </button>
          {activeDropdown === 'edit' && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg min-w-48 z-50 rounded-lg">
              <div className="py-2">
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(undo)}
                >
                  <span>Undo</span>
                  <span className="text-gray-400 text-xs">Ctrl+Z</span>
                </button>
                <hr className="border-gray-200 my-2" />
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(cut)}
                >
                  <span>Cut</span>
                  <span className="text-gray-400 text-xs">Ctrl+X</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(copy)}
                >
                  <span>Copy</span>
                  <span className="text-gray-400 text-xs">Ctrl+C</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(paste)}
                >
                  <span>Paste</span>
                  <span className="text-gray-400 text-xs">Ctrl+V</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(() => {
                    const textarea = document.querySelector('textarea');
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      if (start !== end) {
                        document.execCommand('delete');
                      }
                    }
                  })}
                >
                  <span>Delete</span>
                  <span className="text-gray-400 text-xs">Del</span>
                </button>
                <hr className="border-gray-200 my-2" />
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(() => setShowFindDialog(true))}
                >
                  <span>Find...</span>
                  <span className="text-gray-400 text-xs">Ctrl+F</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(() => setShowReplaceDialog(true))}
                >
                  <span>Replace...</span>
                  <span className="text-gray-400 text-xs">Ctrl+H</span>
                </button>
                <hr className="border-gray-200 my-2" />
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(selectAll)}
                >
                  <span>Select All</span>
                  <span className="text-gray-400 text-xs">Ctrl+A</span>
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700"
                  onClick={() => handleMenuItemClick(insertDateTime)}
                >
                  <span>Time/Date</span>
                  <span className="text-gray-400 text-xs">F5</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="relative">
          <button 
            className={`hover:bg-gray-200 transition px-3 py-2 text-gray-600 rounded ${activeDropdown === 'view' ? 'bg-gray-200 text-gray-800' : ''}`}
            onClick={() => handleMenuClick('view')}
          >
            View
          </button>
          {activeDropdown === 'view' && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg min-w-48 z-50 rounded-lg">
              <div className="py-2">
                <div className="relative group">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center text-gray-700">
                    <span>Zoom</span>
                    <span className="text-gray-400">▶</span>
                  </button>
                  <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 shadow-lg min-w-32 hidden group-hover:block rounded-lg">
                    <div className="py-2">
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        onClick={() => handleMenuItemClick(zoomIn)}
                      >
                        Zoom In
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        onClick={() => handleMenuItemClick(zoomOut)}
                      >
                        Zoom Out
                      </button>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                        onClick={() => handleMenuItemClick(resetZoom)}
                      >
                        Restore Default Zoom
                      </button>
                    </div>
                  </div>
                </div>
                <hr className="border-gray-200 my-2" />
                <button 
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 ${wordWrap ? 'bg-gray-50' : ''}`}
                  onClick={() => handleMenuItemClick(toggleWordWrap)}
                >
                  Word Wrap {wordWrap ? '✓' : ''}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;