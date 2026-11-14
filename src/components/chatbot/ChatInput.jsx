import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';

const MAX_LINES = 4;

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = 24;
    el.style.height = `${Math.min(el.scrollHeight, lineHeight * MAX_LINES)}px`;
  };

  useEffect(() => {
    autoResize();
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 px-3 py-3 border-t border-stone-200/60 dark:border-stone-700/50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm"
    >
      <button
        type="button"
        title="Attach photo (coming soon)"
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/15 transition-colors"
      >
        <Paperclip size={18} />
      </button>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about places, guides, trip planning..."
        disabled={disabled}
        rows={1}
        className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/50 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-transparent transition-all resize-none scrollbar-thin"
        style={{ lineHeight: '24px', maxHeight: '96px' }}
      />
      <button
        type="button"
        title="Voice input (coming soon)"
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/15 transition-colors"
      >
        <Mic size={18} />
      </button>
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/40 hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
