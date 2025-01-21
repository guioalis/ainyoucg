/// <reference types="dom-speech-recognition" />

declare module 'next/font/google' {
  export interface FontOptions {
    subsets?: string[];
  }
  export function Inter(options: FontOptions): {
    className: string;
    style: { fontFamily: string };
  };
}

declare module 'next' {
  export interface Metadata {
    title?: string;
    description?: string;
  }
}

interface Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
  speechSynthesis: SpeechSynthesis;
}

interface SpeechSynthesisUtterance {
  voice: SpeechSynthesisVoice | null;
  volume: number;
  rate: number;
  pitch: number;
  text: string;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
}

interface SpeechSynthesis {
  speaking: boolean;
  paused: boolean;
  pending: boolean;
  getVoices(): SpeechSynthesisVoice[];
  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  pause(): void;
  resume(): void;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
}

interface SpeechSynthesisVoice {
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
} 