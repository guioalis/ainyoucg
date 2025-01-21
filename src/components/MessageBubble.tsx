import { Message } from '@/types';
import { memo } from 'react';

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isUser
            ? 'bg-pink-500 text-white rounded-br-none'
            : 'bg-white shadow-md rounded-bl-none'
        }`}
      >
        {typeof message.content === 'string' ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <p>不支持的消息类型</p>
        )}
      </div>
    </div>
  );
}

export default memo(MessageBubble); 