import { createClient } from '@supabase/supabase-js'

// Wir nutzen import.meta.env für Vite Umgebungsvariablen
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Kleiner Schutz, damit die App lokal nicht abstürzt, wenn Keys fehlen
if (!supabaseUrl || !supabaseAnonKey) {
  console.log('Hinweis: Supabase Keys fehlen noch in der .env Datei. Datenbank-Features sind deaktiviert.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
)
