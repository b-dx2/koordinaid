import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Alteri, Ego } from '@/types';
import { NetworkNode } from './NetworkNode';

interface NetworkGraphProps {
  ego: Ego;
  alteri: Alteri[];
  width?: number;
  height?: number;
}

// Konfiguration der Zonen (Wichtigkeit)
const ZONES = {
  high: { radius: 120, label: 'Wichtig' },
  medium: { radius: 220, label: 'Mittel' },
  low: { radius: 320, label: 'Weniger wichtig' },
};

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ 
  ego, 
  alteri, 
  width = 600, 
  height = 600 
}) => {
  // Wir speichern die simulierten Positionen im State, damit React sie rendern kann
  const [nodes, setNodes] = useState<(Alteri & { x: number; y: number })[]>([]);
  
  // D3 Simulation Referenz, damit wir sie stoppen können
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);

  const centerX = width / 2;
  const centerY = height / 2;

  useEffect(() => {
    // 1. Daten vorbereiten: Wir kopieren die Alteri, damit D3 sie mutieren kann (x, y hinzufügen)
    const simulationNodes = alteri.map(a => ({ ...a, x: centerX, y: centerY }));

    // 2. Die Simulation konfigurieren
    simulationRef.current = d3.forceSimulation(simulationNodes as any)
      .force('charge', d3.forceManyBody().strength(-50)) // Abstoßung
      .force('collide', d3.forceCollide().radius(45)) // Kollisionsschutz (Radius des Nodes + Puffer)
      .force('r', d3.forceRadial((d: any) => {
        // Hier ziehen wir die Nodes in ihre Zone
        switch (d.importance) {
          case 'high': return ZONES.high.radius / 2 + 40; // Nah am Zentrum
          case 'medium': return (ZONES.medium.radius + ZONES.high.radius) / 2;
          case 'low': return (ZONES.low.radius + ZONES.medium.radius) / 2;
          default: return 300;
        }
      }, centerX, centerY).strength(0.8))
      .on('tick', () => {
        // Bei jedem "Tick" der Physik-Engine updaten wir den React State
        setNodes([...simulationNodes] as any);
      });

    // Cleanup beim Unmount
    return () => {
      if (simulationRef.current) simulationRef.current.stop();
    };
  }, [alteri, width, height, centerX, centerY]);

  return (
    <div className="flex justify-center items-center w-full h-full bg-slate-50 overflow-hidden">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        
        {/* 1. Zonen-Kreise (Hintergrund) */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          {Object.entries(ZONES).reverse().map(([key, zone]) => (
            <g key={key}>
              <circle 
                r={zone.radius} 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
              <text 
                y={-zone.radius + 15} 
                textAnchor="middle" 
                className="text-xs text-slate-400 font-medium uppercase tracking-wider"
              >
                {zone.label}
              </text>
            </g>
          ))}
        </g>

        {/* 2. Verbindungslinien vom Zentrum zu den Nodes */}
        <g>
            {nodes.map((node) => (
                <line 
                    key={`link-${node.id}`}
                    x1={centerX}
                    y1={centerY}
                    x2={node.x}
                    y2={node.y}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    opacity="0.5"
                />
            ))}
        </g>

        {/* 3. Das Ego (Zentrum) */}
        <NetworkNode 
          data={ego} 
          x={centerX} 
          y={centerY} 
          radius={30} 
          isEgo={true} 
        />

        {/* 4. Die Alteri (Netzwerk) */}
        {nodes.map((node) => (
          <NetworkNode
            key={node.id}
            data={node}
            x={node.x}
            y={node.y}
            radius={25}
          />
        ))}

      </svg>
    </div>
  );
};
