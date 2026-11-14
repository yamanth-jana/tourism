import { Bot, User } from 'lucide-react';
import TypingAnimation from './TypingAnimation';

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({ message }) {
  const isBot = message.sender === 'bot';
  const isTyping = message.typing;

  return (
    <div className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      {/* Bot avatar */}
      {isBot && (
        <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md shadow-primary-500/20">
          <Bot size={17} className="text-white" />
        </div>
      )}

      {/* Message bubble */}
      <div className={`max-w-[78%] ${isBot ? '' : 'flex flex-col items-end'}`}>
        <div
          className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-line break-words ${
            isBot
              ? 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-2xl rounded-tl-md border border-stone-200/60 dark:border-stone-700/50 shadow-sm'
              : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl rounded-tr-md shadow-md shadow-primary-500/20'
          }`}
        >
          {isTyping ? (
            <div className="flex items-center gap-2">
              <TypingAnimation />
              <span className="text-xs text-stone-400 dark:text-stone-500 ml-1">thinking...</span>
            </div>
          ) : (
            message.text
          )}
        </div>
        <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-1.5 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>

      {/* User avatar */}
      {!isBot && (
        <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-md shadow-secondary-500/20">
          <User size={17} className="text-white" />
        </div>
      )}
    </div>
  );
}
