"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Info, Trophy, Settings, Menu } from 'lucide-react';
import { VoiceAssessor } from '@/components/VoiceAssessor';
import { LessonSidebar } from '@/components/LessonSidebar';
import { INITIAL_DATA } from '@/lib/lessons';
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

  const handleSuccess = (score: number) => {
    setIsSuccess(true);
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.play();

    if (!completedLessonIds.includes(currentLessonId)) {
      const newCompleted = [...completedLessonIds, currentLessonId];
      setCompletedLessonIds(newCompleted);
      localStorage.setItem(`module_${id}_progress`, JSON.stringify(newCompleted));
    }
  };

  const handleContinue = () => {
    setIsSuccess(false);
    const currentIndex = moduleData.lessons.findIndex(l => l.id === currentLessonId);
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

        <div className="max-w-3xl mx-auto w-full px-6 py-8">
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
