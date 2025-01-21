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
  onStart?: () => void;
  onEnd?: () => void;
  disabled?: boolean;
  language?: string;
  continuous?: boolean;
}

export interface VoiceCharacter {
  id: string;
  name: string;
  description: string;
  gender: 'female' | 'male';
  pitch: number;
  rate: number;
  lang: string;
}

export const VOICE_CHARACTERS: VoiceCharacter[] = [
  {
    id: 'default',
    name: '喵娘',
    description: '温柔可爱的猫娘声线',
    gender: 'female',
    pitch: 1.2,
    rate: 1.1,
    lang: 'zh-CN'
  },
  {
    id: 'loli',
    name: '萝莉',
    description: '活泼可爱的萝莉声线',
    gender: 'female',
    pitch: 1.4,
    rate: 1.2,
    lang: 'zh-CN'
  },
  {
    id: 'onee',
    name: '姐姐',
    description: '成熟温柔的姐姐声线',
    gender: 'female',
    pitch: 1.0,
    rate: 0.9,
    lang: 'zh-CN'
  },
  {
    id: 'tsundere',
    name: '傲娇',
    description: '傲娇可爱的少女声线',
    gender: 'female',
    pitch: 1.3,
    rate: 1.15,
    lang: 'zh-CN'
  }
]; 