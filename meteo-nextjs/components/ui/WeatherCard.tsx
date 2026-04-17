import React from 'react';

interface WeatherCardProps {
    title: string;
    value: string | number;
    unit?: string;
    status?: {
        color: 'red' | 'yellow' | 'green';
        message: string;
    };
    icon?: string;
    children?: React.ReactNode;
}

export function WeatherCard({ title, value, unit, status, icon, children }: WeatherCardProps) {
    return (
        <div
            className="group relative overflow-hidden weather-card rounded-bento p-5 md:p-6 bg-white/15 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/20 hover:-translate-y-1.5 hover:shadow-xl"
            data-status={status?.color}
        >
            {icon && (
                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-7xl opacity-10 -rotate-12 pointer-events-none group-hover:opacity-20 transition-opacity">
                    {icon}
                </span>
            )}
            <div className="flex items-center gap-2 mb-3 relative z-10">
                {icon && <span className="material-symbols-outlined text-base md:text-lg opacity-80">{icon}</span>}
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                    {title}
                </p>
            </div>

            <div className="flex items-baseline mb-2 relative z-10">
                <span className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                    {value}
                </span>
                {unit && (
                    <span className="text-2xl md:text-3xl font-medium opacity-70 ml-1">
                        {unit}
                    </span>
                )}
            </div>

            {status && (
                <div className="relative z-10">
                    <div className={`h-[3px] rounded-full mt-2 mb-3 status-bar-${status.color}`} />
                    <p className={`text-sm font-medium leading-snug opacity-90 status-text-${status.color}`}>
                        {status.message}
                    </p>
                </div>
            )}

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

interface SimpleCardProps {
    title: string;
    value: string;
    icon?: string;
    additionalInfo?: string;
}

export function SimpleCard({ title, value, icon, additionalInfo }: SimpleCardProps) {
    return (
        <div className="group relative overflow-hidden weather-card rounded-bento p-5 md:p-6 bg-white/15 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/20 hover:-translate-y-1.5 hover:shadow-xl">
            {icon && (
                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-7xl opacity-10 -rotate-12 pointer-events-none group-hover:opacity-20 transition-opacity">
                    {icon}
                </span>
            )}
            <div className="flex items-center gap-2 mb-3 relative z-10">
                {icon && <span className="material-symbols-outlined text-base md:text-lg opacity-80">{icon}</span>}
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                    {title}
                </p>
            </div>

            <div className="mb-2 relative z-10">
                <span className="text-3xl md:text-4xl font-black leading-tight tracking-tight">{value}</span>
            </div>

            {additionalInfo && (
                <p className="text-sm font-medium opacity-75 leading-snug relative z-10">
                    {additionalInfo}
                </p>
            )}
        </div>
    );
}
