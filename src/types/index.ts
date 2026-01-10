// src/types/index.ts

export type Gender = 'male' | 'female' | 'diverse';

// Die Beziehungsarten
export type RelationType = 
  | 'partner' | 'child' | 'sibling' | 'friend' 
  | 'service' | 'pet' | 'other';

// Die Unterstützungsformen (bestimmen die Farben im Kreis-Rand)
export type SupportType = 
  | 'instrumental' | 'emotional' | 'nursing' | 'financial';

// Wichtigkeit (bestimmt die Nähe zum Zentrum)
export type Importance = 'high' | 'medium' | 'low';

// Häufigkeit (bestimmt die Anzahl der Ringe/Linien)
export type Frequency = 'daily' | 'weekly' | 'monthly';

// Alterskategorie für Unterstützer
export type AgeCategory = '16-40' | '41-60' | '61-80' | '80+';

// Das Ego (Die pflegebedürftige Person - Zentrum)
export interface Ego {
  acronym: string;
  age: string; // String, um leere Eingaben im Formular zu erlauben
  gender: Gender;
}

// Ein Alteri (Unterstützende Person)
export interface Alteri {
  id: string;       // Eindeutige ID (UUID) für React Keys und D3
  role: string;     // Laufende Nummer ("Person 1")
  acronym: string;
  gender: Gender;
  relation: RelationType;
  supportTypes: SupportType[]; // Array, da Mehrfachauswahl möglich!
  importance: Importance;
  ageCategory: AgeCategory;
  frequency: Frequency;
}

// Der gesamte Datensatz für die DB
export interface NetworkData {
  ego: Ego;
  alteri: Alteri[];
  meta: {
    satisfactionNetwork?: number; 
    satisfactionLife?: number;
    interviewer: string; // Wer hat erhoben?
    date: string;
  }
}
