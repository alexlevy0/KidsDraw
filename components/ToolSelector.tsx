'use client';

import { Pencil, Eraser } from 'lucide-react';

interface ToolSelectorProps {
  tool: 'brush' | 'eraser';
  onChangeTool: (tool: 'brush' | 'eraser') => void;
  brushSize: number;
  onChangeBrushSize: (size: number) => void;
}

export default function ToolSelector({
  tool,
  onChangeTool,
  brushSize,
  onChangeBrushSize,
}: ToolSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Choose Tool:</h3>
        <div className="flex space-x-2">
          <button
            className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
              tool === 'brush'
                ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onChangeTool('brush')}
            aria-label="Use brush tool"
          >
            <Pencil className="w-6 h-6" />
            <span className="ml-2">Draw</span>
          </button>
          
          <button
            className={`flex items-center justify-center p-2 rounded-lg transition-colors ${
              tool === 'eraser'
                ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onChangeTool('eraser')}
            aria-label="Use eraser tool"
          >
            <Eraser className="w-6 h-6" />
            <span className="ml-2">Erase</span>
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          {tool === 'brush' ? 'Brush Size:' : 'Eraser Size:'}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs">Small</span>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => onChangeBrushSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs">Large</span>
        </div>
        <div className="mt-2 flex justify-center">
          <div
            className="rounded-full bg-gray-800"
            style={{
              width: `${brushSize}px`,
              height: `${brushSize}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
} 