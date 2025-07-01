"use client";

import { useNotepad } from "@/context/NotepadContext";

const TabBar = () => {
  const { tabs, activeTabId, addNewTab, closeTab, switchTab } = useNotepad();

  return (
    <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center overflow-x-auto px-8">
      <div className="flex items-center min-w-0 flex-1 gap-1">
        {/* Tabs - Modern Windows 11 Style */}
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center min-w-0 max-w-48 rounded-t-lg ${
              tab.id === activeTabId 
                ? 'bg-white text-gray-800 shadow-sm border border-gray-200 border-b-0' 
                : 'bg-transparent text-gray-600 hover:bg-gray-100'
            }`}
          >
            {/* Tab content */}
            <button
              onClick={() => switchTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 min-w-0 flex-1 text-left"
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
              className="flex items-center justify-center w-6 h-6 hover:bg-gray-200 hover:text-gray-800 rounded-full text-gray-400 mr-2 transition-all duration-200"
              title="Close tab"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        ))}
        
        {/* Add new tab button - Modern */}
        <button
          onClick={addNewTab}
          className="flex items-center justify-center w-10 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition ml-2"
          title="New tab"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 110-2h4V3a1 1 0 011-1z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TabBar;