'use client';

import { useState, useCallback, useEffect } from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { speechService } from '@/services/speech';

interface SpeechControlProps {
  autoSpeak?: boolean;
}

export default function SpeechControl({ autoSpeak = false }: SpeechControlProps) {
  const [isMuted, setIsMuted] = useState(!autoSpeak);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMute = useCallback(() => {
    if (speechService?.isSpeaking()) {
      speechService.stop();
    }
    setIsMuted(!isMuted);
  }, [isMuted]);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleMute}
      className={`p-2 rounded-lg transition-colors duration-200
        ${isMuted ? 'bg-gray-200 text-gray-600' : 'bg-pink-100 text-pink-600'}
        hover:bg-pink-200`}
      title={isMuted ? '开启语音回复' : '关闭语音回复'}
    >
      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
    </button>
  );
} 