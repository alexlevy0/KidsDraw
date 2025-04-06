import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Répondre avec l'image demandée
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; filename: string } }
) {
  try {
    const { id, filename } = params;
    
    // Vérifier les paramètres
    if (!id || !filename) {
      return new Response('ID ou nom de fichier manquant', { status: 400 });
    }
    
    // Déterminer si nous sommes sur Vercel
    const isVercel = process.env.VERCEL === '1';
    
    // Déterminer le chemin de l'image
    const baseDir = isVercel 
      ? path.join('/tmp', 'uploads')
      : path.join(process.cwd(), 'public', 'uploads');
    
    const imagePath = path.join(baseDir, id, filename);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(imagePath)) {
      console.error(`Image not found: ${imagePath}`);
      return new Response('Image non trouvée', { status: 404 });
    }
    
    // Lire l'image
    const imageBuffer = await fs.promises.readFile(imagePath);
    
    // Déterminer le type MIME
    let contentType = 'image/png';
    if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else if (filename.endsWith('.webp')) {
      contentType = 'image/webp';
    }
    
    // Renvoyer l'image
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new Response('Erreur lors de la récupération de l\'image', { status: 500 });
  }
} 