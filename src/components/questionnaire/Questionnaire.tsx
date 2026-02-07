import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EgoForm } from './EgoForm';
import { AlteriForm } from './AlteriForm';
import { MetaForm } from './MetaForm';
import type { NetworkData, Alteri } from '@/types';
import { Plus, Trash2, Save, CheckCircle2, ChevronRight } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface QuestionnaireProps {
  data: NetworkData;
  onChange: (data: NetworkData) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ data, onChange }) => {
  // -1 = Ego, 0-9 = Alteri, 999 = Meta/Abschluss
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isSaving, setIsSaving] = useState(false);

  const handleEgoChange = (newEgo: any) => {
    onChange({ ...data, ego: newEgo });
  };

  const handleAlteriChange = (index: number, newAlteri: Alteri) => {
    const newList = [...data.alteri];
    newList[index] = newAlteri;
    onChange({ ...data, alteri: newList });
  };

  const addPerson = () => {
    if (data.alteri.length >= 10) return;
    
    const newPerson: Alteri = {
      id: generateId(),
      role: `Person ${data.alteri.length + 1}`,
      acronym: '',
      gender: 'female',
      relation: 'friend',
      supportTypes: [],
      importance: 'medium',
      ageCategory: '41-60',
      frequency: 'weekly'
    };

    onChange({ ...data, alteri: [...data.alteri, newPerson] });
    setCurrentStep(data.alteri.length); 
  };

  const removePerson = (index: number) => {
    const newList = data.alteri.filter((_, i) => i !== index);
    onChange({ ...data, alteri: newList });
    if (currentStep >= newList.length) {
        setCurrentStep(newList.length - 1);
    }
  };

    const handleSave = async () => {
    setIsSaving(true);
    try {
      // ALT (Supabase):
      // const { error } = await supabase.from('surveys').insert(...)

      // NEU (Neon via Vercel API):
      const response = await fetch('/api/save-network', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ network_data: data }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Senden an den Server');
      }

      // Umami Tracking (bleibt gleich)
      if (window.umami) {
        window.umami.track('Netzwerk gespeichert', {
          personCount: data.alteri.length,
          interviewer: data.meta.interviewer || 'unknown'
        });
      }

      alert('Netzwerk erfolgreich in Neon gespeichert!');
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Speichern.');
    } finally {
      setIsSaving(false);
    }
  };


  // Hilfsfunktion für den "Weiter"-Button Logik
  const handleNext = () => {
    // Von Ego zu Person 1 (oder erstellen)
    if (currentStep === -1) {
        if (data.alteri.length === 0) addPerson();
        else setCurrentStep(0);
        return;
    }
    
    // Innerhalb der Personenliste
    if (currentStep < data.alteri.length - 1) {
        setCurrentStep(prev => prev + 1);
    } else {
        // Wenn wir bei der letzten Person sind -> Zum Abschluss
        setCurrentStep(999);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* HEADER */}
      <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 max-w-[70%] no-scrollbar items-center">
            <Button 
                variant={currentStep === -1 ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setCurrentStep(-1)}
            >
                Ego
            </Button>
            {data.alteri.map((_, idx) => (
                <Button
                    key={idx}
                    variant={currentStep === idx ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentStep(idx)}
                >
                    {idx + 1}
                </Button>
            ))}
            
            <div className="h-4 w-px bg-slate-300 mx-1" />
            <Button
                variant={currentStep === 999 ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentStep(999)}
                className={currentStep === 999 ? "bg-green-600 hover:bg-green-700 text-white" : "text-slate-500"}
            >
                <CheckCircle2 className="w-4 h-4" />
            </Button>
        </div>

        <Button onClick={addPerson} size="sm" variant="outline" disabled={data.alteri.length >= 10}>
            <Plus className="w-4 h-4 mr-2" /> Person
        </Button>
      </div>

      {/* CONTENT */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-sm border">
            
            {currentStep === -1 && (
                <EgoForm data={data.ego} onChange={handleEgoChange} />
            )}

            {currentStep >= 0 && currentStep < 999 && data.alteri[currentStep] && (
                <>
                    <div className="flex justify-end mb-4">
                        <Button variant="destructive" size="sm" onClick={() => removePerson(currentStep)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Löschen
                        </Button>
                    </div>
                    <AlteriForm 
                        index={currentStep}
                        data={data.alteri[currentStep]} 
                        onChange={(newData) => handleAlteriChange(currentStep, newData)} 
                    />
                </>
            )}

            {currentStep === 999 && (
                <MetaForm data={data} onChange={onChange} />
            )}

            {/* NEUER NAVIGATION FOOTER */}
             {/* NAVIGATION FOOTER */}
            <div className="mt-8 pt-6 border-t flex flex-col gap-4">
                
                {/* SZENARIO 1: Wir sind bei der LETZTEN Person (und noch nicht voll) */}
                {currentStep === data.alteri.length - 1 && currentStep < 9 && (
                    <div className="flex flex-col gap-2">
                        {/* Primäre Aktion: Loop fortsetzen */}
                        <Button 
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm py-6 text-base"
                            onClick={addPerson}
                        >
                            <Plus className="w-5 h-5 mr-2" /> Weitere Person hinzufügen
                        </Button>

                        {/* Sekundäre Aktionen: Navigation */}
                        <div className="flex justify-between items-center px-1 mt-1">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="text-slate-400 hover:text-slate-700"
                            >
                                Zurück
                            </Button>
                            
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setCurrentStep(999)}
                                className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            >
                                Zum Abschluss <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* SZENARIO 2: Alle anderen Fälle (Ego, Mittendrin, Voll, Meta) */}
                {!(currentStep === data.alteri.length - 1 && currentStep < 9) && (
                    <div className="flex justify-between items-center">
                        {/* Links: Zurück */}
                        <Button 
                            variant="ghost" 
                            disabled={currentStep === -1}
                            onClick={() => {
                                if (currentStep === 999) setCurrentStep(data.alteri.length - 1);
                                else setCurrentStep(prev => prev - 1);
                            }}
                        >
                            Zurück
                        </Button>

                        {/* Rechts: Aktion */}
                        {currentStep === 999 ? (
                            // Im Abschluss: Speichern
                            <Button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="bg-green-600 hover:bg-green-700 text-white shadow-md px-8"
                            >
                                <Save className="w-4 h-4 mr-2" /> 
                                {isSaving ? '...' : 'Netzwerk Speichern'}
                            </Button>
                        ) : (
                            // Sonst: Weiter
                            <Button onClick={handleNext}>
                                {currentStep === data.alteri.length - 1 ? 'Zum Abschluss' : 'Weiter'} 
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
      </ScrollArea>
    </div>
  );
};
