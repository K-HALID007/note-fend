"use client";

import Navbar from "@/components/home/navbar/navbar";
import NotePad from "@/components/home/notepad/notepad";
import Footer from "@/components/home/footer/footer";
import KeyboardHandler from "@/components/KeyboardHandler";
import SaveDialog from "@/components/SaveDialog";
  import { NotepadProvider, useNotepad } from "@/context/NotepadContext";

export default function Page() {
  return (
    <NotepadProvider>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-900">
        <KeyboardHandler />
        <div className="flex-shrink-0">
          <Navbar />
        </div>
        <div className="flex-1 min-h-0">
          <NotePad />
        </div>
        <div className="flex-shrink-0">
          <Footer />
        </div>
        <SaveDialogWrapper />
      </div>
    </NotepadProvider>
  );
}

function SaveDialogWrapper() {
  const { 
    showSaveDialog, 
    fileName, 
    handleSaveDialogSave, 
    handleSaveDialogDontSave, 
    handleSaveDialogCancel 
  } = useNotepad();
  
  return (
    <SaveDialog
      isOpen={showSaveDialog}
      fileName={fileName}
      onSave={handleSaveDialogSave}
      onDontSave={handleSaveDialogDontSave}
      onCancel={handleSaveDialogCancel}
    />
  );
}
