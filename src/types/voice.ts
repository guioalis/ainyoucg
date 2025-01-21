export enum VoiceState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR'
}

export interface VoiceError {
  name: string;
  message: string;
}

export interface VoiceRecognitionProps {
  onTranscript: (text: string) => void;
  onStateChange?: (state: VoiceState) => void;
  onError?: (error: VoiceError) => void;
  disabled?: boolean;
  language?: string;
} 