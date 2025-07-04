"use client";

import { useNotepad } from "@/context/NotepadContext";
import { useState } from "react";

const TabBar = () => {
  const { tabs, activeTabId, addNewTab, closeTab, switchTab } = useNotepad();
  const [draggedTab, setDraggedTab] = useState(null);
  const [dragOverTab, setDragOverTab] = useState(null);

  const handleDragStart = (e, tabId) => {
    setDraggedTab(tabId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, tabId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTab(tabId);
  };

  const handleDragLeave = () => {
    setDragOverTab(null);
  };

  const handleDrop = (e, targetTabId) => {
    e.preventDefault();
    setDragOverTab(null);
    
    if (draggedTab && draggedTab !== targetTabId) {
      // Reorder tabs logic can be added here if needed
      console.log(`Moving tab ${draggedTab} to position of ${targetTabId}`);
    }
    setDraggedTab(null);
  };

  const handleDragEnd = () => {
    setDraggedTab(null);
    setDragOverTab(null);
  };

  return (
    <div className="h-12 bg-gray-800 flex items-center overflow-x-auto tab-scrollbar" style={{paddingLeft: '40px', paddingRight: '32px'}}>
      <div className="flex items-center min-w-0 flex-1 gap-3">
        {/* Tabs - Seamless Design with Breadcrumb Style */}
        {tabs.map((tab, index) => (
          <div key={tab.id} className="flex items-center">
            {/* Path separator for breadcrumb style */}
            {index > 0 && (
              <div className="text-gray-500 mx-2 text-sm">
                <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor">
                  <path d="M1 1l4 4-4 4"/>
                </svg>
              </div>
            )}
            
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, tab.id)}
              onDragOver={(e) => handleDragOver(e, tab.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, tab.id)}
              onDragEnd={handleDragEnd}
              className={`
                group flex items-center min-w-0 max-w-56 rounded-lg transition-all duration-300 ease-in-out
                ${tab.id === activeTabId 
                  ? 'bg-gray-700 text-white shadow-md' 
                  : 'bg-transparent text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }
                ${dragOverTab === tab.id ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                ${draggedTab === tab.id ? 'opacity-50 transform rotate-1' : ''}
                cursor-pointer relative overflow-hidden
              `}
            >
              {/* Tab content */}
              <button
                onClick={() => switchTab(tab.id)}
                className="flex items-center gap-2 px-3 py-2 min-w-0 flex-1 text-left relative z-10"
              >
                {/* File type icon */}
                <div className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${tab.isModified 
                    ? 'bg-orange-400 animate-pulse' 
                    : tab.id === activeTabId 
                      ? 'bg-blue-400' 
                      : 'bg-gray-500'
                  }
                `} />
                
                {/* File name with breadcrumb style */}
                <span className={`
                  text-sm truncate font-medium transition-all duration-300
                  ${tab.id === activeTabId ? 'text-white font-semibold' : 'text-gray-400 group-hover:text-white'}
                `}>
                  {tab.fileName}
                </span>
                
                {/* Modified indicator */}
                {tab.isModified && (
                  <span className="text-orange-400 text-xs font-bold animate-pulse ml-1">
                    •
                  </span>
                )}
              </button>
              
              {/* Enhanced close button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className={`
                  flex items-center justify-center w-6 h-6 rounded-full mr-1 transition-all duration-300 relative z-10
                  ${tab.id === activeTabId 
                    ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' 
                    : 'hover:bg-red-500/20 text-gray-500 hover:text-red-400'
                  }
                  opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100
                `}
                title="Close tab (Ctrl+W)"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="transition-transform duration-200 hover:rotate-90">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
        
        {/* Add new tab button with breadcrumb style */}
        <div className="flex items-center">
          {tabs.length > 0 && (
            <div className="text-gray-500 mx-2 text-sm">
              <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor">
                <path d="M1 1l4 4-4 4"/>
              </svg>
            </div>
          )}
          
          <button
            onClick={addNewTab}
            className="
              group flex items-center justify-center w-10 h-8 text-gray-500 hover:text-white 
              hover:bg-gray-700/50 rounded-lg transition-all duration-300 relative overflow-hidden
              hover:shadow-md hover:scale-105 flex-shrink-0
            "
            title="New tab (Ctrl+T)"
          >
            {/* Plus icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="transition-transform duration-300 group-hover:rotate-90 relative z-10">
              <path d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 110-2h4V3a1 1 0 011-1z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Tab count indicator with breadcrumb style */}
      <div className="flex items-center gap-2 ml-6 px-3 py-1 bg-gray-700/30 rounded-full flex-shrink-0">
        <span className="text-xs text-gray-500 font-medium">
          {tabs.length} tab{tabs.length !== 1 ? 's' : ''}
        </span>
        {tabs.some(tab => tab.isModified) && (
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" title="Unsaved changes" />
        )}
      </div>
    </div>
  );
};

export default TabBar;