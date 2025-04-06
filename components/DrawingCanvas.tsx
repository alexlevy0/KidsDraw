'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

interface DrawingCanvasProps {
  color: string;
  brushSize: number;
  tool: 'brush' | 'eraser';
  onGenerate: (imageData: string) => void;
}

export default function DrawingCanvas({ 
  color, 
  brushSize, 
  tool,
  onGenerate 
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasInitialized, setCanvasInitialized] = useState(false);

  // Initialize the canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: 600,
        height: 600,
        backgroundColor: 'white',
      });

      fabricCanvasRef.current = canvas;
      
      // Set brush
      const freeDrawingBrush = new fabric.PencilBrush(canvas);
      freeDrawingBrush.color = color;
      freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush = freeDrawingBrush;
      
      setCanvasInitialized(true);
    }

    // Cleanup on unmount
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // Update the brush when color or size changes
  useEffect(() => {
    if (fabricCanvasRef.current && canvasInitialized) {
      const canvas = fabricCanvasRef.current;
      
      // Set brush properties
      if (tool === 'brush') {
        canvas.freeDrawingBrush.color = color;
      } else if (tool === 'eraser') {
        canvas.freeDrawingBrush.color = 'white';
      }
      
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [color, brushSize, tool, canvasInitialized]);

  // Handler to clear the canvas
  const handleClear = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = 'white';
      fabricCanvasRef.current.renderAll();
    }
  };

  // Handler to generate image
  const handleGenerate = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1
      });
      onGenerate(dataURL);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative border-4 border-primary-200 rounded-xl overflow-hidden shadow-lg mb-4 bg-white"
        style={{ width: 600, height: 600 }}
      >
        <canvas ref={canvasRef} />
        {isDrawing && (
          <div className="absolute top-2 right-2 bg-primary-100 text-primary-800 px-2 py-1 rounded-lg text-sm">
            Drawing...
          </div>
        )}
      </div>
      <div className="flex space-x-4">
        <button 
          className="btn btn-secondary"
          onClick={handleClear}
        >
          Clear Canvas
        </button>
        <button 
          className="btn btn-accent"
          onClick={handleGenerate}
        >
          Transform by Magic ✨
        </button>
      </div>
    </div>
  );
} 