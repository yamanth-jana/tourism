import { MessageCircle, X } from 'lucide-react';

export default function FloatingChatButton({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
        isOpen
          ? 'bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 shadow-stone-900/30 rotate-90'
          : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-500/40 hover:scale-110 hover:shadow-2xl hover:shadow-primary-500/50'
      }`}
    >
      {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      {!isOpen && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success-500 border-2 border-white dark:border-stone-950 animate-pulse" />
      )}
    </button>
  );
}
