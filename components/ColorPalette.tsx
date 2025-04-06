'use client';

import { HexColorPicker } from 'react-colorful';

const PRESET_COLORS = [
  '#FF0000', // Red
  '#FF9900', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#00FFFF', // Cyan
  '#0000FF', // Blue
  '#9900FF', // Purple
  '#FF00FF', // Pink
  '#000000', // Black
  '#FFFFFF', // White
];

interface ColorPaletteProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPalette({ color, onChange }: ColorPaletteProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Pick a Color:</h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              className={`w-8 h-8 rounded-full transition-transform ${
                color === presetColor ? 'scale-110 ring-2 ring-primary-500' : ''
              }`}
              style={{ backgroundColor: presetColor }}
              onClick={() => onChange(presetColor)}
              aria-label={`Select color ${presetColor}`}
            />
          ))}
        </div>
      </div>
      
      <div className="pt-2">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Custom Color:</h3>
        <div className="flex items-center space-x-4">
          <HexColorPicker
            color={color}
            onChange={onChange}
            style={{ width: '100%', height: '120px' }}
          />
          <div 
            className="w-8 h-8 rounded-full border border-gray-300" 
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
} 