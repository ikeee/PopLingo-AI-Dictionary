import React, { useState, useRef, useEffect } from 'react';
import { DictionaryEntry, ChatMessage } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { Save, Check, MessageCircle, Send, Sparkles } from 'lucide-react';
import { chatAboutWord } from '../services/geminiService';

interface ResultCardProps {
  entry: DictionaryEntry;
  onSave: (entry: DictionaryEntry) => void;
  isSaved: boolean;
  onUpdateEntry: (id: string, updates: Partial<DictionaryEntry>) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ entry, onSave, isSaved, onUpdateEntry }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Helper to scroll only the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Only scroll if there are messages or loading state active
    if (messages.length > 0 || chatLoading) {
      scrollToBottom();
    }
  }, [messages, chatLoading]);

  const handleMainAudioFetched = (audio: string) => {
    onUpdateEntry(entry.id, { pronunciationAudio: audio });
  };

  const handleExampleAudioFetched = (index: number, audio: string) => {
    const newExamples = [...entry.examples];
    newExamples[index] = { ...newExamples[index], audio };
    onUpdateEntry(entry.id, { examples: newExamples });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatLoading) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setChatLoading(true);

    const answer = await chatAboutWord(entry, messages, userMsg.text);
    
    const aiMsg: ChatMessage = { id: crypto.randomUUID(), role: 'model', text: answer };
    setMessages(prev => [...prev, aiMsg]);
    setChatLoading(false);
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

  // Helper to render Markdown in chat (Bold **, Italic *)
  const renderChatMarkdown = (text: string) => {
    // Split into lines to handle basic lists and paragraphs
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Check for list items
      const isList = line.trim().startsWith('-') || line.trim().startsWith('* ') || /^\d+\./.test(line.trim());
      
      return (
        <p key={i} className={`min-h-[1.25rem] ${isList ? 'pl-4 mb-1' : 'mb-2 last:mb-0'}`}>
          {line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="font-black text-gray-900">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
               // Ensure it's not just a bullet point marker if we were splitting differently
               return <em key={j} className="italic text-pop-purple font-semibold">{part.slice(1, -1)}</em>;
            }
            return <span key={j}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-white border-4 border-black shadow-neo rounded-[2.5rem] p-8 mb-8 w-full max-w-[1600px] mx-auto overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-10 mb-10">
        {/* Image - Larger and Wider */}
        <div className="w-full lg:w-5/12 aspect-square bg-gray-50 border-2 border-black rounded-3xl overflow-hidden shadow-neo-sm flex-shrink-0 relative">
          {entry.imageUrl ? (
            <img src={entry.imageUrl} alt={entry.term} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
               <span className="text-sm font-bold">Generating Visual...</span>
            </div>
          )}
        </div>

        {/* Term & Definition */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-5xl lg:text-7xl font-black text-gray-900 font-display break-words tracking-tight">{entry.term}</h2>
            <button
              onClick={() => onSave(entry)}
              disabled={isSaved}
              className={`p-3 rounded-full border-2 border-black shadow-neo-sm transition-all active:translate-y-1 active:shadow-none flex-shrink-0 ml-4 ${
                isSaved ? 'bg-green-400' : 'bg-pop-pink hover:bg-pink-300'
              }`}
            >
              {isSaved ? <Check className="w-6 h-6" /> : <Save className="w-6 h-6" />}
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-8">
             <AudioPlayer 
               text={entry.term} 
               initialAudio={entry.pronunciationAudio} 
               onAudioFetched={handleMainAudioFetched}
               className="bg-pop-yellow border-2 border-black shadow-neo-sm w-12 h-12"
             />
             <div className="flex flex-col">
               <span className="text-lg font-bold text-gray-500 uppercase tracking-wider">{entry.targetLanguage}</span>
               {entry.phonetic && <span className="text-gray-400 font-mono text-sm leading-none">{entry.phonetic}</span>}
             </div>
          </div>

          <p className="text-2xl text-gray-800 leading-snug font-medium mb-8 bg-pop-yellow/10 p-4 rounded-xl border-l-4 border-pop-yellow">
            {renderWithHighlight(entry.definition)}
          </p>
          
          {/* Usage Note */}
          <div className="bg-pop-blue/10 border-l-8 border-pop-blue rounded-r-xl p-6">
             <span className="text-sm font-black text-pop-dark uppercase tracking-wide block mb-2">🔥 The Vibe</span>
             <p className="text-lg text-pop-dark italic">{renderWithHighlight(entry.usageNote)}</p>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-gray-100 mb-10 rounded-full"></div>

      {/* Bottom Section: Grid for Examples and Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Examples */}
        <div className="flex flex-col bg-pop-purple/5 p-6 rounded-3xl border border-pop-purple/20">
          <h3 className="text-2xl font-bold font-display mb-6 text-pop-purple">Examples</h3>
          <div className="space-y-4">
            {entry.examples.map((ex, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border-l-8 border-pop-purple hover:bg-gray-50 transition-colors shadow-sm">
                <div className="flex items-start gap-4">
                  <AudioPlayer 
                    text={ex.original} 
                    initialAudio={ex.audio}
                    onAudioFetched={(audio) => handleExampleAudioFetched(idx, audio)}
                    className="bg-white border border-gray-300 mt-1 w-10 h-10 flex-shrink-0"
                  />
                  <div>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                      {renderWithHighlight(ex.original)}
                    </p>
                    <p className="text-lg text-gray-600">{ex.translation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Chat */}
        <div className="flex flex-col h-[600px] bg-pop-blue/5 p-6 rounded-3xl border border-pop-blue/20">
          <h3 className="text-2xl font-bold font-display mb-6 flex items-center gap-2 text-pop-dark">
            <MessageCircle className="w-6 h-6" />
            Chat with Tutor
          </h3>
          
          <div className="bg-white border-2 border-black rounded-3xl overflow-hidden flex flex-col flex-1 shadow-sm relative">
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {messages.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="font-bold">Ask anything about "{entry.term}"</p>
                  <p className="text-sm">Grammar, slang, or more examples!</p>
                </div>
              )}
              
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-base font-medium ${
                    msg.role === 'user' 
                      ? 'bg-pop-blue text-pop-dark rounded-br-none border-2 border-black shadow-neo-sm' 
                      : 'bg-white text-gray-800 rounded-bl-none border-2 border-gray-200'
                  }`}>
                    {renderChatMarkdown(msg.text)}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                   <div className="bg-white border-2 border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                      </div>
                   </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="border-t-2 border-gray-200 p-3 bg-white flex gap-3 z-10 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-gray-100 rounded-xl px-5 py-3 outline-none focus:bg-white focus:ring-2 ring-pop-blue transition-all font-bold text-gray-700"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || chatLoading}
                className="p-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                <Send className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};