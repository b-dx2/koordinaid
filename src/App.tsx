import { useState, useEffect } from 'react'; // useEffect hinzufügen
import { NetworkGraph } from '@/components/network/NetworkGraph';
import { Questionnaire } from '@/components/questionnaire/Questionnaire';
import { supabase } from '@/lib/supabase'; // Supabase importieren
import { Legend } from '@/components/network/Legend';
import type { NetworkData } from '@/types';


const INITIAL_DATA: NetworkData = {
  ego: { acronym: '', age: '', gender: 'female' },
  alteri: [],
  meta: { interviewer: '', date: new Date().toISOString() }
};

function App() {
  const [data, setData] = useState<NetworkData>(INITIAL_DATA);
  const [session, setSession] = useState<any>(null); // Speichert den Login-Status

  // NEU: Beim Starten der App automatisch anonym einloggen
  useEffect(() => {
    const initAuth = async () => {
      // Prüfen, ob wir schon eingeloggt sind
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setSession(session);
      } else {
        // Wenn nicht, anonym einloggen
        const { data: { session }, error } = await supabase.auth.signInAnonymously();
        if (error) console.error('Login Fehler:', error);
        setSession(session);
      }
    };

    initAuth();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      
      {/* Linker Bereich (Graph) */}
      <div className="flex-grow relative border-r border-slate-200 bg-white shadow-sm transition-all duration-300">
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">KoordinAID</h1>
          <p className="text-sm text-slate-500">
            {session ? 'Online (Gesichert)' : 'Verbinde...'} 
          </p>
        </div>
        
        <div className="w-full h-full">
            <NetworkGraph 
                ego={data.ego} 
                alteri={data.alteri} 
                width={window.innerWidth * 0.66} 
                height={window.innerHeight}
            />
            <Legend />
        </div>
      </div>

      {/* Rechter Bereich (Formular) */}
      <div className="w-[450px] min-w-[350px] bg-slate-50 border-l shadow-xl z-20">
        <Questionnaire 
            data={data} 
            onChange={setData} 
        />
      </div>

    </div>
  );
}

export default App;
