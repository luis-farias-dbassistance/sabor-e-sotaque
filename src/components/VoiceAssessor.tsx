"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, CheckCircle, XCircle, Volume2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateSimilarity } from '@/lib/similarity';

interface VoiceAssessorProps {
  targetPhrase: string;
  onSuccess: (score: number) => void;
  onFailure: (score: number) => void;
}

export const VoiceAssessor: React.FC<VoiceAssessorProps> = ({ targetPhrase, onSuccess, onFailure }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load and listen to speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);


  // Pre-load audio from CDN (Polly-generated) on mount
  useEffect(() => {
    // Try to find the pre-generated audio file
    // The audio files are stored in S3 under /audio/{md5hash}.mp3
    // We'll try loading it; if it fails, we fall back to Web Speech API
    const loadAudio = async () => {
      try {
        // Try to fetch the audio manifest to find the right hash
        const manifestRes = await fetch('/audio/manifest.json');
        if (manifestRes.ok) {
          const manifestRaw = await manifestRes.json();
          // Support both legacy flat format and new {phrases, vocabulary} format
          const manifest = manifestRaw.phrases ?? manifestRaw;
          // Find the hash for our phrase
          const entry = Object.entries(manifest).find(
            ([, phrase]) => (phrase as string).toLowerCase().trim() === targetPhrase.toLowerCase().trim()
          );
          if (entry) {
            const audioUrl = `/audio/${entry[0]}.mp3`;
            const audioRes = await fetch(audioUrl, { method: 'HEAD' });
            if (audioRes.ok) {
              audioUrlRef.current = audioUrl;
              audioRef.current = new Audio(audioUrl);
              audioRef.current.preload = 'auto';
              setAudioReady(true);
              return;
            }
          }
        }
      } catch {
        // CDN audio not available, will use Web Speech API fallback
      }
      setAudioReady(false);
    };

    loadAudio();
  }, [targetPhrase]);

  // Setup speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
        
        const similarity = calculateSimilarity(result, targetPhrase);
        setScore(similarity);
        
        if (similarity >= 0.85) {
          onSuccess(similarity);
        } else {
          onFailure(similarity);
        }
        setIsRecording(false);
      };


      recognitionRef.current.onerror = (event: any) => {
        setError(event.error);
        setIsRecording(false);
      };
    } else {
      setError('Speech recognition not supported in this browser.');
    }
  }, [targetPhrase, onSuccess, onFailure]);

  const playReference = () => {
    setIsPlaying(true);

    if (audioReady && audioRef.current) {
      // Use pre-generated Polly audio (natural voice)
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        // Fallback to Web Speech API
        playWithWebSpeech();
      };
    } else {
      // Fallback: Web Speech API
      playWithWebSpeech();
    }
  };

  const playWithWebSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = 'pt-BR';
    
    // Sort and find the best available pt-BR voice
    const activeVoices = voices.length > 0 ? voices : (typeof window !== 'undefined' ? window.speechSynthesis.getVoices() : []);
    const ptVoices = activeVoices.filter(v => v.lang.toLowerCase().replace('_', '-') === 'pt-br' || v.lang.toLowerCase().startsWith('pt'));
    const bestVoice = ptVoices.sort((a, b) => {
      const aLang = a.lang.toLowerCase().replace('_', '-');
      const bLang = b.lang.toLowerCase().replace('_', '-');
      const aIsPtBr = aLang === 'pt-br';
      const bIsPtBr = bLang === 'pt-br';
      
      if (aIsPtBr && !bIsPtBr) return -1;
      if (!aIsPtBr && bIsPtBr) return 1;
      
      const aIsPremium = a.name.includes('Siri') || a.name.includes('Google') || a.name.includes('Natural') || a.name.includes('Premium');
      const bIsPremium = b.name.includes('Siri') || b.name.includes('Google') || b.name.includes('Natural') || b.name.includes('Premium');
      
      if (aIsPremium && !bIsPremium) return -1;
      if (!aIsPremium && bIsPremium) return 1;
      
      return 0;
    })[0];
    
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    
    utterance.rate = 0.95; // Slightly slower but not too slow (0.95 is more natural)
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setScore(null);
      setError(null);
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 backdrop-blur-xl">
      <div className="text-center">
        <p className="text-zinc-400 text-sm mb-2">
          {audioReady ? '🎙️ Voz natural (Polly)' : '🔊 Voz del sistema'}
        </p>
        <button 
          onClick={playReference}
          disabled={isPlaying}
          className={`p-4 rounded-full transition-all ${
            isPlaying 
              ? 'bg-amber-500/20 animate-pulse' 
              : 'bg-zinc-800 hover:bg-zinc-700'
          }`}
        >
          {isPlaying ? (
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          ) : (
            <Volume2 className="w-8 h-8 text-amber-400" />
          )}
        </button>
        {audioReady && (
          <p className="text-emerald-500/60 text-[10px] mt-2 uppercase tracking-widest font-bold">Audio HD</p>
        )}
      </div>

      <div className="relative">
        <AnimatePresence>
          {isRecording && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 bg-red-500/20 rounded-full -z-10 animate-pulse"
            />
          )}
        </AnimatePresence>
        
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-8 rounded-full transition-all transform active:scale-95 ${
            isRecording ? 'bg-red-500 text-white' : 'bg-amber-500 text-black hover:bg-amber-400'
          }`}
        >
          {isRecording ? <Square className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
        </button>
      </div>

      <div className="text-center min-h-[60px]">
        {isRecording && <p className="text-amber-400 animate-pulse">Escuchando...</p>}
        {transcript && (
          <div className="mt-2">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Tu pronunciación:</p>
            <p className="text-white text-lg font-medium">"{transcript}"</p>
          </div>
        )}
      </div>

      {score !== null && (
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`flex items-center gap-3 px-6 py-3 rounded-full ${
            score >= 0.85 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {score >= 0.85 ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-bold">{Math.round(score * 100)}% de precisión</span>
        </motion.div>
      )}

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};
