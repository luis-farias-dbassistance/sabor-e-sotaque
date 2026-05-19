"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, Star, BarChart3, Settings, LogOut, DownloadCloud, Wifi, WifiOff } from 'lucide-react';
import { getUser, logout } from '@/lib/api';

interface MapNode {
  id: number;
  title: string;
  status: 'completed' | 'current' | 'locked';
  imageUrl: string;
}

const NODES: MapNode[] = [
  { id: 1, title: 'Hospitalidad Cercana', status: 'completed', imageUrl: '/images/hospitalidad.avif' },
  { id: 2, title: 'Maestría Parrillera', status: 'current', imageUrl: '/images/parrilla.avif' },
  { id: 3, title: 'Clásicos del Campo', status: 'current', imageUrl: '/images/campo.avif' },
  { id: 4, title: 'Sandwichería y Mar', status: 'current', imageUrl: '/images/mar.avif' },
];

export const FlavorMap = () => {
  const user = getUser();
  
  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState('');
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isCached = localStorage.getItem('ss_assets_cached') === 'true';
      setIsOfflineReady(isCached);
      
      if (!isCached) {
        startOfflineSync();
      }
    }
  }, []);

  const startOfflineSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncStatus('Iniciando descarga de lecciones...');

    try {
      const assets: string[] = [
        '/images/hospitalidad.avif',
        '/images/parrilla.avif',
        '/images/campo.avif',
        '/images/mar.avif',
      ];

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
          // fetch and force cache
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

  return (
    <div className="relative min-h-screen py-20 px-6 flex flex-col items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="mb-12 text-center relative w-full max-w-md">
        <div className="absolute -top-10 right-0 flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
          <span className="text-amber-500 font-bold">5</span>
          <span className="text-zinc-400 text-xs uppercase tracking-tighter">Días de Racha</span>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">MAPA DE SABORES</h1>
        <p className="text-zinc-400 text-sm">Domina el arte de servir al turista brasileño</p>
      </header>

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

      <div className="relative flex flex-col gap-12 w-full max-w-md">
        {/* Connection line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500/50 via-zinc-800 to-zinc-900 -translate-x-1/2 -z-10" />

        {NODES.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className={`flex items-center gap-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse text-right'}`}
          >
            <Link 
              href={node.status === 'locked' ? '#' : `/lesson/${node.id}`}
              className={`group relative w-32 h-32 rounded-3xl overflow-hidden border-4 transition-all ${
                node.status === 'current' ? 'border-amber-500 scale-110 shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 
                node.status === 'completed' ? 'border-emerald-500' : 'border-zinc-800 grayscale'
              }`}
            >
              <img 
                src={node.imageUrl} 
                alt={node.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center">
                {node.status === 'locked' && <Lock className="text-white w-8 h-8 opacity-50" />}
                {node.status === 'completed' && <Check className="text-emerald-400 w-10 h-10 drop-shadow-lg" />}
                {node.status === 'current' && <Star className="text-amber-400 w-10 h-10 animate-pulse" />}
              </div>
            </Link>

            <div className="flex-1">
              <h3 className={`text-xl font-bold ${node.status === 'locked' ? 'text-zinc-600' : 'text-white'}`}>
                {node.title}
              </h3>
              <p className="text-zinc-500 text-sm">
                {node.status === 'locked' ? 'Nivel 2 requerido' : 'Módulo de aprendizaje'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-6 bg-zinc-900/80 rounded-3xl border border-zinc-800 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold border border-amber-500/20">
              AYUDANTE
            </span>
            <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs font-bold">
              LVL 1
            </span>
          </div>
          <div className="text-amber-500 font-black">120 PTS</div>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-amber-500" />
        </div>
        <p className="text-zinc-500 text-xs mt-3 text-center">Faltan 280 pts para el rango "Garçom"</p>
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
