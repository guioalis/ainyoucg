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