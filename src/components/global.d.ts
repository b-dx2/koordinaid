// Erweitert das globale Window-Objekt
interface Window {
  umami?: {
    track: (eventName: string, data?: Record<string, any>) => void;
  };
}
