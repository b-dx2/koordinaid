// api/save-network.js
import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  // 1. Nur POST-Anfragen erlauben
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Verbindung zu Neon aufbauen
    // Wir holen den Connection String aus den Environment Variables
    const sql = neon(process.env.DATABASE_URL);

    // 3. Daten aus dem Request holen
    const { network_data } = request.body;

    if (!network_data) {
      return response.status(400).json({ error: 'No data provided' });
    }

    // 4. In die Datenbank schreiben
    // Wir nutzen SQL Template Strings - das ist sicher gegen SQL Injection
    await sql`
      INSERT INTO surveys (network_data)
      VALUES (${network_data})
    `;

    // 5. Erfolg melden
    return response.status(200).json({ success: true });

  } catch (error) {
    console.error('Database Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
