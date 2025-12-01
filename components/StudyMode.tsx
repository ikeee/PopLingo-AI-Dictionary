import React, { useState } from 'react';
import { DictionaryEntry, FlashcardSide } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { RotateCw, ArrowRight, ArrowLeft } from 'lucide-react';

interface StudyModeProps {
  entries: DictionaryEntry[];
  onUpdateEntry: (id: string, updates: Partial<DictionaryEntry>) => void;
}

export const StudyMode: React.FC<StudyModeProps> = ({ entries, onUpdateEntry }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [side, setSide] = useState<FlashcardSide>('front');

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-gray-700">No cards to study!</h3>
        <p className="text-gray-500">Save some words to your notebook first.</p>
      </div>
    );
  }

  const currentCard = entries[currentIndex];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSide('front');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % entries.length);
    }, 200);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSide('front');
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? entries.length - 1 : prev - 1));
    }, 200);
  };

  const flipCard = () => {
    setSide((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const handleExampleAudioFetched = (audio: string) => {
    const entry = entries[currentIndex];
    const newExamples = [...entry.examples];
    // Study mode currently shows the first example
    if (newExamples[0]) {
      newExamples[0] = { ...newExamples[0], audio };
      onUpdateEntry(entry.id, { examples: newExamples });
    }
  };

  // Helper to render text with <b> tags as highlighted components
  const renderWithHighlight = (text: string) => {
    const parts = text.split(/(<b>.*?<\/b>)/g);
    return parts.map((part, index) => {
      if (part.startsWith('<b>') && part.endsWith('</b>')) {
        const content = part.replace(/<\/?b>/g, '');
        return (
          <span 
            key={index} 
            className="bg-pop-yellow px-1 mx-0.5 rounded border-b-2 border-black inline-block transform -skew-x-6 text-black"
          >
            {content}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="max-w-md mx-auto h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-4 px-4">
        <span className="font-bold text-gray-400">
          Card {currentIndex + 1} of {entries.length}
        </span>
        <div className="flex gap-2">
            <button onClick={handlePrev} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-6 h-6"/></button>
            <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded-full"><ArrowRight className="w-6 h-6"/></button>
        </div>
      </div>

      <div className="flex-1 perspective-1000 relative group cursor-pointer" onClick={flipCard}>
        <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${side === 'back' ? 'rotate-y-180' : ''}`}>
          
          {/* Front Face */}
          <div className="absolute w-full h-full backface-hidden bg-white border-4 border-black rounded-3xl shadow-neo p-8 flex flex-col items-center justify-center text-center">
            {currentCard.imageUrl && (
              <div className="w-48 h-48 mb-6 rounded-2xl border-2 border-black overflow-hidden bg-gray-50 shadow-sm">
                <img src={currentCard.imageUrl} alt="Visual" className="w-full h-full object-cover" />
              </div>
            )}
            <h2 className="text-4xl font-black text-gray-800 mb-2">{currentCard.term}</h2>
            {currentCard.phonetic && (
                <p className="text-xl text-gray-500 font-mono mb-4">{currentCard.phonetic}</p>
            )}
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-auto">Tap to flip</p>
          </div>

          {/* Back Face */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-pop-yellow border-4 border-black rounded-3xl shadow-neo p-8 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
                <div className="flex flex-col">
                    <h3 className="text-2xl font-bold">{currentCard.term}</h3>
                    {currentCard.phonetic && <span className="text-sm font-mono text-gray-600">{currentCard.phonetic}</span>}
                </div>
                <AudioPlayer text={currentCard.term} initialAudio={currentCard.pronunciationAudio} className="bg-white border border-black" />
            </div>
            
            <div className="flex-1">
                <p className="text-lg font-bold mb-4">{currentCard.definition}</p>
                
                {currentCard.examples[0] && (
                    <div className="bg-white/50 p-4 rounded-xl border border-black/10 flex gap-3 items-start text-left">
                        <AudioPlayer 
                          text={currentCard.examples[0].original} 
                          initialAudio={currentCard.examples[0].audio}
                          onAudioFetched={handleExampleAudioFetched}
                          className="w-8 h-8 flex-shrink-0 bg-white border border-black/20"
                        />
                        <div>
                           <p className="italic text-gray-800 mb-1 font-medium">
                            "{renderWithHighlight(currentCard.examples[0].original)}"
                           </p>
                           <p className="text-sm text-gray-600">{currentCard.examples[0].translation}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-4 flex justify-center text-gray-600 text-sm font-bold flex-col items-center gap-2">
                 <RotateCw className="w-5 h-5" />
                 Tap to flip back
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button 
            onClick={flipCard}
            className="bg-black text-white font-bold py-3 px-8 rounded-full shadow-lg active:scale-95 transition-transform"
        >
            {side === 'front' ? 'Reveal Answer' : 'Show Question'}
        </button>
      </div>
    </div>
  );
};