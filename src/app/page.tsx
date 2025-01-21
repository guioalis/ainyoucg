'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessage } from '@/services/ai';
import Layout from '@/components/Layout';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import ImageUpload from '@/components/ImageUpload';
import { Message } from '@/types';
import { debounce } from '@/utils/helpers';
import VoiceInput from '@/components/VoiceInput';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSelect from '@/components/LanguageSelect';
import { saveMessages, loadMessages } from '@/utils/storage';
import { VoiceState, VoiceError } from '@/types/voice';
import SpeechControl from '@/components/SpeechControl';
import { speechService } from '@/services/speech';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('zh-CN');
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.IDLE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const scrollToBottom = debounce(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 100);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedMessages = loadMessages();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  const handleAIResponse = useCallback((response: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    
    if (autoSpeak && !isSpeaking && speechService) {
      setIsSpeaking(true);
      speechService.speak(response, {
        rate: 1.1,
        pitch: 1.2,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: (error) => {
          console.error('Speech synthesis error:', error);
          setIsSpeaking(false);
        }
      });
    }
  }, [autoSpeak, isSpeaking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage([...messages, newMessage]);
      handleAIResponse(response);
    } catch (error) {
      console.error('Error:', error);
      alert('发送消息失败了喵~ 请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('确定要清空对话吗？')) {
      speechService?.stop();
      setMessages([]);
    }
  };

  const handleImageAnalysis = (description: string) => {
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: description }
    ]);
  };

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
  };

  const handleVoiceStateChange = (state: VoiceState) => {
    setVoiceState(state);
    if (state === VoiceState.LISTENING) {
      // 可以添加一些视觉反馈
    }
  };

  const handleVoiceError = (error: VoiceError) => {
    console.error('Voice error:', error);
    // 可以添加错误提示
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <section className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 
              bg-clip-text text-transparent mb-3">
              喵哥AI女友
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              你的智能聊天伴侣，让对话充满温度
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/10 
              dark:to-purple-900/10 rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 dark:bg-pink-900/20 rounded-lg p-2">
                  <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">智能语音交互</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">支持语音输入和朗读，让交流更自然</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/10 
              dark:to-purple-900/10 rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 dark:bg-pink-900/20 rounded-lg p-2">
                  <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">图像理解</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">可以识别和描述图片内容</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/10 
              dark:to-purple-900/10 rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 dark:bg-pink-900/20 rounded-lg p-2">
                  <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">多语言支持</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">支持中英日等多种语言交流</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/10 
              dark:to-purple-900/10 rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 dark:bg-pink-900/20 rounded-lg p-2">
                  <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">上下文理解</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">记忆对话内容，理解上下文</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <LanguageSelect language={language} setLanguage={setLanguage} />
            <SpeechControl autoSpeak={autoSpeak} />
          </div>
          <button
            onClick={handleClearChat}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg 
                     hover:bg-red-600 transition-colors duration-200"
          >
            清空对话
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 min-h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <div className="animate-bounce text-pink-500">思考中喵...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(e) => setAutoSpeak(e.target.checked)}
                  className="rounded text-pink-500 focus:ring-pink-500"
                />
                自动语音回复
              </label>
              {isSpeaking && (
                <div className="text-sm text-pink-500 animate-pulse">
                  正在说话...
                </div>
              )}
            </div>
            
            <ImageUpload 
              onImageAnalysis={handleImageAnalysis}
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
              <VoiceInput
                onTranscript={handleVoiceInput}
                onStateChange={handleVoiceStateChange}
                onError={handleVoiceError}
                disabled={isLoading}
                language={language}
              />
            </div>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "喵哥AI女友",
              "applicationCategory": "ChatApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "CNY"
              },
              "description": "基于 Gemini AI 的智能聊天应用，提供语音对话、图片识别、多语言支持等功能。",
              "featureList": [
                "智能语音交互",
                "图像理解能力",
                "多语言支持",
                "上下文记忆",
                "实时响应",
                "深度学习"
              ]
            })
          }}
        />
      </div>
    </Layout>
  );
} 