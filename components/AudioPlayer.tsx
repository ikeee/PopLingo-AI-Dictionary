import React, { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { generateSpeech, playAudio } from '../services/geminiService';

interface AudioPlayerProps {
  text: string;
  initialAudio?: string;
  className?: string;
  onAudioFetched?: (audioData: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, initialAudio, className, onAudioFetched }) => {
  const [loading, setLoading] = useState(false);
  const [audioData, setAudioData] = useState<string | undefined>(initialAudio);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    if (audioData) {
      await playAudio(audioData);
    } else {
      setLoading(true);
      const data = await generateSpeech(text);
      setLoading(false);
      if (data) {
        setAudioData(data);
        if (onAudioFetched) onAudioFetched(data);
        await playAudio(data);
      }
    }
  };

  return (
    <button
      onClick={handlePlay}
      className={`p-2 rounded-full hover:bg-black/10 transition-colors ${className} flex items-center justify-center`}
      title="Play pronunciation"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
      ) : (
        <Volume2 className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
};