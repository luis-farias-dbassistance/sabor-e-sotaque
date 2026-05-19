"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Save, Trash2, Globe } from 'lucide-react';

export default function ConfigPage() {
  const router = useRouter();
  const [newPhrase, setNewPhrase] = useState({
    moduleId: "1",
    phrase_pt: "",
    phrase_es: "",
    context: ""
  });

  const handleSave = () => {
    // In a real app, this would hit the API
    // For now, we'll simulate a save
    const customPhrases = JSON.parse(localStorage.getItem('custom_phrases') || '[]');
    const phraseWithId = {
      ...newPhrase,
      id: `custom-${Date.now()}`,
      imageUrl: "/images/hospitalidad.avif"
    };
    
    localStorage.setItem('custom_phrases', JSON.stringify([...customPhrases, phraseWithId]));
    
    alert("¡Frase guardada con éxito! (Simulado en DB)");
    setNewPhrase({
      moduleId: "1",
      phrase_pt: "",
      phrase_es: "",
      context: ""
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-sm">Volver</span>
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black tracking-tight">CONFIGURACIÓN</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Gestión de Contenido</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-8">
              <Plus className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-bold">Añadir Nueva Frase</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Módulo</label>
                <select 
                  value={newPhrase.moduleId}
                  onChange={(e) => setNewPhrase({...newPhrase, moduleId: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-colors appearance-none"
                >
                  <option value="1">Hospitalidad Cercana</option>
                  <option value="2">Maestría Parrillera</option>
                  <option value="3">Clásicos del Campo</option>
                  <option value="4">Sandwichería y Mar</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Frase en Portugués (Meta)</label>
                <textarea 
                  value={newPhrase.phrase_pt}
                  onChange={(e) => setNewPhrase({...newPhrase, phrase_pt: e.target.value})}
                  placeholder="Ej: Pode me trazer a conta, por favor?"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-colors h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Traducción al Español</label>
                <textarea 
                  value={newPhrase.phrase_es}
                  onChange={(e) => setNewPhrase({...newPhrase, phrase_es: e.target.value})}
                  placeholder="Ej: ¿Me puede traer la cuenta, por favor?"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-colors h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Contexto de Uso</label>
                <input 
                  type="text"
                  value={newPhrase.context}
                  onChange={(e) => setNewPhrase({...newPhrase, context: e.target.value})}
                  placeholder="Ej: Al finalizar el servicio."
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none transition-colors"
                />
              </div>

              <button 
                onClick={handleSave}
                className="w-full py-4 bg-amber-500 text-black font-black rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                GUARDAR EN BASE DE DATOS
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[2.5rem]">
              <Globe className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Instrucciones del Admin</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Asegúrate de que las frases en portugués utilicen un tono formal y profesional ("você", "o senhor"). El sistema de IA usará el texto exacto para evaluar la pronunciación del garzón.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem]">
              <h3 className="text-lg font-bold mb-4">Estado del Servidor</h3>
              <div className="flex items-center gap-2 text-emerald-500 text-sm mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Base de Datos PostgreSQL Conectada</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Frases Totales:</span>
                  <span className="text-white font-bold">40</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Módulos Activos:</span>
                  <span className="text-white font-bold">4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
