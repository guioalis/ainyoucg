'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Message } from '@/types';

interface ImageUploadProps {
  onImageAnalysis: (description: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ onImageAnalysis, disabled }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB喵~');
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsAnalyzing(true);

      const base64 = await convertToBase64(file);
      
      const response = await fetch('https://gemini.chaohua.me/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyA2qrJHApYsaOZhEXamgQzAonO8T2D58YQ'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: '请描述这张图片，用可爱的语气，像猫娘一样说话' },
                { type: 'image_url', image_url: { url: base64 } }
              ]
            }
          ],
          model: 'gemini-2.0-flash-exp'
        }),
      });

      if (!response.ok) {
        throw new Error('图片分析失败了喵~');
      }

      const data = await response.json();
      onImageAnalysis(data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('图片分析失败了喵~ 请稍后再试');
    } finally {
      setIsAnalyzing(false);
    }
  }, [onImageAnalysis]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="mb-4">
      <label className={`block mb-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <span className="sr-only">选择图片</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={disabled || isAnalyzing}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-pink-50 file:text-pink-700
            hover:file:bg-pink-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </label>
      {previewUrl && (
        <div className="relative w-32 h-32 mt-2">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover rounded"
            onLoad={() => URL.revokeObjectURL(previewUrl)}
          />
        </div>
      )}
      {isAnalyzing && (
        <div className="flex items-center gap-2 text-gray-500 mt-2">
          <div className="animate-spin h-4 w-4 border-2 border-pink-500 rounded-full border-t-transparent"></div>
          分析图片中喵...
        </div>
      )}
    </div>
  );
} 