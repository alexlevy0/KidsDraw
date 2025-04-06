import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { generateEnhancedImage } from '@/lib/stableDiffusion';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    console.log('Starting image generation process...');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
      console.log('Created uploads directory');
    }

    const data = await request.json();
    const { imageData, prompt } = data;
    
    if (!imageData) {
      console.error('No image data provided');
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    // Generate a unique ID for this generation
    const id = uuidv4();
    console.log(`Generated ID: ${id}`);
    const outputDir = path.join(uploadDir, id);
    
    // Create directory for this generation
    await mkdir(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);

    // Remove the data URL prefix to get base64 data
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const originalImagePath = path.join(outputDir, 'original.png');
    
    // Save the original image
    await writeFile(originalImagePath, Buffer.from(base64Data, 'base64'));
    console.log('Saved original image');
    
    // Add child-friendly terms to the prompt
    let enhancedPrompt = prompt || 'A colorful children\'s drawing';
    enhancedPrompt += ', colorful children\'s illustration, professional quality, vibrant colors';
    
    const negativePrompt = 'poor quality, blurry, distorted, scary, inappropriate';
    
    console.log(`Calling Stable Diffusion with prompt: ${enhancedPrompt.substring(0, 50)}...`);
    
    try {
      // Call Stable Diffusion API to generate the enhanced image
      const generatedImageUrl = await generateEnhancedImage(
        originalImagePath,
        enhancedPrompt,
        negativePrompt
      );
      
      console.log(`Generated image saved at: ${generatedImageUrl}`);
      
      // Save the results metadata
      const metadataPath = path.join(outputDir, 'metadata.json');
      const metadata = {
        id,
        original: `/uploads/${id}/original.png`,
        generated: `/uploads/${id}/generated.png`,
        prompt: enhancedPrompt,
        createdAt: new Date().toISOString(),
      };
      
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      console.log('Saved metadata');
      
      return NextResponse.json({ id });
    } catch (error) {
      console.error('Error in Stable Diffusion processing:', error);
      
      // Log error details for debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      
      // Create a fallback generated image (copy of original) for testing
      const fallbackPath = path.join(outputDir, 'generated.png');
      await fs.promises.copyFile(originalImagePath, fallbackPath);
      console.log('Created fallback image for testing');
      
      // Save metadata with error flag
      const metadataPath = path.join(outputDir, 'metadata.json');
      const metadata = {
        id,
        original: `/uploads/${id}/original.png`,
        generated: `/uploads/${id}/generated.png`,
        prompt: enhancedPrompt,
        createdAt: new Date().toISOString(),
        error: true,
        errorMessage: error instanceof Error 
          ? `Erreur de l'API: ${error.message}` 
          : 'Erreur lors de la génération avec Stable Diffusion - affichage de l\'image originale'
      };
      
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      
      // Return success with the ID but include error flag
      return NextResponse.json({ 
        id,
        error: true,
        message: 'Utilisation de l\'image de secours en raison d\'une erreur API'
      });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 