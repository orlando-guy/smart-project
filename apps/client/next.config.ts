import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // En production, si l'API est sur un sous-domaine différent, 
    // on peut souvent se passer du rewrite et appeler l'URL directe.
    // Mais pour garder la même structure de code (/api/...), voici l'approche :
    
    const API_URL = process.env.API_URL || 'http://localhost:4000';

    return [
      {
        // Toutes les requêtes vers /api/:path* seront redirigées
        source: '/api/:path*',
        // Vers le serveur Node.js
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
