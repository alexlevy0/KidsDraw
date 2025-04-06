'use client';

import { useState } from 'react';
import Link from 'next/link';
import DrawingCanvas from '../components/DrawingCanvas';
import ColorPalette from '../components/ColorPalette';
import ToolSelector from '../components/ToolSelector';
import PromptInput from '../components/PromptInput';

export default function Home() {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(10);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageId, setGeneratedImageId] = useState<string | null>(null);

  const handleGenerate = async (imageData: string) => {
    try {
      setIsGenerating(true);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          prompt: prompt || 'A colorful children\'s drawing',
        }),
      });
      
      const data = await response.json();
      
      if (data.id) {
        setGeneratedImageId(data.id);
      }
    } catch (error) {
      console.error('Error generating the image:', error);
      alert('Oops! Something went wrong. Please try again!');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary-700 mb-2">KidsDraw AI</h1>
        <p className="text-lg text-gray-600">Draw something amazing and watch it transform by magic! ✨</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <DrawingCanvas 
              color={color}
              brushSize={brushSize}
              tool={tool}
              onGenerate={handleGenerate}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-xl font-bold text-primary-600 mb-4">Tools</h2>
            <div className="space-y-4">
              <ColorPalette 
                color={color} 
                onChange={setColor} 
              />
              
              <ToolSelector 
                tool={tool} 
                onChangeTool={setTool} 
                brushSize={brushSize}
                onChangeBrushSize={setBrushSize}
              />
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-bold text-primary-600 mb-4">Tell us about your drawing</h2>
            <PromptInput 
              value={prompt} 
              onChange={setPrompt} 
              onSubmit={() => {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                  handleGenerate(canvas.toDataURL('image/png'));
                }
              }}
              isLoading={isGenerating}
            />
          </div>
        </div>
      </div>

      {generatedImageId && (
        <div className="flex justify-center">
          <Link 
            href={`/results/${generatedImageId}`}
            className="btn btn-accent text-lg"
          >
            See Your Magic Transformation! ✨
          </Link>
        </div>
      )}
    </div>
  );
} 