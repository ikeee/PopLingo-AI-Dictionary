import React, { useState } from 'react';
import { DictionaryEntry } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { Sparkles, Trash2, BookOpen } from 'lucide-react';
import { generateStory } from '../services/geminiService';

interface NotebookProps {
  entries: DictionaryEntry[];
  onDelete: (id: string) => void;
  nativeLang: string;
  targetLang: string;
}

export const Notebook: React.FC<NotebookProps> = ({ entries, onDelete, nativeLang, targetLang }) => {
  const [story, setStory] = useState<string | null>(null);
  const [loadingStory, setLoadingStory] = useState(false);

  const handleGenerateStory = async () => {
    if (entries.length === 0) return;
    setLoadingStory(true);
    setStory(null);
    try {
      const generated = await generateStory(entries, nativeLang, targetLang);
      setStory(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStory(false);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700">Your notebook is empty</h3>
        <p className="text-gray-500">Search for words and save them to see them here!</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto w-full pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black font-display text-pop-dark">My Collection ({entries.length})</h2>
        <button
          onClick={handleGenerateStory}
          disabled={loadingStory}
          className="flex items-center gap-2 bg-pop-purple border-2 border-black shadow-neo px-4 py-2 rounded-xl font-bold hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
        >
          {loadingStory ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loadingStory ? 'Dreaming...' : 'Make a Story'}
        </button>
      </div>

      {story && (
        <div className="bg-white border-4 border-black shadow-neo rounded-2xl p-6 mb-10 relative">
          <div className="absolute -top-4 -left-2 bg-pop-pink border-2 border-black px-3 py-1 rounded-lg font-bold text-sm transform -rotate-2">
            AI Story Time
          </div>
          <p className="whitespace-pre-line leading-relaxed text-lg text-gray-800">{story}</p>
          <button 
            onClick={() => setStory(null)}
            className="mt-4 text-sm text-gray-500 underline hover:text-black"
          >
            Close Story
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6 gap-6">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white border-2 border-black shadow-neo-sm rounded-xl p-4 flex flex-col h-full relative group">
             <button 
                onClick={() => onDelete(entry.id)}
                className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
             >
               <Trash2 className="w-4 h-4" />
             </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                {entry.imageUrl ? <img src={entry.imageUrl} className="w-full h-full object-cover"/> : null}
              </div>
              <div>
                <h4 className="text-xl font-bold leading-none">{entry.term}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{entry.definition}</p>
              </div>
            </div>
            
            <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-100">
               <span className="text-xs font-bold text-gray-400 uppercase">{entry.targetLanguage}</span>
               <AudioPlayer text={entry.term} initialAudio={entry.pronunciationAudio} className="w-8 h-8 bg-gray-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};