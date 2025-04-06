'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ResultsProps {
  params: {
    id: string;
  };
}

interface ResultImages {
  original: string;
  generated: string;
  prompt: string;
  error?: boolean;
  errorMessage?: string;
  originalImage?: string;
  generatedImage?: string;
}

export default function Results({ params }: ResultsProps) {
  const [images, setImages] = useState<ResultImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/results/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        
        const data = await response.json();
        
        if (data.originalImage && data.generatedImage) {
          setImages({
            ...data,
            original: data.originalImage,
            generated: data.generatedImage
          });
        } else {
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        setError('Oops! We couldn\'t find your creation. Please try again!');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [params.id]);

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-bounce-slow text-6xl mb-4">✨</div>
        <h2 className="text-2xl font-bold text-primary-600">Creating magic...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-2xl font-bold text-accent-600 mb-4">{error}</h2>
        <Link href="/" className="btn btn-primary">
          Try Again
        </Link>
      </div>
    );
  }

  if (!images) {
    return null;
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary-700 mb-2">Your Magic Drawing</h1>
        <p className="text-lg text-gray-600">Look at how your drawing transformed! ✨</p>
        {images.prompt && (
          <p className="mt-2 text-gray-500 italic">"{images.prompt}"</p>
        )}
        {images.error && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
            <p className="font-bold mb-1">⚠️ API Notice</p>
            <p>{images.errorMessage || "The AI transformation couldn't be completed, showing your original drawing instead."}</p>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card flex flex-col items-center">
          <h2 className="text-xl font-bold text-accent-600 mb-4">Your Original Drawing</h2>
          <div className="relative w-full aspect-square">
            {images.original.startsWith('data:image') ? (
              <img 
                src={images.original} 
                alt="Original drawing"
                className="object-contain w-full h-full"
              />
            ) : (
              <Image 
                src={images.original} 
                alt="Original drawing"
                fill
                className="object-contain"
              />
            )}
          </div>
          <button 
            className="btn btn-secondary mt-4"
            onClick={() => handleDownload(images.original, 'my-drawing.png')}
          >
            Download Original
          </button>
        </div>

        <div className="card flex flex-col items-center">
          <h2 className="text-xl font-bold text-primary-600 mb-4">The Magic Version</h2>
          <div className="relative w-full aspect-square">
            {images.generated.startsWith('data:image') ? (
              <img 
                src={images.generated} 
                alt="AI generated image"
                className="object-contain w-full h-full"
              />
            ) : (
              <Image 
                src={images.generated} 
                alt="AI generated image"
                fill
                className="object-contain"
              />
            )}
          </div>
          <button 
            className="btn btn-accent mt-4"
            onClick={() => handleDownload(images.generated, 'my-magic-drawing.png')}
          >
            Download Magic Version
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <Link href="/" className="btn btn-primary text-lg">
          Create Another Drawing
        </Link>
      </div>
    </div>
  );
} 