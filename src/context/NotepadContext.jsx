"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const NotepadContext = createContext();

export const useNotepad = () => {
  const context = useContext(NotepadContext);
  if (!context) {
    throw new Error('useNotepad must be used within a NotepadProvider');
  }
  return context;
};

export const NotepadProvider = ({ children }) => {
  // Tab system
  const [tabs, setTabs] = useState([
    {
      id: 1,
      fileName: 'Untitled',
      content: '',
      isModified: false,
      filePath: null
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextTabId, setNextTabId] = useState(2);
  
  // Global settings
  const [wordWrap, setWordWrap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [zoom, setZoom] = useState(100);

  // Get current active tab
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];
  const content = activeTab?.content || '';
  const fileName = activeTab?.fileName || 'Untitled';
  const isModified = activeTab?.isModified || false;
  const filePath = activeTab?.filePath || null;

  // Find and replace
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showFindDialog, setShowFindDialog] = useState(false);
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Load saved content on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('notepad-content');
    const savedFileName = localStorage.getItem('notepad-filename');
    const savedWordWrap = localStorage.getItem('notepad-wordwrap');
    const savedFontSize = localStorage.getItem('notepad-fontsize');
    const savedZoom = localStorage.getItem('notepad-zoom');

    // Update first tab with saved data
    if (savedContent || savedFileName) {
      setTabs(prevTabs => 
        prevTabs.map((tab, index) => 
          index === 0 
            ? { 
                ...tab, 
                content: savedContent || '',
                fileName: savedFileName || 'Untitled'
              }
            : tab
        )
      );
    }
    
    if (savedWordWrap) setWordWrap(JSON.parse(savedWordWrap));
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedZoom) setZoom(parseInt(savedZoom));
  }, []);

  // Auto-save content
  useEffect(() => {
    localStorage.setItem('notepad-content', content);
  }, [content]);

  // Tab functions
  const updateActiveTab = (updates) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.map(tab => 
        tab.id === activeTabId 
          ? { ...tab, ...updates }
          : tab
      );
      return newTabs;
    });
  };

  const addNewTab = () => {
    const existingIds = tabs.map(tab => tab.id);
    let newId = 1;
    while (existingIds.includes(newId)) {
      newId++;
    }
    
    const fileName = newId === 1 ? 'Untitled' : `Untitled-${newId}`;
    
    const newTab = {
      id: newId,
      fileName: fileName,
      content: '',
      isModified: false,
      filePath: null
    };
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newId);
    
    const maxId = Math.max(...existingIds, newId);
    setNextTabId(maxId + 1);
    
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  };

  const closeTab = (tabId) => {
    if (tabs.length === 1) {
      updateActiveTab({
        content: '',
        fileName: 'Untitled',
        filePath: null,
        isModified: false
      });
      return;
    }

    const tabToClose = tabs.find(tab => tab.id === tabId);
    
    if (tabToClose?.isModified) {
      const shouldSave = window.confirm(`Do you want to save changes to ${tabToClose.fileName}?`);
      if (shouldSave) {
        downloadFile(tabToClose.content, tabToClose.fileName);
      }
    }

    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (tabId === activeTabId) {
      const newActiveTab = newTabs[newTabs.length - 1];
      setActiveTabId(newActiveTab.id);
    }
  };

  const switchTab = (tabId) => {
    setActiveTabId(tabId);
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  };

  const updateContent = (newContent) => {
    updateActiveTab({
      content: newContent,
      isModified: true
    });
  };

  // File operations
  const downloadFile = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const createNewDocument = () => {
    updateActiveTab({
      content: '',
      fileName: 'Untitled',
      filePath: null,
      isModified: false
    });
    
    localStorage.setItem('notepad-content', '');
    localStorage.setItem('notepad-filename', 'Untitled');
    
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  };

  const newFile = () => {
    if (isModified && content.trim() !== '') {
      setPendingAction('new');
      setShowSaveDialog(true);
    } else {
      createNewDocument();
    }
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.js,.jsx,.html,.css,.json,.log,.xml,.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          
          setTabs(prevTabs => 
            prevTabs.map(tab => 
              tab.id === activeTabId 
                ? { 
                    ...tab, 
                    content: fileContent,
                    fileName: file.name,
                    filePath: file.name,
                    isModified: false
                  }
                : tab
            )
          );
          
          localStorage.setItem('notepad-content', fileContent);
          localStorage.setItem('notepad-filename', file.name);
          
          setTimeout(() => {
            const textarea = document.querySelector('textarea');
            if (textarea) {
              textarea.focus();
            }
          }, 100);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const openFile = () => {
    if (isModified && content.trim() !== '') {
      setPendingAction('open');
      setShowSaveDialog(true);
    } else {
      openFileDialog();
    }
  };

  const saveFile = () => {
    if (filePath) {
      downloadFile(content, fileName);
      updateActiveTab({ isModified: false });
    } else {
      saveAsFile();
    }
  };

  const saveAsFile = () => {
    const newFileName = prompt('Enter filename:', fileName);
    if (newFileName) {
      downloadFile(content, newFileName);
      updateActiveTab({
        fileName: newFileName,
        filePath: newFileName,
        isModified: false
      });
      localStorage.setItem('notepad-filename', newFileName);
    }
  };

  // Dialog handlers
  const handleSaveDialogSave = () => {
    setShowSaveDialog(false);
    if (filePath) {
      downloadFile(content, fileName);
    } else {
      const newFileName = prompt('Save As - Enter filename:', fileName.endsWith('.txt') ? fileName : fileName + '.txt');
      if (newFileName) {
        downloadFile(content, newFileName);
      } else {
        setPendingAction(null);
        return;
      }
    }
    
    if (pendingAction === 'new') {
      createNewDocument();
    } else if (pendingAction === 'open') {
      openFileDialog();
    }
    setPendingAction(null);
  };

  const handleSaveDialogDontSave = () => {
    setShowSaveDialog(false);
    
    if (pendingAction === 'new') {
      createNewDocument();
    } else if (pendingAction === 'open') {
      openFileDialog();
    }
    setPendingAction(null);
  };

  const handleSaveDialogCancel = () => {
    setShowSaveDialog(false);
    setPendingAction(null);
  };

  // Edit operations
  const undo = () => {
    document.execCommand('undo');
  };

  const cut = () => {
    document.execCommand('cut');
  };

  const copy = () => {
    document.execCommand('copy');
  };

  const paste = () => {
    navigator.clipboard.readText().then(text => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + text + content.substring(end);
        updateContent(newContent);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + text.length;
          textarea.focus();
        }, 0);
      }
    });
  };

  const selectAll = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.select();
    }
  };

  const insertDateTime = () => {
    const now = new Date();
    const dateTime = now.toLocaleString();
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + dateTime + content.substring(end);
      updateContent(newContent);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + dateTime.length;
        textarea.focus();
      }, 0);
    }
  };

  // View operations
  const toggleWordWrap = () => {
    const newWordWrap = !wordWrap;
    setWordWrap(newWordWrap);
    localStorage.setItem('notepad-wordwrap', JSON.stringify(newWordWrap));
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('notepad-fontsize', size.toString());
  };

  const changeZoom = (newZoom) => {
    setZoom(newZoom);
    localStorage.setItem('notepad-zoom', newZoom.toString());
  };

  const zoomIn = () => {
    const newZoom = Math.min(zoom + 10, 500);
    changeZoom(newZoom);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoom - 10, 10);
    changeZoom(newZoom);
  };

  const resetZoom = () => {
    changeZoom(100);
  };

  // Find and replace functions
  const find = (text) => {
    if (!text) return;
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const content = textarea.value.toLowerCase();
      const searchText = text.toLowerCase();
      let startPos = textarea.selectionEnd || 0;
      
      // Search from current position
      let index = content.indexOf(searchText, startPos);
      
      // If not found, search from beginning
      if (index === -1) {
        index = content.indexOf(searchText, 0);
      }
      
      if (index !== -1) {
        textarea.focus();
        textarea.setSelectionRange(index, index + text.length);
        // Scroll to make selection visible
        const lineHeight = 20;
        const lineNumber = content.substring(0, index).split('\n').length;
        textarea.scrollTop = Math.max(0, (lineNumber - 5) * lineHeight);
      } else {
        alert('Cannot find "' + text + '"');
      }
    }
  };

  const findPrevious = (text) => {
    if (!text) return;
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const content = textarea.value.toLowerCase();
      const searchText = text.toLowerCase();
      let startPos = textarea.selectionStart || content.length;
      
      // Search backwards from current position
      let index = content.lastIndexOf(searchText, startPos - 1);
      
      // If not found, search from end
      if (index === -1) {
        index = content.lastIndexOf(searchText);
      }
      
      if (index !== -1) {
        textarea.focus();
        textarea.setSelectionRange(index, index + text.length);
        // Scroll to make selection visible
        const lineHeight = 20;
        const lineNumber = content.substring(0, index).split('\n').length;
        textarea.scrollTop = Math.max(0, (lineNumber - 5) * lineHeight);
      } else {
        alert('Cannot find "' + text + '"');
      }
    }
  };

  const replace = (findText, replaceText) => {
    if (!findText) return;
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
      if (selectedText.toLowerCase() === findText.toLowerCase()) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + replaceText + content.substring(end);
        updateContent(newContent);
        
        setTimeout(() => {
          textarea.selectionStart = start;
          textarea.selectionEnd = start + replaceText.length;
          textarea.focus();
        }, 0);
      } else {
        // If no text is selected or doesn't match, find first occurrence
        find(findText);
      }
    }
  };

  const replaceAll = (findText, replaceText) => {
    if (!findText) return;
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const replacements = (content.match(regex) || []).length;
    const newContent = content.replace(regex, replaceText);
    updateContent(newContent);
    
    if (replacements > 0) {
      alert(`Replaced ${replacements} occurrence(s)`);
    } else {
      alert('Cannot find "' + findText + '"');
    }
  };

  const value = {
    // State
    content,
    fileName,
    isModified,
    filePath,
    wordWrap,
    fontSize,
    zoom,
    findText,
    replaceText,
    showFindDialog,
    showReplaceDialog,
    showSaveDialog,
    
    // Tab system
    tabs,
    activeTabId,
    addNewTab,
    closeTab,
    switchTab,
    
    // File operations
    newFile,
    openFile,
    saveFile,
    saveAsFile,
    updateContent,
    
    // Dialog handlers
    handleSaveDialogSave,
    handleSaveDialogDontSave,
    handleSaveDialogCancel,
    
    // Edit operations
    undo,
    cut,
    copy,
    paste,
    selectAll,
    insertDateTime,
    
    // View operations
    toggleWordWrap,
    changeFontSize,
    changeZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    
    // Find/Replace
    setFindText,
    setReplaceText,
    setShowFindDialog,
    setShowReplaceDialog,
    find,
    findPrevious,
    replace,
    replaceAll
  };

  return (
    <NotepadContext.Provider value={value}>
      {children}
    </NotepadContext.Provider>
  );
};