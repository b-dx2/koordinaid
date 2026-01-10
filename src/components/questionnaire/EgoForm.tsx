import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Ego, Gender } from '@/types';

interface EgoFormProps {
  data: Ego;
  onChange: (data: Ego) => void;
}

export const EgoForm: React.FC<EgoFormProps> = ({ data, onChange }) => {
  
  const handleChange = (field: keyof Ego, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Die pflegebedürftige Person</h2>
        <p className="text-sm text-slate-500">Bitte geben Sie zunächst die Daten für das Zentrum des Netzwerks ein.</p>
      </div>

      <div className="space-y-4">
        {/* Akronym */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="acronym">Kürzel / Akronym</Label>
          <Input 
            id="acronym" 
            placeholder="z.B. ME" 
            value={data.acronym}
            maxLength={4}
            onChange={(e) => handleChange('acronym', e.target.value)}
          />
        </div>

        {/* Alter */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="age">Alter</Label>
          <Input 
            id="age" 
            type="number" 
            placeholder="Jahre" 
            value={data.age}
            onChange={(e) => handleChange('age', e.target.value)}
          />
        </div>

        {/* Geschlecht */}
        <div className="space-y-2">
          <Label>Geschlecht</Label>
          <RadioGroup 
            value={data.gender} 
            onValueChange={(val) => handleChange('gender', val as Gender)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="g-female" />
              <Label htmlFor="g-female">Weiblich</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="g-male" />
              <Label htmlFor="g-male">Männlich</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="diverse" id="g-diverse" />
              <Label htmlFor="g-diverse">Divers</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
