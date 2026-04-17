'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MASIVE_DATA } from '@/lib/constants';
import { MasivKey, AltitudineType } from '@/types/weather';

export default function Home() {
  const router = useRouter();
  const [masiv, setMasiv] = useState<MasivKey>('bucegi');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [altitudine, setAltitudine] = useState<AltitudineType>('peste');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/meteo/${masiv}/${date}?alt=${altitudine}`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-light mb-1">🏔️ Factori Meteo</h1>
          <p className="text-sm opacity-60">MergLaMunte.ro - Verifică condițiile meteo pentru drumeții</p>
        </div>

        {/* Form Card */}
        <div className="weather-card rounded-3xl p-5 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {/* Masiv Selection */}
              <div>
                <label className="block text-xs md:text-[0.8125rem] font-medium uppercase tracking-wide opacity-60 mb-2">
                  Masiv Montan
                </label>
                <select
                  value={masiv}
                  onChange={(e) => setMasiv(e.target.value as MasivKey)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  {Object.entries(MASIVE_DATA).map(([key, data]) => (
                    <option key={key} value={key} className="bg-slate-800">
                      {data.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs md:text-[0.8125rem] font-medium uppercase tracking-wide opacity-60 mb-2">
                  Data Drumeției
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              {/* Altitudine */}
              <div>
                <label className="block text-xs md:text-[0.8125rem] font-medium uppercase tracking-wide opacity-60 mb-2">
                  Nivel Altitudine
                </label>
                <select
                  value={altitudine}
                  onChange={(e) => setAltitudine(e.target.value as AltitudineType)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="sub" className="bg-slate-800">Sub prag (în pădure)</option>
                  <option value="peste" className="bg-slate-800">Peste prag (gol alpin)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium py-3 px-6 rounded-2xl transition-all border border-white/30"
            >
              Verifică Meteo
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="weather-card rounded-3xl p-5">
          <h2 className="text-xl font-medium mb-3">Despre aplicație</h2>
          <p className="text-sm opacity-80 leading-relaxed mb-3">
            Această aplicație îți oferă o analiză detaliată a factorilor meteo care pot influența drumeția ta în munți.
            Verifică condițiile de vânt, temperatură, precipitații, risc de avalanșă și multe altele.
          </p>
          <p className="text-xs opacity-60">
            Surse date: Meteoblue API, Buletin Nivologic ANM
          </p>
        </div>
      </div>
    </div>
  );
}

