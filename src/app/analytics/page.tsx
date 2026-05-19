"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BarChart3, Users, Award, TrendingUp, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const TEAM_STATS = [
  { id: 1, name: "Cristian Morales", rank: "Maître Bilingüe", completion: 95, accuracy: 88, streak: 12, avatar: "CM" },
  { id: 2, name: "Valentina Soto", rank: "Garçom Pro", completion: 72, accuracy: 82, streak: 5, avatar: "VS" },
  { id: 3, name: "Andrés Silva", rank: "Garçom Pro", completion: 68, accuracy: 79, streak: 8, avatar: "AS" },
  { id: 4, name: "Javiera Paz", rank: "Ayudante", completion: 34, accuracy: 75, streak: 2, avatar: "JP" },
  { id: 5, name: "Roberto Díaz", rank: "Ayudante", completion: 21, accuracy: 70, streak: 1, avatar: "RD" },
];

const MODULE_PERFORMANCE = [
  { name: "Hospitalidad", progress: 85 },
  { name: "Maestría Parrillera", progress: 64 },
  { name: "Clásicos del Campo", progress: 42 },
  { name: "Sandwichería", progress: 28 },
];

export default function AnalyticsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-sm">Volver</span>
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black tracking-tight">ANALYTICS</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Dashboard de Gestión</p>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Usuarios Activos", value: "24", icon: Users, color: "text-amber-500" },
            { label: "Precisión Media", value: "81%", icon: Award, color: "text-emerald-500" },
            { label: "Lecciones Hoy", value: "142", icon: BarChart3, color: "text-blue-500" },
            { label: "Tasa de Retención", value: "92%", icon: TrendingUp, color: "text-purple-500" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Progress Table */}
          <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">Rendimiento del Equipo</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input 
                  type="text" 
                  placeholder="Buscar mesero..." 
                  className="bg-black border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-xs outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 text-[10px] font-black uppercase tracking-widest border-b border-zinc-900">
                    <th className="px-8 py-4">Mesero</th>
                    <th className="px-8 py-4">Rango</th>
                    <th className="px-8 py-4">Progreso</th>
                    <th className="px-8 py-4">Precisión</th>
                    <th className="px-8 py-4">Racha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {TEAM_STATS.map((member) => (
                    <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-amber-500 border border-zinc-700">
                            {member.avatar}
                          </div>
                          <span className="font-bold text-sm">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                          member.rank === 'Maître Bilingüe' ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {member.rank}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full max-w-[80px] overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${member.completion}%` }} />
                          </div>
                          <span className="text-xs font-bold">{member.completion}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-emerald-500">{member.accuracy}%</span>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold">{member.streak}🔥</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Module Performance Charts */}
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem]">
              <h3 className="text-lg font-bold mb-8">Efectividad por Módulo</h3>
              <div className="space-y-8">
                {MODULE_PERFORMANCE.map((mod, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-zinc-400 uppercase tracking-widest">{mod.name}</span>
                      <span className="text-white">{mod.progress}%</span>
                    </div>
                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${mod.progress}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-[2.5rem]">
              <h3 className="text-lg font-bold mb-4">Meta Mensual</h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                El equipo ha alcanzado el 78% de la meta de capacitación para la temporada alta de turistas brasileños.
              </p>
              <button className="w-full py-4 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-colors text-sm">
                DESCARGAR REPORTE PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
