'use client';

import { useState, useCallback } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const startRecording = useCallback(() => {
    if (disabled || !window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('您的浏览器不支持语音输入喵~');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;

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
      console.error('Speech recognition error:', event.error);
      stopRecording();
    };

    recognition.start();
    setRecognition(recognition);
    setIsRecording(true);
  }, [disabled, onTranscript]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsRecording(false);
  }, [recognition]);

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled}
      className={`p-2 rounded-full transition-colors duration-200
        ${isRecording 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-pink-500 hover:bg-pink-600'} 
        text-white disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isRecording ? '停止录音' : '开始录音'}
    >
      {isRecording ? <FaStop /> : <FaMicrophone />}
    </button>
  );
} 