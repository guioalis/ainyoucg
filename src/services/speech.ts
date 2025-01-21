export class SpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private speaking: boolean = false;

  constructor() {
    // 只在客户端初始化
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.initVoice();
    }
  }

  private initVoice() {
    if (!this.synthesis) return;
    
    // 等待voices加载
    if (this.synthesis.getVoices().length === 0) {
      this.synthesis.addEventListener('voiceschanged', () => {
        this.selectVoice();
      });
    } else {
      this.selectVoice();
    }
  }

  private selectVoice() {
    if (!this.synthesis) return;
    
    const voices = this.synthesis.getVoices();
    // 优先选择中文女声
    this.voice = voices.find(voice => 
      voice.lang.includes('zh') && voice.name.includes('Female')
    ) || voices.find(voice => 
      voice.lang.includes('zh')
    ) || voices[0];
  }

  speak(text: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
  } = {}) {
    if (!this.synthesis || !text) return;

    // 如果正在说话，先停止
    if (this.speaking) {
      this.stop();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.voice) {
      utterance.voice = this.voice;
    }

    // 设置语音参数
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // 添加事件监听
    utterance.onstart = () => {
      this.speaking = true;
      options.onStart?.();
    };

    utterance.onend = () => {
      this.speaking = false;
      options.onEnd?.();
    };

    utterance.onerror = (event) => {
      this.speaking = false;
      options.onError?.(event);
    };

    this.synthesis.speak(utterance);
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.speaking = false;
    }
  }

  isSpeaking() {
    return this.speaking;
  }
}

// 创建单例，但要确保在客户端
export const speechService = typeof window !== 'undefined' ? new SpeechService() : null; 