'use client';

import { useState } from 'react';
import { VOICE_CHARACTERS, VoiceCharacter } from '@/types/voice';

interface VoiceCharacterSelectProps {
  value: string;
  onChange: (character: VoiceCharacter) => void;
}

export default function VoiceCharacterSelect({
  value,
  onChange
}: VoiceCharacterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCharacter = VOICE_CHARACTERS.find(c => c.id === value) || VOICE_CHARACTERS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-50 hover:bg-pink-100 
                 dark:bg-pink-900/20 dark:hover:bg-pink-900/30 transition-colors duration-200"
      >
        <span className="text-pink-600 dark:text-pink-300">{selectedCharacter.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 w-48 bg-white dark:bg-gray-800 
                      rounded-lg shadow-lg overflow-hidden z-50">
          {VOICE_CHARACTERS.map(character => (
            <button
              key={character.id}
              onClick={() => {
                onChange(character);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-pink-50 dark:hover:bg-pink-900/20
                        ${character.id === value ? 'bg-pink-100 dark:bg-pink-900/30' : ''}
                        transition-colors duration-200`}
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {character.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {character.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 