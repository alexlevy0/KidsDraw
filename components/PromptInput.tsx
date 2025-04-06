'use client';

import { useState } from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

// Example prompts to help children describe their drawings
const EXAMPLE_PROMPTS = [
  'a happy unicorn in a magical forest',
  'a brave astronaut on the moon',
  'a fierce dragon guarding a castle',
  'a friendly alien visiting Earth',
  'a superhero saving the day',
  'a colorful underwater scene with fish',
];

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  isLoading
}: PromptInputProps) {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className="space-y-3">
      <div>
        <label 
          htmlFor="prompt" 
          className="block text-sm font-medium text-gray-600 mb-1"
        >
          What did you draw? Tell us about your picture!
        </label>
        <textarea
          id="prompt"
          rows={3}
          placeholder="Example: I drew a cat playing with a ball of yarn..."
          className="input w-full text-base resize-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="text-sm text-primary-600 hover:text-primary-800 underline"
        onClick={() => setShowExamples(!showExamples)}
      >
        {showExamples ? 'Hide examples' : 'Show me some examples!'}
      </button>

      {showExamples && (
        <div className="bg-primary-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-600 mb-2">Examples you can try:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onChange(prompt)}
                className="text-xs bg-white rounded-full px-2 py-1 border border-primary-200 hover:bg-primary-100 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className={`btn btn-primary w-full ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <span className="animate-pulse">Creating Magic...</span>
            <span className="ml-2 animate-spin">✨</span>
          </>
        ) : (
          'Transform My Drawing! ✨'
        )}
      </button>
    </div>
  );
} 