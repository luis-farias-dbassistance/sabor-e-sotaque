"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, signup } from '@/lib/api';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signup(email, password, name);
        await login(email, password);
      } else {
        await login(email, password);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
      // If API is down, allow offline access
      if (!navigator.onLine) {
        localStorage.setItem('ss_user', JSON.stringify({ name: name || email, email, userId: 'offline' }));
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineAccess = () => {
    localStorage.setItem('ss_user', JSON.stringify({ 
      name: 'Mesero Invitado', 
      email: 'guest@saborsotaque.app', 
      userId: 'guest_offline' 
    }));
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
            SABOR<span className="text-amber-500"> &</span> SOTAQUE
          </h1>
          <p className="text-zinc-500 text-sm uppercase tracking-[0.3em] font-bold">
            Entrenamiento para Meseros
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[3rem] backdrop-blur-xl space-y-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isSignup ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>

          {isSignup && (
            <div>
              <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-colors"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mesero@restaurante.cl"
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-colors"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-500 text-black font-black rounded-xl hover:bg-amber-400 transition-all disabled:opacity-50 text-lg"
          >
            {loading ? 'CONECTANDO...' : isSignup ? 'REGISTRARSE' : 'ENTRAR'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-zinc-500 text-sm hover:text-amber-500 transition-colors"
            >
              {isSignup ? '¿Ya tienes cuenta? Inicia sesión' : '¿Primera vez? Crea tu cuenta'}
            </button>
          </div>
        </form>

        {/* Offline fallback */}
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={handleOfflineAccess}
            className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors uppercase tracking-widest font-bold"
          >
            Continuar sin conexión →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
