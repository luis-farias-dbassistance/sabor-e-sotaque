"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Info, Trophy, Settings, Menu } from 'lucide-react';
import { VoiceAssessor } from '@/components/VoiceAssessor';
import { LessonSidebar } from '@/components/LessonSidebar';
import { INITIAL_DATA } from '@/lib/lessons';
import { saveProgress, getUser } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function LessonClient() {
  const { id } = useParams();
  const router = useRouter();
  
  const moduleData = INITIAL_DATA[id as string] || INITIAL_DATA["1"];
  const [currentLessonId, setCurrentLessonId] = useState(moduleData.lessons[0].id);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const lesson = moduleData.lessons.find(l => l.id === currentLessonId) || moduleData.lessons[0];

  useEffect(() => {
    const saved = localStorage.getItem(`module_${id}_progress`);
    if (saved) {
      setCompletedLessonIds(JSON.parse(saved));
    }
  }, [id]);

  const handleSuccess = async (score: number) => {
    setIsSuccess(true);
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.play();

    if (!completedLessonIds.includes(currentLessonId)) {
      const newCompleted = [...completedLessonIds, currentLessonId];
      setCompletedLessonIds(newCompleted);
      localStorage.setItem(`module_${id}_progress`, JSON.stringify(newCompleted));
      
      const user = getUser();
      if (user && user.userId) {
        await saveProgress(user.userId, currentLessonId, id as string, Math.round(score * 100));
      }
    }
  };

  const currentIndex = moduleData.lessons.findIndex(l => l.id === currentLessonId);

  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      setIsSuccess(false);
      setCurrentLessonId(moduleData.lessons[currentIndex - 1].id);
    }
  };

  const handleNextLesson = () => {
    if (currentIndex < moduleData.lessons.length - 1) {
      setIsSuccess(false);
      setCurrentLessonId(moduleData.lessons[currentIndex + 1].id);
    }
  };

  const handleContinue = () => {
    setIsSuccess(false);
    if (currentIndex < moduleData.lessons.length - 1) {
      setCurrentLessonId(moduleData.lessons[currentIndex + 1].id);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <LessonSidebar 
        lessons={moduleData.lessons}
        currentLessonId={currentLessonId}
        completedLessonIds={completedLessonIds}
        onSelectLesson={(lessonId) => {
          setIsSuccess(false);
          setCurrentLessonId(lessonId);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-black relative">
        <div className="p-4 md:p-6 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-zinc-400 hover:text-white md:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => router.push('/')} className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest hidden xs:inline-block">Mapa</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest hidden sm:inline-block">de Sabores</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-right">
              <h2 className="text-xs md:text-sm font-black text-amber-500 uppercase tracking-tight">{moduleData.title}</h2>
              <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{moduleData.subtitle}</p>
            </div>
            <button 
              onClick={() => router.push('/config')}
              className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Settings className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto w-full px-6 py-8 relative min-h-[600px]">
          {/* Desktop Navigation Arrows (Float on the sides of the main content) */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrevLesson}
              className="absolute -left-14 xl:-left-24 lg:-left-20 top-1/3 -translate-y-1/2 p-4 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-full border border-zinc-800 hover:border-amber-500/50 hover:text-amber-500 transition-all duration-300 transform hover:scale-110 active:scale-95 z-20 shadow-2xl backdrop-blur-sm hidden md:flex items-center justify-center"
              aria-label="Lección anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          {currentIndex < moduleData.lessons.length - 1 && (
            <button
              onClick={handleNextLesson}
              className="absolute -right-14 xl:-right-24 lg:-right-20 top-1/3 -translate-y-1/2 p-4 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-full border border-zinc-800 hover:border-amber-500/50 hover:text-amber-500 transition-all duration-300 transform hover:scale-110 active:scale-95 z-20 shadow-2xl backdrop-blur-sm hidden md:flex items-center justify-center"
              aria-label="Siguiente lección"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentLessonId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl border border-zinc-800">
                <img 
                  src={lesson.imageUrl} 
                  alt={moduleData.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-start gap-3 text-zinc-300 bg-black/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-2xl">
                    <Info className="w-6 h-6 mt-1 shrink-0 text-amber-400" />
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest font-black mb-1">Contexto de Uso</p>
                      <p className="text-base italic leading-relaxed">{lesson.context}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile/Tablet navigation arrows (overlays on image sides) */}
                {currentIndex > 0 && (
                  <button
                    onClick={handlePrevLesson}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-zinc-900/80 text-white rounded-full border border-zinc-850 hover:border-amber-500/50 hover:text-amber-500 transition-all duration-300 transform active:scale-95 z-20 shadow-lg backdrop-blur-sm md:hidden flex items-center justify-center"
                    aria-label="Lección anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                {currentIndex < moduleData.lessons.length - 1 && (
                  <button
                    onClick={handleNextLesson}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-zinc-900/80 text-white rounded-full border border-zinc-850 hover:border-amber-500/50 hover:text-amber-500 transition-all duration-300 transform active:scale-95 z-20 shadow-lg backdrop-blur-sm md:hidden flex items-center justify-center"
                    aria-label="Siguiente lección"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-12 mb-16">
                <div className="text-center space-y-4">
                  <div className="inline-block px-4 py-1 bg-zinc-900 rounded-full border border-zinc-800">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black">Traducción al Español</p>
                  </div>
                  <p className="text-2xl text-zinc-300 font-medium tracking-tight">"{lesson.phrase_es}"</p>
                </div>
                
                <div className="text-center space-y-6">
                  <div className="inline-block px-4 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                    <p className="text-amber-500 text-[10px] uppercase tracking-[0.2em] font-black">Pronunciación en Portugués</p>
                  </div>
                  <h3 className="text-5xl font-black tracking-tighter leading-tight text-white px-4">
                    "{lesson.phrase_pt}"
                  </h3>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <VoiceAssessor 
                  key={lesson.id}
                  targetPhrase={lesson.phrase_pt}
                  onSuccess={handleSuccess}
                  onFailure={() => {}}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-amber-500/50 p-12 rounded-[4rem] text-center max-w-md w-full shadow-[0_0_100px_rgba(245,158,11,0.2)]"
            >
              <div className="w-28 h-28 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(245,158,11,0.5)]">
                <Trophy className="w-14 h-14 text-black" />
              </div>
              <h2 className="text-4xl font-black mb-4 text-white tracking-tighter">¡ESPECTACULAR!</h2>
              <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                Tu modulación fue exitosa. Has dominado esta frase con maestría profesional.
              </p>
              <button 
                onClick={handleContinue}
                className="w-full py-5 bg-amber-500 text-black font-black text-lg rounded-3xl hover:bg-amber-400 transition-all transform active:scale-95 shadow-xl shadow-amber-500/20"
              >
                CONTINUAR
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
