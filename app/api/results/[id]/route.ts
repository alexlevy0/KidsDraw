import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';

// Déterminer si nous sommes sur Vercel
const isVercel = process.env.VERCEL === '1';

// Déterminer le chemin de base
const getBaseDir = () => {
  return isVercel 
    ? path.join('/tmp', 'uploads')
    : path.join(process.cwd(), 'public', 'uploads');
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'No ID provided' },
        { status: 400 }
      );
    }
    
    const baseDir = getBaseDir();
    const metadataPath = path.join(baseDir, id, 'metadata.json');
    
    // Check if metadata file exists
    if (!fs.existsSync(metadataPath)) {
      console.error(`Metadata not found: ${metadataPath}`);
      return NextResponse.json(
        { error: 'Results not found' },
        { status: 404 }
      );
    }
    
    // Read metadata file
    const metadataContent = await readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);
    
    // Sur Vercel, nous devons également lire les images et les renvoyer en base64
    if (isVercel) {
      try {
        const originalImagePath = path.join(baseDir, id, 'original.png');
        const generatedImagePath = path.join(baseDir, id, 'generated.png');
        
        if (fs.existsSync(originalImagePath) && fs.existsSync(generatedImagePath)) {
          const originalImageBuffer = await fs.promises.readFile(originalImagePath);
          const generatedImageBuffer = await fs.promises.readFile(generatedImagePath);
          
          // Ajouter les images en base64 au résultat
          metadata.originalImage = `data:image/png;base64,${originalImageBuffer.toString('base64')}`;
          metadata.generatedImage = `data:image/png;base64,${generatedImageBuffer.toString('base64')}`;
        }
      } catch (e) {
        console.error('Error reading image files:', e);
        // Continuer même si les images ne peuvent pas être lues
        // Les URLs seront toujours présentes
      }
    }
    
    // Return metadata
    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
} 