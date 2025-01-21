'use client';

import { useState, useRef, useEffect } from 'react';
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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('zh-CN');
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.IDLE);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage([...messages, newMessage]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      alert('发送消息失败了喵~ 请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('确定要清空对话吗？')) {
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
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <LanguageSelect language={language} setLanguage={setLanguage} />
          </div>
          <button
            onClick={handleClearChat}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg 
                     hover:bg-red-600 transition-colors duration-200"
          >
            清空对话
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-lg p-4 min-h-[500px] flex flex-col">
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
      </div>
    </Layout>
  );
} 