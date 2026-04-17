'use client';

import React, { useState } from 'react';
import { NarrativeSection } from '@/types/weather';

interface NarrativeSummaryProps {
    sections: NarrativeSection[];
    dangerousSections: NarrativeSection[];
    safeSections: NarrativeSection[];
    overallVerdict: string;
    verdictColor: string;
}

export function NarrativeSummary({
    sections,
    dangerousSections,
    safeSections,
    overallVerdict,
    verdictColor
}: NarrativeSummaryProps) {
    const [showAll, setShowAll] = useState(false);

    const visibleSections = dangerousSections.length > 0 ? dangerousSections : safeSections.slice(0, 3);
    const hiddenSections = dangerousSections.length > 0 ? safeSections : safeSections.slice(3);

    return (
        <div>
            <div className="flex items-baseline gap-2 mb-4">
                <h3 className="text-lg md:text-xl font-medium text-white">Rezumat meteo:</h3>
                <span className={`text-base md:text-lg font-medium ${verdictColor}`}>
                    {overallVerdict}
                </span>
            </div>

            {visibleSections.map((section, idx) => (
                <div
                    key={idx}
                    className={`${idx < visibleSections.length - 1 ? 'border-b border-white/10 pb-4 mb-4' : ''}`}
                >
                    <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                        {section.label}
                    </div>
                    <div className={`text-sm md:text-base font-medium mb-1 severity-${section.severity}`}>
                        {section.value}
                    </div>
                    <div className="text-sm text-slate-300 opacity-80">
                        {section.impact}
                    </div>
                </div>
            ))}

            {hiddenSections.length > 0 && (
                <>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="w-full text-left py-2 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                        <span>{showAll ? 'Ascunde' : 'Vezi toți factorii'}</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showAll && (
                        <div className="mt-3">
                            {hiddenSections.map((section, idx) => (
                                <div
                                    key={idx}
                                    className={`${idx < hiddenSections.length - 1 ? 'border-b border-white/10 pb-4 mb-4' : ''}`}
                                >
                                    <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                                        {section.label}
                                    </div>
                                    <div className={`text-sm md:text-base font-medium mb-1 severity-${section.severity}`}>
                                        {section.value}
                                    </div>
                                    <div className="text-sm text-slate-300 opacity-80">
                                        {section.impact}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
