import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Alteri, Gender, RelationType, SupportType, Importance, Frequency, AgeCategory } from '@/types';
import { cn } from '@/lib/utils'; // Hilfsfunktion von shadcn

interface AlteriFormProps {
  data: Alteri;
  onChange: (data: Alteri) => void;
  index: number;
}

export const AlteriForm: React.FC<AlteriFormProps> = ({ data, onChange, index }) => {

  const handleChange = (field: keyof Alteri, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Hilfsfunktion für Mehrfachauswahl (Support Types)
  const toggleSupport = (type: SupportType) => {
    const current = data.supportTypes;
    if (current.includes(type)) {
      handleChange('supportTypes', current.filter(t => t !== type));
    } else {
      handleChange('supportTypes', [...current, type]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Person {index + 1}</h2>
        <p className="text-sm text-slate-500">Details zur unterstützenden Person.</p>
      </div>

      {/* 1. Basisdaten */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Kürzel</Label>
          <Input 
            value={data.acronym} 
            onChange={(e) => handleChange('acronym', e.target.value)} 
            placeholder="XY"
            maxLength={4}
          />
        </div>
        <div className="space-y-2">
            <Label>Geschlecht</Label>
            <Select value={data.gender} onValueChange={(v) => handleChange('gender', v as Gender)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="female">Weiblich</SelectItem>
                    <SelectItem value="male">Männlich</SelectItem>
                    <SelectItem value="diverse">Divers</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* 2. Beziehung & Alter */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label>Beziehung</Label>
            <Select value={data.relation} onValueChange={(v) => handleChange('relation', v as RelationType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="partner">Partner:in</SelectItem>
                    <SelectItem value="child">Kind</SelectItem>
                    <SelectItem value="sibling">Geschwister</SelectItem>
                    <SelectItem value="friend">Bekannte/Freunde</SelectItem>
                    <SelectItem value="service">Dienstleister</SelectItem>
                    <SelectItem value="pet">Haustier</SelectItem>
                    <SelectItem value="other">Sonstiges</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label>Alter</Label>
            <Select value={data.ageCategory} onValueChange={(v) => handleChange('ageCategory', v as AgeCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="16-40">16 - 40</SelectItem>
                    <SelectItem value="41-60">41 - 60</SelectItem>
                    <SelectItem value="61-80">61 - 80</SelectItem>
                    <SelectItem value="80+">80+</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <Separator />

      {/* 3. Wichtigkeit (Nähe) */}
      <div className="space-y-3">
        <Label>Wie wichtig ist diese Person? (Nähe zum Zentrum)</Label>
        <div className="flex gap-2">
            {([['high', 'Sehr wichtig'], ['medium', 'Mittel'], ['low', 'Weniger']] as const).map(([val, label]) => (
                <Button
                    key={val}
                    type="button"
                    variant={data.importance === val ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => handleChange('importance', val as Importance)}
                >
                    {label}
                </Button>
            ))}
        </div>
      </div>

      {/* 4. Häufigkeit (Dicke der Linien) */}
      <div className="space-y-3">
        <Label>Wie häufig ist der Kontakt?</Label>
        <RadioGroup value={data.frequency} onValueChange={(v) => handleChange('frequency', v as Frequency)} className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="flex-1 cursor-pointer">Täglich <span className="text-slate-400 text-xs">(3 Ringe)</span></Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="flex-1 cursor-pointer">Mehrmals die Woche <span className="text-slate-400 text-xs">(2 Ringe)</span></Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50 cursor-pointer">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="flex-1 cursor-pointer">Mehrmals im Monat <span className="text-slate-400 text-xs">(1 Ring)</span></Label>
            </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* 5. Unterstützungsformen (Farben) */}
      <div className="space-y-3">
        <Label>Welche Unterstützung leistet die Person? (Mehrfachwahl)</Label>
        <div className="grid grid-cols-2 gap-3">
            {[
                { id: 'instrumental', label: 'Instrumentell', color: 'bg-blue-500' },
                { id: 'emotional', label: 'Emotional', color: 'bg-red-500' },
                { id: 'nursing', label: 'Pflegerisch', color: 'bg-green-500' },
                { id: 'financial', label: 'Finanziell', color: 'bg-yellow-500' },
            ].map((type) => {
                const isSelected = data.supportTypes.includes(type.id as SupportType);
                return (
                    <div 
                        key={type.id}
                        onClick={() => toggleSupport(type.id as SupportType)}
                        className={cn(
                            "cursor-pointer border rounded-md p-3 flex items-center gap-3 transition-all",
                            isSelected ? "border-slate-800 bg-slate-50 ring-1 ring-slate-800" : "border-slate-200 hover:border-slate-300"
                        )}
                    >
                        <div className={`w-3 h-3 rounded-full ${type.color}`} />
                        <span className="text-sm font-medium">{type.label}</span>
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};
