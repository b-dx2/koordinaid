import React, { useMemo } from 'react';
import * as d3 from 'd3';
// FIX 1: "import type" verwenden
import type { Alteri, SupportType, Gender, Ego } from '@/types';

const SUPPORT_COLORS: Record<SupportType, string> = {
  instrumental: '#3b82f6',
  emotional: '#ef4444',
  nursing: '#22c55e',
  financial: '#eab308',
};

const RING_WIDTH = 3;
const RING_GAP = 2;

interface NetworkNodeProps {
  // FIX 2: Data kann Ego oder Alteri sein
  data: Alteri | Ego;
  radius: number;
  x: number;
  y: number;
  isEgo?: boolean;
}

export const NetworkNode: React.FC<NetworkNodeProps> = ({ 
  data, 
  radius, 
  x, 
  y,
  isEgo = false 
}) => {
  
  const ringCount = useMemo(() => {
    if (isEgo) return 1;
    // FIX 3: Wir wissen, wenn es nicht Ego ist, ist es Alteri.
    // Wir casten (data as Alteri), um auf .frequency zugreifen zu können.
    const freq = (data as Alteri).frequency;
    switch (freq) {
      case 'daily': return 3;
      case 'weekly': return 2;
      case 'monthly': return 1;
      default: return 1;
    }
  }, [data, isEgo]);

  const arcs = useMemo(() => {
    // Wenn Ego, simulieren wir einen grauen Ring
    if (isEgo) {
        const rings = [];
        const innerR = radius;
        const outerR = innerR + RING_WIDTH;
        const arcGenerator = d3.arc<any>()
            .innerRadius(innerR)
            .outerRadius(outerR)
            .startAngle(0)
            .endAngle(2 * Math.PI);
        
        rings.push([{
            path: arcGenerator(null) || '',
            color: '#94a3b8',
            key: 'ego-ring'
        }]);
        return rings;
    }

    // Ab hier behandeln wir es als Alteri
    const alteriData = data as Alteri;
    
    // FIX 4: Explizites Type-Casting für das Fallback-Array
    const types = alteriData.supportTypes.length > 0 
        ? alteriData.supportTypes 
        : ['instrumental'] as SupportType[]; 
    
    const pie = d3.pie<SupportType>()
      .value(1)
      .sort(null);

    const pieData = pie(types);
    const rings = [];

    for (let i = 0; i < ringCount; i++) {
      const innerR = radius + (i * (RING_WIDTH + RING_GAP));
      const outerR = innerR + RING_WIDTH;

      const arcGenerator = d3.arc<d3.PieArcDatum<SupportType>>()
        .innerRadius(innerR)
        .outerRadius(outerR);

      rings.push(
        pieData.map((d, index) => ({
          path: arcGenerator(d) || '',
          color: SUPPORT_COLORS[d.data] || '#94a3b8',
          key: `${i}-${index}`
        }))
      );
    }
    return rings;
  }, [data, radius, ringCount, isEgo]);

  const renderGenderIcon = (gender: Gender) => {
    // FIX 5: Unused variable 'iconSize' entfernt
    const yPos = -radius - (ringCount * (RING_WIDTH + RING_GAP)) - 8;
    
    switch (gender) {
      case 'female':
        return (
          <g transform={`translate(-6, ${yPos})`}>
            <circle cx="6" cy="4" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="6" y1="7.5" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" />
            <line x1="3" y1="10" x2="9" y2="10" stroke="currentColor" strokeWidth="1.5" />
          </g>
        );
      case 'male':
        return (
          <g transform={`translate(-6, ${yPos})`}>
            <circle cx="5" cy="7" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="7.5" y1="4.5" x2="10" y2="2" stroke="currentColor" strokeWidth="1.5" />
            <polyline points="7 2 10 2 10 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </g>
        );
      default:
        return (
          <g transform={`translate(-6, ${yPos})`}>
            <circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="6" cy="6" r="1.5" fill="currentColor" />
          </g>
        );
    }
  };

  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={radius} fill="white" />

      {arcs.map((ring, ringIndex) => (
        <g key={`ring-${ringIndex}`}>
          {ring.map((segment) => (
            <path
              key={segment.key}
              d={segment.path}
              fill={segment.color}
            />
          ))}
        </g>
      ))}

      <text
        dy=".35em"
        textAnchor="middle"
        className="text-xs font-bold fill-slate-700 pointer-events-none"
        style={{ fontSize: radius / 2 }}
      >
        {data.acronym.substring(0, 2).toUpperCase()}
      </text>

      <g className="text-slate-500">
        {renderGenderIcon(data.gender)}
      </g>

      {/* FIX 6: Unterscheidung zwischen Ego (age) und Alteri (ageCategory) */}
      <text
        y={radius + (ringCount * (RING_WIDTH + RING_GAP)) + 12}
        textAnchor="middle"
        className="text-[10px] fill-slate-500"
      >
        {isEgo ? (data as Ego).age : (data as Alteri).ageCategory}
      </text>
    </g>
  );
};
