import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NetworkData } from '@/types';

interface MetaFormProps {
  data: NetworkData;
  onChange: (data: NetworkData) => void;
}

export const MetaForm: React.FC<MetaFormProps> = ({ data, onChange }) => {
  
  const updateMeta = (field: string, value: any) => {
    onChange({
      ...data,
      meta: { ...data.meta, [field]: value }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Abschluss</h2>
        <p className="text-sm text-slate-500">Bitte beantworten Sie noch diese abschließenden Fragen.</p>
      </div>

      {/* BLOCK A: Zufriedenheit */}
      <div className="space-y-6 border-b pb-6">
        <h3 className="font-medium text-slate-900">Block A: Zufriedenheit</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Wie zufrieden sind Sie mit Ihrem Unterstützernetzwerk?</Label>
              <span className="text-sm font-bold text-slate-600">{data.meta.satisfactionNetwork || 0}/10</span>
            </div>
            <Slider 
              defaultValue={[data.meta.satisfactionNetwork || 0]} 
              max={10} 
              step={1} 
              onValueChange={(vals) => updateMeta('satisfactionNetwork', vals[0])}
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Gar nicht</span>
              <span>Sehr zufrieden</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Wie zufrieden sind Sie mit Ihrem Leben allgemein?</Label>
              <span className="text-sm font-bold text-slate-600">{data.meta.satisfactionLife || 0}/10</span>
            </div>
            <Slider 
              defaultValue={[data.meta.satisfactionLife || 0]} 
              max={10} 
              step={1} 
              onValueChange={(vals) => updateMeta('satisfactionLife', vals[0])}
            />
             <div className="flex justify-between text-xs text-slate-400">
              <span>Gar nicht</span>
              <span>Sehr zufrieden</span>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK B: Erhebungskontext */}
      <div className="space-y-6">
        <h3 className="font-medium text-slate-900">Block B: Erhebung</h3>

        <div className="space-y-3">
          <Label>Wer hat das Netzwerk erhoben?</Label>
          <Select 
            value={data.meta.interviewer} 
            onValueChange={(val) => updateMeta('interviewer', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Bitte wählen..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self">Person mit Unterstützungsbedarf (Selbst)</SelectItem>
              <SelectItem value="professional">Pflegeberatung / Profi</SelectItem>
              <SelectItem value="relative">Angehörige/r (nicht im Netzwerk)</SelectItem>
              {/* Wir listen auch die Personen aus dem Netzwerk auf */}
              {data.alteri.map((p) => (
                <SelectItem key={p.id} value={`network_${p.id}`}>
                  {p.role} ({p.acronym})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Freitextfeld falls "Sonstige" oder Name gewünscht */}
        {data.meta.interviewer === 'professional' && (
             <div className="space-y-2">
                <Label>Name der Beratungsperson (Optional)</Label>
                <Input placeholder="Name eingeben" onChange={(e) => updateMeta('interviewerName', e.target.value)} />
             </div>
        )}

        <div className="flex items-center space-x-2 border p-4 rounded-md bg-slate-50">
          <Checkbox 
            id="consultation" 
            onCheckedChange={(checked) => updateMeta('isConsultation', checked)}
          />
          <Label htmlFor="consultation" className="cursor-pointer">
            Fand die Erhebung im Rahmen einer Pflegeberatung statt?
          </Label>
        </div>
      </div>
    </div>
  );
};
