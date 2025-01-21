import { FormEvent, memo } from 'react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="和我聊天吧喵~"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
        >
          发送
        </button>
      </div>
    </form>
  );
}

export default memo(ChatInput); 