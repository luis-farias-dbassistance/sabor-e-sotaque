"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Star, BarChart3, Settings, LogOut, DownloadCloud, Wifi, WifiOff } from 'lucide-react';
import { getUser, logout, getProgress, saveProgress } from '@/lib/api';
import { INITIAL_DATA } from '@/lib/lessons';

export const FlavorMap = () => {
  const user = getUser();
  
  // Tabs and categories
  const [activeCategory, setActiveCategory] = useState<'logistics' | 'adventure' | 'gastronomy'>('gastronomy');
  
  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState('');
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  // User stats state
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isCached = localStorage.getItem('ss_assets_cached') === 'true';
      setIsOfflineReady(isCached);
      
      if (!isCached) {
        startOfflineSync();
      }
      
      calculateUserStats();
      syncUserProgress();
    }
  }, [isSyncing]);

  const syncUserProgress = async () => {
    if (!user || !user.userId) return;
    
    try {
      const { progress } = await getProgress(user.userId);
      if (!progress) return;

      const backendCompleted: Record<string, string[]> = {};
      progress.forEach((p: any) => {
        if (p.completed) {
          if (!backendCompleted[p.moduleId]) backendCompleted[p.moduleId] = [];
          backendCompleted[p.moduleId].push(p.lessonId);
        }
      });

      for (const modId of Object.keys(INITIAL_DATA)) {
        const localKey = `module_${modId}_progress`;
        const localSaved = JSON.parse(localStorage.getItem(localKey) || '[]');
        const backendSaved = backendCompleted[modId] || [];

        const merged = Array.from(new Set([...localSaved, ...backendSaved]));
        if (merged.length > localSaved.length) {
          localStorage.setItem(localKey, JSON.stringify(merged));
        }

        const toUpload = localSaved.filter((id: string) => !backendSaved.includes(id));
        for (const lessonId of toUpload) {
          await saveProgress(user.userId, lessonId, modId, 100);
        }
      }
      
      calculateUserStats();
    } catch (err) {
      console.error('Failed to sync progress with DynamoDB', err);
    }
  };

  const calculateUserStats = () => {
    let completedCount = 0;
    const completedMods: string[] = [];
    
    Object.keys(INITIAL_DATA).forEach(modId => {
      const saved = localStorage.getItem(`module_${modId}_progress`);
      if (saved) {
        const completedLessons = JSON.parse(saved);
        completedCount += completedLessons.length;
        if (completedLessons.length === INITIAL_DATA[modId].lessons.length) {
          completedMods.push(modId);
        }
      }
    });

    setTotalCompleted(completedCount);
    setTotalPoints(completedCount * 50);
    setCompletedModuleIds(completedMods);
  };

  const startOfflineSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncStatus('Iniciando descarga de lecciones...');

    try {
      const assets: string[] = [];
      
      // Get all images from modules
      Object.values(INITIAL_DATA).forEach(mod => {
        mod.lessons.forEach(l => {
          if (!assets.includes(l.imageUrl)) {
            assets.push(l.imageUrl);
          }
        });
      });

      setSyncStatus('Buscando lista de audios...');
      setSyncProgress(10);
      
      // Get audio manifest
      const manifestRes = await fetch('/audio/manifest.json');
      if (manifestRes.ok) {
        const manifest = await manifestRes.json();
        const hashes = Object.keys(manifest);
        for (const hash of hashes) {
          assets.push(`/audio/${hash}.mp3`);
        }
      }

      setSyncStatus('Descargando recursos multimedia...');
      setSyncProgress(20);

      let loaded = 0;
      const total = assets.length;

      for (let i = 0; i < assets.length; i++) {
        const url = assets[i];
        try {
          await fetch(url, { cache: 'force-cache' });
        } catch (e) {
          console.warn('Failed to pre-cache:', url);
        }
        loaded++;
        const percent = Math.round(20 + (loaded / total) * 80);
        setSyncProgress(percent);
        setSyncStatus(`Descargando audios y guías (${loaded}/${total})...`);
      }

      localStorage.setItem('ss_assets_cached', 'true');
      setIsOfflineReady(true);
      setSyncStatus('¡Listo! Clases guardadas en el teléfono.');
      setTimeout(() => {
        setIsSyncing(false);
      }, 3000);
    } catch (err) {
      console.error('Offline sync error:', err);
      setSyncStatus('No se pudo completar la descarga completa.');
      setTimeout(() => {
        setIsSyncing(false);
      }, 3000);
    }
  };

  // Get active nodes based on category tab
  const activeModules = Object.values(INITIAL_DATA).filter(m => m.category === activeCategory);
  
  // Format nodes for active tab
  const nodes = activeModules.map((m) => {
    const isCompleted = completedModuleIds.includes(m.id);
    return {
      id: m.id,
      title: m.title,
      subtitle: m.subtitle,
      status: isCompleted ? 'completed' as const : 'current' as const,
      imageUrl: m.lessons[0]?.imageUrl || '/images/hospitalidad.avif'
    };
  });

  // Calculate Level and Rank details
  const getLevelDetails = () => {
    if (totalPoints >= 1500) {
      return { level: 3, label: 'ANFITRIÓN DE ORO', targetPts: 3000, nextLabel: 'MAESTRO SUPREMO' };
    }
    if (totalPoints >= 500) {
      return { level: 2, label: 'GARÇOM PRO', targetPts: 1500, nextLabel: 'ANFITRIÓN DE ORO' };
    }
    return { level: 1, label: 'AYUDANTE', targetPts: 500, nextLabel: 'GARÇOM PRO' };
  };

  const levelDetails = getLevelDetails();
  const progressPercent = Math.min(100, (totalPoints / levelDetails.targetPts) * 100);

  return (
    <div className="relative min-h-screen py-20 px-6 flex flex-col items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="mb-10 text-center relative w-full max-w-md">
        <div className="absolute -top-10 right-0 flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
          <span className="text-amber-500 font-bold">5</span>
          <span className="text-zinc-400 text-xs uppercase tracking-tighter">Días de Racha</span>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">SABORES & EXPERIENCIAS</h1>
        <p className="text-zinc-400 text-sm">Domina el servicio para el turista brasileño</p>
      </header>

      {/* Specialty Category Tabs */}
      <div className="w-full max-w-md mb-10 bg-zinc-900/60 p-1.5 rounded-2xl border border-zinc-800/80 flex gap-1">
        <button
          onClick={() => setActiveCategory('gastronomy')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            activeCategory === 'gastronomy'
              ? 'bg-amber-500 text-black shadow-lg font-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          🍽️ Sabores
        </button>
        <button
          onClick={() => setActiveCategory('logistics')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            activeCategory === 'logistics'
              ? 'bg-amber-500 text-black shadow-lg font-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          🏨 Logística
        </button>
        <button
          onClick={() => setActiveCategory('adventure')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            activeCategory === 'adventure'
              ? 'bg-amber-500 text-black shadow-lg font-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          🏔️ Aventura
        </button>
      </div>

      {/* Offline sync progress card */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: '2rem' }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="w-full max-w-md bg-zinc-900/90 border border-amber-500/30 p-5 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DownloadCloud className="w-5 h-5 text-amber-500 animate-bounce" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Guardando offline</span>
              </div>
              <span className="text-xs font-black text-amber-500">{syncProgress}%</span>
            </div>
            
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500" 
                style={{ width: `${syncProgress}%` }}
                layout
              />
            </div>
            <p className="text-zinc-400 text-xs truncate">{syncStatus}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Ready Status Badge */}
      {!isSyncing && (
        <div 
          onClick={startOfflineSync}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 cursor-pointer rounded-full border border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400 transition-colors"
        >
          {isOfflineReady ? (
            <>
              <Wifi className="w-4 h-4 text-emerald-500" />
              <span>Disponible 100% Offline (Recargar)</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-amber-500" />
              <span>Modo Offline No Preparado (Iniciar)</span>
            </>
          )}
        </div>
      )}

      {/* Vertical Map Path */}
      <div className="relative flex flex-col gap-12 w-full max-w-md">
        {/* Connection line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/50 via-zinc-800 to-zinc-900 -translate-x-1/2 -z-10" />

        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className={`flex items-center gap-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse text-right'}`}
          >
            <Link 
              href={`/lesson/${node.id}`}
              className={`group relative w-32 h-32 rounded-3xl overflow-hidden border-4 transition-all ${
                node.status === 'completed' ? 'border-emerald-500' : 'border-amber-500 scale-110 shadow-[0_0_30px_rgba(245,158,11,0.3)]'
              }`}
            >
              <img 
                src={node.imageUrl} 
                alt={node.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center">
                {node.status === 'completed' ? (
                  <Check className="text-emerald-400 w-10 h-10 drop-shadow-lg" />
                ) : (
                  <Star className="text-amber-400 w-10 h-10 animate-pulse" />
                )}
              </div>
            </Link>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-white leading-tight">
                {node.title}
              </h3>
              <p className="text-zinc-500 text-sm mt-1">
                {node.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progression level card */}
      <div className="mt-20 p-6 bg-zinc-900/80 rounded-3xl border border-zinc-800 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold border border-amber-500/20">
              {levelDetails.label}
            </span>
            <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs font-bold">
              LVL {levelDetails.level}
            </span>
          </div>
          <div className="text-amber-500 font-black">{totalPoints} PTS</div>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-zinc-500 text-xs mt-3 text-center">
          {totalPoints >= 3000 
            ? '¡Eres un Maestro Supremo de la hospitalidad!'
            : `Faltan ${levelDetails.targetPts - totalPoints} pts para el rango "${levelDetails.nextLabel}"`}
        </p>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8 flex gap-4 w-full max-w-md">
        <Link href="/analytics" className="flex-1 flex items-center justify-center gap-2 py-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 hover:border-amber-500/30 transition-colors">
          <BarChart3 className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Analytics</span>
        </Link>
        <Link href="/config" className="flex-1 flex items-center justify-center gap-2 py-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 hover:border-amber-500/30 transition-colors">
          <Settings className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Config</span>
        </Link>
        {user && (
          <button onClick={() => { logout(); window.location.href = '/login'; }} className="flex items-center justify-center gap-2 py-4 px-6 bg-zinc-900/80 rounded-2xl border border-zinc-800 hover:border-red-500/30 transition-colors">
            <LogOut className="w-4 h-4 text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
};
