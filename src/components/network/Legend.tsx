import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Legend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Farben exakt wie in NetworkNode.tsx
  const colors = [
    { label: 'Instrumentell', color: 'bg-blue-500' },
    { label: 'Emotional', color: 'bg-red-500' },
    { label: 'Pflegerisch', color: 'bg-green-500' },
    { label: 'Finanziell', color: 'bg-yellow-500' },
  ];

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="absolute bottom-4 left-4 bg-white shadow-md hover:bg-slate-50 z-50 rounded-full h-10 w-10"
        onClick={() => setIsOpen(true)}
        title="Legende anzeigen"
      >
        <Info className="h-5 w-5 text-slate-600" />
      </Button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-50 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-slate-200 w-64 text-sm">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800">Legende</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 -mr-2 text-slate-400 hover:text-slate-700" 
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-5">
          
          {/* 1. Farben (Unterstützung) */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unterstützungsform</p>
            <div className="grid grid-cols-1 gap-2">
              {colors.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", c.color)} />
                  <span className="text-slate-600">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* 2. Ringe (Häufigkeit) */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Häufigkeit (Ringe)</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6">
                    {/* 3 Ringe Simulation */}
                    <div className="w-6 h-6 rounded-full border-2 border-slate-400 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-400 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full border-2 border-slate-400"></div>
                        </div>
                    </div>
                </div>
                <span className="text-slate-600">Täglich</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6">
                     {/* 2 Ringe Simulation */}
                     <div className="w-5 h-5 rounded-full border-2 border-slate-400 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full border-2 border-slate-400"></div>
                    </div>
                </div>
                <span className="text-slate-600">Mehrmals die Woche</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6">
                    {/* 1 Ring Simulation */}
                    <div className="w-4 h-4 rounded-full border-2 border-slate-400"></div>
                </div>
                <span className="text-slate-600">Mehrmals im Monat</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* 3. Symbole (Geschlecht) */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Geschlecht</p>
            <div className="flex justify-between px-2">
                <div className="flex flex-col items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 14 14" className="text-slate-600 stroke-current stroke-[1.5] fill-none">
                        <circle cx="5" cy="7" r="3.5" />
                        <line x1="7.5" y1="4.5" x2="10" y2="2" />
                        <polyline points="7 2 10 2 10 5" />
                    </svg>
                    <span className="text-[10px] text-slate-500">M</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 14 14" className="text-slate-600 stroke-current stroke-[1.5] fill-none">
                        <circle cx="6" cy="4" r="3.5" />
                        <line x1="6" y1="7.5" x2="6" y2="12" />
                        <line x1="3" y1="10" x2="9" y2="10" />
                    </svg>
                    <span className="text-[10px] text-slate-500">W</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 14 14" className="text-slate-600 stroke-current stroke-[1.5] fill-none">
                         <circle cx="7" cy="7" r="4" />
                         <circle cx="7" cy="7" r="1.5" className="fill-current" />
                    </svg>
                    <span className="text-[10px] text-slate-500">D</span>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
