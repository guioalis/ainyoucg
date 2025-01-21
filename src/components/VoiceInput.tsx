'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { FaMicrophone, FaStop, FaSpinner } from 'react-icons/fa';
import { VoiceState, VoiceError, VoiceRecognitionProps } from '@/types/voice';

export default function VoiceInput({
  onTranscript,
  onStateChange,
  onError,
  disabled = false,
  language = 'zh-CN'
}: VoiceRecognitionProps) {
  const [state, setState] = useState<VoiceState>(VoiceState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const updateState = (newState: VoiceState) => {
    setState(newState);
    onStateChange?.(newState);
  };

  const handleError = (error: VoiceError) => {
    setErrorMsg(error.message);
    updateState(VoiceState.ERROR);
    onError?.(error);
    stopRecording();
  };

  const startRecording = useCallback(() => {
    if (disabled) return;

    try {
      if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        throw new Error('您的浏览器不支持语音输入喵~');
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = language;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        updateState(VoiceState.LISTENING);
        // 添加超时处理
        timeoutRef.current = setTimeout(() => {
          if (state === VoiceState.LISTENING) {
            handleError({ name: 'Timeout', message: '没有听到声音喵~' });
          }
        }, 10000);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        if (event.results[0].isFinal) {
          onTranscript(transcript);
          stopRecording();
        }
      };

      recognition.onerror = (event) => {
        handleError({
          name: event.error,
          message: getErrorMessage(event.error)
        });
      };

      recognition.onend = () => {
        if (state === VoiceState.LISTENING) {
          updateState(VoiceState.IDLE);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;

    } catch (error) {
      handleError({
        name: 'InitError',
        message: error instanceof Error ? error.message : '语音初始化失败喵~'
      });
    }
  }, [disabled, language, onTranscript, state]);

  const stopRecording = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    updateState(VoiceState.IDLE);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const getErrorMessage = (error: string): string => {
    const errorMessages: Record<string, string> = {
      'no-speech': '没有检测到声音喵~',
      'audio-capture': '没有找到麦克风设备喵~',
      'not-allowed': '请允许使用麦克风喵~',
      'network': '网络连接出错了喵~',
      'aborted': '录音被中断了喵~',
      'default': '出现未知错误了喵~'
    };

    return errorMessages[error] || errorMessages.default;
  };

  const getButtonStyle = () => {
    switch (state) {
      case VoiceState.LISTENING:
        return 'bg-red-500 hover:bg-red-600 animate-pulse';
      case VoiceState.ERROR:
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-pink-500 hover:bg-pink-600';
    }
  };

  const getIcon = () => {
    switch (state) {
      case VoiceState.LISTENING:
        return <FaStop className="animate-pulse" />;
      case VoiceState.PROCESSING:
        return <FaSpinner className="animate-spin" />;
      default:
        return <FaMicrophone />;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={state === VoiceState.LISTENING ? stopRecording : startRecording}
        disabled={disabled || state === VoiceState.PROCESSING}
        className={`p-3 rounded-full transition-all duration-200 
          ${getButtonStyle()}
          text-white disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500`}
        title={state === VoiceState.LISTENING ? '停止录音' : '开始录音'}
      >
        {getIcon()}
      </button>
      
      {errorMsg && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                      bg-red-100 text-red-600 px-2 py-1 rounded text-sm whitespace-nowrap">
          {errorMsg}
        </div>
      )}
      
      {state === VoiceState.LISTENING && (
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        w-12 h-12 bg-pink-500/20 rounded-full animate-ping" />
        </div>
      )}
    </div>
  );
} 