import React, { useState, useEffect } from 'react';
import { POPULAR_LANGUAGES, DEFAULT_NATIVE, DEFAULT_TARGET } from './constants';
import { AppView, DictionaryEntry, LanguageOption } from './types';
import { generateDefinition, generateImage } from './services/geminiService';
import { ResultCard } from './components/ResultCard';
import { Notebook } from './components/Notebook';
import { StudyMode } from './components/StudyMode';
import { Search, Book, GraduationCap, ArrowRightLeft, Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const [nativeLang, setNativeLang] = useState(DEFAULT_NATIVE);
  const [targetLang, setTargetLang] = useState(DEFAULT_TARGET);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<AppView>(AppView.SEARCH);
  
  // State for search result
  const [currentResult, setCurrentResult] = useState<DictionaryEntry | null>(null);
  
  // State for notebook
  const [savedEntries, setSavedEntries] = useState<DictionaryEntry[]>(() => {
    const saved = localStorage.getItem('poplingo_notebook');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('poplingo_notebook', JSON.stringify(savedEntries));
  }, [savedEntries]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setCurrentResult(null);

    try {
      const nativeName = POPULAR_LANGUAGES.find(l => l.code === nativeLang)?.name || 'English';
      const targetName = POPULAR_LANGUAGES.find(l => l.code === targetLang)?.name || 'Spanish';

      // Parallelize text and image generation for speed
      // Note: Image might finish before or after definition
      const definitionPromise = generateDefinition(query, nativeName, targetName);
      const imagePromise = generateImage(query);

      const [defResult, imgResult] = await Promise.all([definitionPromise, imagePromise]);

      const newEntry: DictionaryEntry = {
        id: crypto.randomUUID(),
        ...defResult,
        imageUrl: imgResult,
        timestamp: Date.now(),
      };

      setCurrentResult(newEntry);
    } catch (error) {
      console.error("Search failed", error);
      alert("Oops! Something went wrong getting the definition. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (entry: DictionaryEntry) => {
    if (!savedEntries.some(e => e.id === entry.id)) {
      setSavedEntries([entry, ...savedEntries]);
    }
  };

  const handleDelete = (id: string) => {
    setSavedEntries(savedEntries.filter(e => e.id !== id));
  };
  
  const handleUpdateEntry = (id: string, updates: Partial<DictionaryEntry>) => {
      // Update saved entries if it exists there
      setSavedEntries(prev => prev.map(entry => entry.id === id ? { ...entry, ...updates } : entry));
      
      // Update current result if it matches
      if (currentResult && currentResult.id === id) {
          setCurrentResult(prev => prev ? { ...prev, ...updates } : null);
      }
  };

  const swapLanguages = () => {
    setNativeLang(targetLang);
    setTargetLang(nativeLang);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-24 md:pb-0">
      {/* Mobile-friendly top bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-gray-100 p-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.SEARCH)}>
            <div className="w-8 h-8 bg-pop-yellow border-2 border-black rounded-lg flex items-center justify-center shadow-neo-sm">
                <Sparkles className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-black font-display tracking-tight hidden sm:block">PopLingo</h1>
          </div>
          
          {/* View Switcher for Desktop */}
          <nav className="hidden md:flex gap-2">
            {[
              { id: AppView.SEARCH, label: 'Search', icon: Search },
              { id: AppView.NOTEBOOK, label: 'Notebook', icon: Book },
              { id: AppView.STUDY, label: 'Study', icon: GraduationCap },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                  view === item.id 
                    ? 'bg-black text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

           {/* Mobile Menu Button - Just shows saved count or something small */}
           <div className="md:hidden text-xs font-bold bg-gray-100 px-2 py-1 rounded-md">
              {savedEntries.length} Saved
           </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-4 md:p-8">
        
        {view === AppView.SEARCH && (
          <div className="flex flex-col items-center">
             {/* Language Selector */}
            <div className="w-full max-w-2xl bg-gray-50 p-2 rounded-2xl mb-8 flex items-center justify-between border border-gray-200 shadow-sm">
              <select 
                value={nativeLang}
                onChange={(e) => setNativeLang(e.target.value)}
                className="bg-transparent font-bold p-2 text-sm md:text-base outline-none cursor-pointer hover:bg-white rounded-lg transition-colors flex-1"
              >
                {POPULAR_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name} (Native)</option>)}
              </select>
              
              <button onClick={swapLanguages} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md border border-gray-200 mx-2">
                <ArrowRightLeft className="w-4 h-4 text-gray-600" />
              </button>

              <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-transparent font-bold p-2 text-sm md:text-base outline-none cursor-pointer hover:bg-white rounded-lg transition-colors flex-1 text-right"
              >
                {POPULAR_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name} (Target) {l.flag}</option>)}
              </select>
            </div>

            {/* Search Input */}
            <div className="w-full max-w-2xl relative mb-12">
               <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a word, phrase, or sentence..."
                    className="w-full h-16 pl-6 pr-16 rounded-full border-4 border-black shadow-neo text-lg font-bold outline-none focus:translate-y-[2px] focus:shadow-neo-sm transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="absolute right-2 top-2 h-12 w-12 bg-pop-blue rounded-full border-2 border-black flex items-center justify-center hover:bg-cyan-200 transition-colors disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
                  </button>
               </form>
            </div>

            {/* Result */}
            {currentResult && (
              <ResultCard 
                entry={currentResult} 
                onSave={handleSave} 
                isSaved={savedEntries.some(e => e.id === currentResult.id)}
                onUpdateEntry={handleUpdateEntry}
              />
            )}
            
            {!currentResult && !loading && (
                <div className="text-center mt-10 opacity-40">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="font-display font-bold text-xl">Ready to learn something new?</p>
                </div>
            )}
          </div>
        )}

        {view === AppView.NOTEBOOK && (
          <Notebook 
            entries={savedEntries} 
            onDelete={handleDelete}
            nativeLang={POPULAR_LANGUAGES.find(l => l.code === nativeLang)?.name || 'English'}
            targetLang={POPULAR_LANGUAGES.find(l => l.code === targetLang)?.name || 'Spanish'}
          />
        )}

        {view === AppView.STUDY && (
          <StudyMode entries={savedEntries} onUpdateEntry={handleUpdateEntry} />
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t-2 border-gray-100 flex justify-around p-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {[
          { id: AppView.SEARCH, label: 'Search', icon: Search },
          { id: AppView.NOTEBOOK, label: 'Notebook', icon: Book },
          { id: AppView.STUDY, label: 'Study', icon: GraduationCap },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1 ${view === item.id ? 'text-black' : 'text-gray-400'}`}
          >
            <div className={`p-1 rounded-full ${view === item.id ? 'bg-pop-yellow border-2 border-black' : ''}`}>
                <item.icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}