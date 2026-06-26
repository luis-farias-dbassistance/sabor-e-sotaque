"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Volume2, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_DATA, VocabularyItem } from '@/lib/lessons';

interface Props {
  moduleId: string;
}

export default function VocabClient({ moduleId }: Props) {
  const router = useRouter();
  const moduleData = INITIAL_DATA[moduleId];
  const vocabulary: VocabularyItem[] = moduleData?.vocabulary ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState(0);

  const isSecure = moduleData?.category === 'security';
  const currentWord = vocabulary[currentIndex];

  // Redirect if no vocabulary
  useEffect(() => {
    if (!moduleData || !moduleData.vocabulary || moduleData.vocabulary.length === 0) {
      router.replace(`/lesson/${moduleId}`);
    }
  }, [moduleId, moduleData, router]);

  // Mark vocab as seen when reaching last word
  useEffect(() => {
    if (currentIndex === vocabulary.length - 1 && moduleData?.id) {
      localStorage.setItem(`module_${moduleData.id}_vocab_seen`, 'true');
    }
  }, [currentIndex, vocabulary.length, moduleData?.id]);

  const playWithWebSpeech = () => {
    if (!currentWord) return;
    const utterance = new SpeechSynthesisUtterance(currentWord.word_pt);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.toLowerCase().startsWith('pt'));
    if (ptVoice) utterance.voice = ptVoice;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const playAudio = async () => {
    if (!currentWord || isPlaying) return;
    setIsPlaying(true);
    try {
      const manifestRes = await fetch('/audio/manifest.json?v=' + Date.now());
      if (manifestRes.ok) {
        const manifestRaw = await manifestRes.json();
        const vocabManifest = manifestRaw.vocabulary;
        if (vocabManifest?.[moduleId]?.[currentWord.word_pt]) {
          const audioUrl = vocabManifest[moduleId][currentWord.word_pt];
          const audio = new Audio(audioUrl);
          audio.onended = () => setIsPlaying(false);
          audio.onerror = (e) => {
            console.warn("Vocab Polly playback error:", e);
            playWithWebSpeech();
          };
          await audio.play().catch(e => {
            console.warn("Vocab Polly playback failed:", e);
            playWithWebSpeech();
          });
          return;
        }
      }
    } catch { /* fall through */ }
    playWithWebSpeech();
  };

  const goNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setDirection(1);
      setCurrentIndex(i => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(i => i - 1);
    }
  };

  if (!moduleData || !vocabulary.length) return null;

  const accentColor = isSecure
    ? { bg: 'bg-red-600', text: 'text-red-400', border: 'border-red-700', glow: 'shadow-red-900/50', light: 'bg-red-950/40 border-red-800/50' }
    : { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500', glow: 'shadow-amber-500/20', light: 'bg-amber-500/10 border-amber-500/20' };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-zinc-900">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Volver</span>
        </button>
        <div className="text-right">
          <h2 className={`text-xs font-black uppercase tracking-tight ${accentColor.text}`}>{moduleData.title}</h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Vocabulario</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-zinc-900">
        <motion.div
          className={`h-full ${accentColor.bg}`}
          animate={{ width: `${((currentIndex + 1) / vocabulary.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-lg mx-auto w-full">

        {/* Counter */}
        <div className={`mb-8 px-4 py-1.5 rounded-full border ${accentColor.light} flex items-center gap-2`}>
          <BookOpen className={`w-3.5 h-3.5 ${accentColor.text}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${accentColor.text}`}>
            {currentIndex + 1} / {vocabulary.length} palabras
          </span>
        </div>

        {/* Flashcard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`w-full bg-zinc-900/80 border ${isSecure ? 'border-red-800/40' : 'border-zinc-800'} rounded-[2.5rem] p-10 text-center relative backdrop-blur-xl shadow-2xl`}
          >
            {/* Audio button */}
            <button
              onClick={playAudio}
              disabled={isPlaying}
              className={`absolute top-6 right-6 p-3 rounded-2xl transition-all ${
                isPlaying ? `${accentColor.light} animate-pulse` : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              {isPlaying
                ? <Loader2 className={`w-5 h-5 ${accentColor.text} animate-spin`} />
                : <Volume2 className={`w-5 h-5 ${accentColor.text}`} />}
            </button>

            {/* Portuguese word */}
            <div className={`inline-block px-3 py-1 rounded-full border ${accentColor.light} mb-6`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${accentColor.text}`}>Portugués</p>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-10 leading-tight">
              {currentWord.word_pt}
            </h1>

            <div className="w-16 h-px bg-zinc-700 mx-auto mb-8" />

            <div className="inline-block px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700 mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Español</p>
            </div>
            <p className="text-2xl text-zinc-300 font-medium tracking-tight">
              {currentWord.word_es}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-6 mt-10">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 disabled:opacity-30 hover:bg-zinc-800 transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2">
            {vocabulary.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                className={`rounded-full transition-all ${
                  i === currentIndex ? `w-5 h-2 ${accentColor.bg}`
                    : i < currentIndex ? 'w-2 h-2 bg-emerald-500'
                    : 'w-2 h-2 bg-zinc-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentIndex === vocabulary.length - 1}
            className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 disabled:opacity-30 hover:bg-zinc-800 transition-all active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* CTA: start lessons */}
        <AnimatePresence>
          {currentIndex === vocabulary.length - 1 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => router.push(`/lesson/${moduleId}`)}
              className={`mt-10 w-full py-5 ${accentColor.bg} ${isSecure ? 'text-white' : 'text-black'} font-black text-lg rounded-3xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl`}
            >
              Comenzar lecciones
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
