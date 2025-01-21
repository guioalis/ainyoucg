'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { FaMicrophone, FaStop, FaSpinner } from 'react-icons/fa';
import { VoiceState, VoiceError, VoiceRecognitionProps } from '@/types/voice';

export default function VoiceInput({
  onTranscript,
  onStateChange,
  onError,
  onStart,
  onEnd,
  disabled = false,
  language = 'zh-CN',
  continuous = false,
  autoSubmit = false,
  silenceTimeout = 1000 // 停顿超过1秒自动提交
}: VoiceRecognitionProps) {
  const [state, setState] = useState<VoiceState>(VoiceState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const silenceTimeoutRef = useRef<NodeJS.Timeout>();
  const [interimResult, setInterimResult] = useState<string>('');
  const lastResultRef = useRef<string>('');

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
      recognition.continuous = continuous;
      recognition.interimResults = true;

      recognition.onstart = () => {
        updateState(VoiceState.LISTENING);
        onStart?.();
        // 添加超时处理
        timeoutRef.current = setTimeout(() => {
          if (state === VoiceState.LISTENING) {
            handleError({ name: 'Timeout', message: '没有听到声音喵~' });
          }
        }, 10000);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        // 清除之前的静音超时
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          lastResultRef.current = finalTranscript;
          onTranscript(finalTranscript);
          
          if (autoSubmit) {
            // 设置静音检测，如果停顿超过指定时间，自动提交
            silenceTimeoutRef.current = setTimeout(() => {
              if (continuous) {
                onEnd?.();
              } else {
                stopRecording();
              }
            }, silenceTimeout);
          }

          if (!continuous) {
            stopRecording();
          }
        }
        setInterimResult(interimTranscript);
      };

      recognition.onaudioend = () => {
        // 当音频输入结束时，检查是否需要自动提交
        if (autoSubmit && lastResultRef.current) {
          onEnd?.();
        }
      };

      recognition.onerror = (event) => {
        handleError({
          name: event.error,
          message: getErrorMessage(event.error)
        });
      };

      recognition.onend = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (state !== VoiceState.ERROR) {
          updateState(VoiceState.IDLE);
        }
        onEnd?.();
        recognitionRef.current = null;
      };

      recognition.start();
      recognitionRef.current = recognition;
      setErrorMsg('');
      lastResultRef.current = '';

    } catch (error) {
      handleError({
        name: 'InitError',
        message: '初始化语音识别失败喵~'
      });
    }
  }, [disabled, language, continuous, autoSubmit, silenceTimeout, state, onStart, onEnd, onTranscript]);

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const getErrorMessage = (error: string): string => {
    const errorMessages: { [key: string]: string } = {
      'no-speech': '没有听到声音喵~',
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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
      
      {interimResult && state === VoiceState.LISTENING && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 
                      bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm whitespace-nowrap">
          {interimResult}
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