import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';

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
    
    const metadataPath = path.join(
      process.cwd(),
      'public',
      'uploads',
      id,
      'metadata.json'
    );
    
    // Check if metadata file exists
    if (!fs.existsSync(metadataPath)) {
      return NextResponse.json(
        { error: 'Results not found' },
        { status: 404 }
      );
    }
    
    // Read metadata file
    const metadataContent = await readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);
    
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