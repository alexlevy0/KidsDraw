import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/api/generate',
};

export default function middleware(request: NextRequest) {
  // Pour les requêtes POST vers /api/generate, nous allons permettre des requêtes plus grandes
  // Mais Next.js ne permet pas de configurer la taille des requêtes dans le middleware
  // Cela sera géré côté serveur dans la route API
  
  return NextResponse.next();
} 