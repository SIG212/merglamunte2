import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOUNTAINS } from '../data/mountains';

export default function SelectionPage() {
    const navigate = useNavigate();
    const [selectedMountainId, setSelectedMountainId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [altitude, setAltitude] = useState(2000);

    const selectedMountain = MOUNTAINS.find(m => m.id === selectedMountainId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMountainId) return;

        const params = new URLSearchParams({
            mountain: selectedMountainId,
            date,
            altitude: altitude.toString()
        });

        navigate(`/forecast?${params.toString()}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 bg-white text-slate-900 font-sans">
            <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <mlm-header></mlm-header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Mountain Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold uppercase tracking-widest text-slate-500 ml-1">Masiv Montan</label>
                        <select
                            value={selectedMountainId}
                            onChange={(e) => setSelectedMountainId(e.target.value)}
                            required
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-slate-100"
                        >
                            <option value="" disabled>Alege un munte...</option>
                            {MOUNTAINS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-widest text-slate-500 ml-1">Perioada</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all cursor-pointer hover:bg-slate-100"
                            />
                        </div>

                        {/* Altitude Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-widest text-slate-500 ml-1 flex justify-between">
                                Altitudine <span>{altitude}m</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max={selectedMountain?.maxAltitude || 2500}
                                step="100"
                                value={altitude}
                                onChange={(e) => setAltitude(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-xs text-slate-600 px-1">
                                <span>0m</span>
                                <span>{selectedMountain?.maxAltitude || 2500}m</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!selectedMountainId}
                        className="w-full group bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 py-4 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-emerald-600/20"
                    >
                        <span className="font-bold text-lg tracking-tight">Vezi Prognoza</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </form>
            </div>
            <mlm-footer></mlm-footer>
        </div>
    );
}
