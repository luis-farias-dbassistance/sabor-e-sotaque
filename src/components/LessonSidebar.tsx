"use client";

import React from 'react';
import { CheckCircle, Circle, Play, X } from 'lucide-react';
import { Lesson } from '@/lib/lessons';

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  completedLessonIds: string[];
  onSelectLesson: (lessonId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({ 
  lessons, 
  currentLessonId, 
  completedLessonIds, 
  onSelectLesson,
  isOpen = false,
  onClose
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex
      `}>
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <div>
            <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Lecciones del Módulo</h2>
            <p className="text-white text-sm mt-1">{completedLessonIds.length} de {lessons.length} completadas</p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-zinc-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {lessons.map((lesson, index) => {
            const isSelected = lesson.id === currentLessonId;
            const isCompleted = completedLessonIds.includes(lesson.id);
            
            return (
              <button
                key={lesson.id}
                onClick={() => {
                  onSelectLesson(lesson.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                  isSelected 
                    ? 'bg-amber-500/10 border border-amber-500/30' 
                    : 'bg-zinc-900/50 border border-transparent hover:bg-zinc-900'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : isSelected ? (
                    <Play className="w-5 h-5 text-amber-500 animate-pulse" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-700" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${isSelected ? 'text-amber-500' : 'text-zinc-500'}`}>
                    FRASE {index + 1}
                  </p>
                  <p className={`text-sm truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                    {lesson.phrase_es}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

