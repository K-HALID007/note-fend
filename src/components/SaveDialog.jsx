"use client";

import { useState } from 'react';

const SaveDialog = ({ isOpen, fileName, onSave, onDontSave, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2d2d2d] border border-neutral-600 rounded-lg p-6 min-w-96 max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <h3 className="text-white text-lg font-medium">Notepad</h3>
        </div>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          Do you want to save changes to <span className="font-medium">{fileName}</span>?
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
          >
            Save
          </button>
          <button
            onClick={onDontSave}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition font-medium"
          >
            Don't Save
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveDialog;