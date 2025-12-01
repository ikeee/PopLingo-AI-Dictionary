import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DictionaryEntry, ExampleSentence, ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert base64 to Uint8Array
const base64ToBytes = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Helper to decode raw PCM data (16-bit integer, 24kHz default for Gemini TTS)
const decodePCM = (
  base64Data: string,
  audioContext: AudioContext
): AudioBuffer => {
  const bytes = base64ToBytes(base64Data);
  
  // Gemini TTS 2.5 flash returns 24kHz mono 16-bit PCM
  const sampleRate = 24000;
  const numChannels = 1;
  
  // Ensure we map to valid Int16 boundaries
  const bufferLen = bytes.length;
  const safeLen = bufferLen - (bufferLen % 2);
  const dataInt16 = new Int16Array(bytes.buffer, 0, safeLen / 2);
  
  const frameCount = dataInt16.length / numChannels;
  const buffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert int16 to float32 (-1.0 to 1.0)
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

export const playAudio = async (base64Audio: string) => {
  try {
    // Create a new AudioContext for playback. 
    // FIXED: Do not force sampleRate in constructor as it causes errors on some devices.
    // The AudioBuffer (created in decodePCM with 24000Hz) will be automatically resampled 
    // by the browser to match the hardware output rate.
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Decode the raw PCM data manually
    const audioBuffer = decodePCM(base64Audio, audioContext);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  } catch (e) {
    console.error("Error playing audio", e);
  }
};

export const generateDefinition = async (
  term: string,
  nativeLang: string,
  targetLang: string
): Promise<Omit<DictionaryEntry, 'id' | 'timestamp' | 'imageUrl' | 'pronunciationAudio'>> => {
  
  const prompt = `
    Define the term "${term}" (which is in ${targetLang}).
    The user is a native ${nativeLang} speaker.
    
    1. Provide a natural definition in ${nativeLang}. Do NOT use markdown syntax like bold (**) or italics (*) in the definition.
    2. Provide phonetic transcription (IPA) for the term.
    3. Provide 3 example sentences in ${targetLang} with ${nativeLang} translations.
    
    CRITICAL RULE FOR EXAMPLES:
    - Every single example sentence MUST contain the exact term "${term}" (or a grammatical variation of it like plural/conjugated form).
    - You MUST wrap the term (and only the term) in the example sentence with <b> tags. 
      Example: If term is "run", output: "I love to <b>run</b> in the morning."
    
    4. Write a "Usage Note" in ${nativeLang}. It must be fun, lively, and casual (slang is okay if appropriate). Explain cultural nuance, tone, or common pitfalls. Do NOT sound like a textbook. Be brief and punchy. No greetings. Do NOT use markdown syntax.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          definition: { type: Type.STRING },
          phonetic: { type: Type.STRING },
          examples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                translation: { type: Type.STRING },
              },
              required: ['original', 'translation']
            },
          },
          usageNote: { type: Type.STRING },
        },
        required: ['definition', 'examples', 'usageNote', 'phonetic']
      },
    },
  });

  if (!response.text) throw new Error("No definition generated");
  const data = JSON.parse(response.text);
  
  return {
    term,
    nativeLanguage: nativeLang,
    targetLanguage: targetLang,
    definition: data.definition,
    phonetic: data.phonetic || '',
    examples: data.examples,
    usageNote: data.usageNote,
  };
};

export const generateImage = async (term: string): Promise<string | undefined> => {
  try {
    // Instructions say use gemini-2.5-flash-image for generation by default
    // Updated prompt for Junior High / Gen Z audience: Trendy, Relevant, Vibrant.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: `Design a cool, trendy, and vibrant 3D illustration for the concept of "${term}".
      
      Target Audience: Junior high school students (Gen Z).
      Style: High-quality 3D render, similar to modern animation or trendy digital art. Use bold, saturated colors (neon blues, hot pinks, bright yellows) and dynamic composition.
      
      CRITICAL: The image must be a DIRECT visual metaphor that clearly explains the meaning of "${term}". It should not just be abstract art; it must be educational but look like cool sticker art or a game asset.
      
      Background: Isolate on a clean, soft-colored background.`,
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.warn("Image generation failed", error);
    return undefined;
  }
  return undefined;
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
    // Strip HTML tags for speech generation to avoid pronouncing "b" or "bold"
    const cleanText = text.replace(/<[^>]*>/g, '');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore has a nice neutral tone
          },
        },
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("Speech generation failed", error);
    return undefined;
  }
};

export const generateStory = async (words: DictionaryEntry[], nativeLang: string, targetLang: string): Promise<string> => {
  const wordList = words.map(w => w.term).join(", ");
  const prompt = `
    Write a short, funny, and coherent story in ${targetLang} using the following words: [${wordList}].
    After every sentence, provide the translation in ${nativeLang} in parentheses.
    Keep it simple and helping for memorization.
    Do not use markdown formatting.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text || "Could not generate story.";
};

export const chatAboutWord = async (
  entry: DictionaryEntry,
  history: ChatMessage[],
  userMessage: string
): Promise<string> => {
  try {
    // 1. Define the System Instruction for the persona and context
    const systemInstruction = `
      You are a fun, friendly, and energetic language tutor named "Pop".
      Target Audience: Junior high school students. 
      Tone: Cool, encouraging, slightly slangy but educational. Use emojis! 🌟
      
      Current Topic: The user is asking about the word "${entry.term}" (Target Language: ${entry.targetLanguage}).
      Definition: ${entry.definition}
      Usage Note: ${entry.usageNote}
      
      Your Goal: Answer the user's question about grammar, usage, or nuance. 
      Language: Explain in ${entry.nativeLanguage} unless asked otherwise.
      Keep it short and punchy.
      
      Format:
      - Use Markdown to make it easy to read.
      - Use **bold** for key terms or emphasis.
      - Use lists (- item) if explaining multiple points.
    `;

    // 2. Construct Content Array for multi-turn chat
    // We limit history to the last 10 messages to avoid hitting payload limits (fixing RPC errors)
    const recentHistory = history.slice(-10);
    
    const contents = recentHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Append the current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    // 3. Call generateContent with systemInstruction and structured contents
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents, 
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I'm not sure how to answer that, but I'm listening! 🎧";
  } catch (e) {
    console.error("Chat error", e);
    return "Oops! My brain froze for a sec. 🧊 Try asking again!";
  }
};