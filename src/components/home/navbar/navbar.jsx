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
    <div className="w-full bg-gray-800 text-white flex-shrink-0">
      {/* Title Bar - Seamless Design */}
      <div className="h-8 flex items-center justify-between bg-gray-800" style={{paddingLeft: '40px', paddingRight: '32px'}}>
        {/* Left: App Icon + Title */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span className="text-sm text-gray-300 font-medium">
            {fileName}{isModified ? ' •' : ''} - Notepad
          </span>
        </div>
        
        {/* Right: Window Controls */}
        <div className="flex items-center gap-1">
          <button className="w-8 h-6 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M0 5h10"/>
            </svg>
          </button>
          <button className="w-8 h-6 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M0 0h10v10H0z" fillOpacity="0" stroke="currentColor"/>
            </svg>
          </button>
          <button className="w-8 h-6 hover:bg-red-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M0 0l10 10M10 0L0 10"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Bar - Seamless Design */}
      <div className="h-10 bg-gray-800 flex items-center text-sm relative gap-6" style={{paddingLeft: '40px', paddingRight: '32px'}} ref={dropdownRef}>
        {/* File Menu */}
        <div className="relative">
          <button 
            className={`hover:bg-gray-700 transition px-3 py-2 text-gray-300 rounded ${activeDropdown === 'file' ? 'bg-gray-700 text-white' : ''}`}
            onClick={() => handleMenuClick('file')}
          >
            File
          </button>
          {activeDropdown === 'file' && (
            <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 shadow-lg min-w-72 z-50 rounded-lg">
              <div className="py-6 space-y-4">
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(newFile)}
                >
                  <span>New</span>
                  <span className="text-gray-400 text-sm">Ctrl+N</span>
                </button>
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(() => window.open(window.location.href, '_blank'))}
                >
                  <span>New Window</span>
                  <span className="text-gray-400 text-sm">Ctrl+Shift+N</span>
                </button>
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(openFile)}
                >
                  <span>Open...</span>
                  <span className="text-gray-400 text-sm">Ctrl+O</span>
                </button>
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(saveFile)}
                >
                  <span>Save</span>
                  <span className="text-gray-400 text-sm">Ctrl+S</span>
                </button>
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(saveAsFile)}
                >
                  <span>Save As...</span>
                  <span className="text-gray-400 text-sm">Ctrl+Shift+S</span>
                </button>
                <hr className="border-gray-600 my-5 mx-4" />
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(() => window.print())}
                >
                  Page Setup...
                </button>
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(() => window.print())}
                >
                  <span>Print...</span>
                  <span className="text-gray-400 text-sm">Ctrl+P</span>
                </button>
                <hr className="border-gray-600 my-5 mx-4" />
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 text-gray-200 transition-colors rounded mx-4 text-base"
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
            className={`hover:bg-gray-700 transition px-3 py-2 text-gray-300 rounded ${activeDropdown === 'edit' ? 'bg-gray-700 text-white' : ''}`}
            onClick={() => handleMenuClick('edit')}
          >
            Edit
          </button>
          {activeDropdown === 'edit' && (
            <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 shadow-lg min-w-72 z-50 rounded-lg">
              <div className="py-6 space-y-4">
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(undo)}
                >
                  <span>Undo</span>
                  <span className="text-gray-400 text-sm">Ctrl+Z</span>
                </button>
                <hr className="border-gray-600 my-5 mx-4" />
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(cut)}
                >
                  <span>Cut</span>
                  <span className="text-gray-400 text-sm">Ctrl+X</span>
                </button>
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(copy)}
                >
                  <span>Copy</span>
                  <span className="text-gray-400 text-sm">Ctrl+C</span>
                </button>
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(paste)}
                >
                  <span>Paste</span>
                  <span className="text-gray-400 text-sm">Ctrl+V</span>
                </button>
                <hr className="border-gray-600 my-5 mx-4" />
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(() => setShowFindDialog(true))}
                >
                  <span>Find...</span>
                  <span className="text-gray-400 text-sm">Ctrl+F</span>
                </button>
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(() => setShowReplaceDialog(true))}
                >
                  <span>Replace...</span>
                  <span className="text-gray-400 text-sm">Ctrl+H</span>
                </button>
                <hr className="border-gray-600 my-5 mx-4" />
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(selectAll)}
                >
                  <span>Select All</span>
                  <span className="text-gray-400 text-sm">Ctrl+A</span>
                </button>
                <button 
                  className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base"
                  onClick={() => handleMenuItemClick(insertDateTime)}
                >
                  <span>Time/Date</span>
                  <span className="text-gray-400 text-sm">F5</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="relative">
          <button 
            className={`hover:bg-gray-700 transition px-3 py-2 text-gray-300 rounded ${activeDropdown === 'view' ? 'bg-gray-700 text-white' : ''}`}
            onClick={() => handleMenuClick('view')}
          >
            View
          </button>
          {activeDropdown === 'view' && (
            <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 shadow-lg min-w-72 z-50 rounded-lg">
              <div className="py-6 space-y-4">
                <div className="relative group">
                  <button className="w-full text-left px-8 py-5 hover:bg-gray-600 flex justify-between items-center text-gray-200 transition-colors rounded mx-4 text-base">
                    <span>Zoom</span>
                    <span className="text-gray-400">▶</span>
                  </button>
                  <div className="absolute left-full top-0 ml-1 bg-gray-700 border border-gray-600 shadow-lg min-w-56 hidden group-hover:block rounded-lg">
                    <div className="py-6 space-y-4">
                      <button 
                        className="w-full text-left px-8 py-5 hover:bg-gray-600 text-gray-200 transition-colors rounded mx-4 text-base"
                        onClick={() => handleMenuItemClick(zoomIn)}
                      >
                        Zoom In
                      </button>
                      <button 
                        className="w-full text-left px-8 py-5 hover:bg-gray-600 text-gray-200 transition-colors rounded mx-4 text-base"
                        onClick={() => handleMenuItemClick(zoomOut)}
                      >
                        Zoom Out
                      </button>
                      <button 
                        className="w-full text-left px-8 py-5 hover:bg-gray-600 text-gray-200 transition-colors rounded mx-4 text-base"
                        onClick={() => handleMenuItemClick(resetZoom)}
                      >
                        Restore Default Zoom
                      </button>
                    </div>
                  </div>
                </div>
                <hr className="border-gray-600 my-5 mx-4" />
                <button 
                  className={`w-full text-left px-8 py-5 hover:bg-gray-600 text-gray-200 transition-colors rounded mx-4 text-base ${wordWrap ? 'bg-gray-600' : ''}`}
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