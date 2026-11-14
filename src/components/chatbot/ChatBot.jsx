import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Sparkles, X, Trash2, Minus, Maximize2, Minimize2 } from 'lucide-react';
import FloatingChatButton from './FloatingChatButton';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestionChips from './SuggestionChips';
import { matchIntent } from '../../services/intentMatcher';
import { generateResponse } from '../../services/chatbotResponses';
import destinations from '../../data/destinations';
import { useLocation } from '../../context/LocationContext';
import { chatbotApi } from '../../services/api';

const STORAGE_KEY = 'explore-india-chat-history';
const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: "Namaste! I'm your AI Travel Assistant for Explore India. Ask me about tourist places, travel info, hidden gems, nearby guides, or let me help you plan your trip!",
  timestamp: Date.now(),
};

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore corrupt storage
  }
  return [{ ...WELCOME_MESSAGE, timestamp: Date.now() }];
}

function saveMessages(msgs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-50)));
  } catch {
    // storage full or disabled — ignore
  }
}

export default function ChatBot() {
  const { selectedState, selectedDistrict } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const headerRef = useRef(null);
  const [drag, setDrag] = useState({ active: false, offsetX: 0, offsetY: 0, x: 0, y: 0 });

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Dragging logic (desktop only)
  useEffect(() => {
    if (!drag.active) return;
    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setDrag((d) => ({ ...d, x: clientX - d.offsetX, y: clientY - d.offsetY }));
    };
    const handleUp = () => setDrag((d) => ({ ...d, active: false }));
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [drag.active]);

  const handleDragStart = (e) => {
    if (isMaximized) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDrag({ active: true, offsetX: clientX - drag.x, offsetY: clientY - drag.y, x: drag.x, y: drag.y });
  };

  const handleSend = useCallback(async (text) => {
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      let responseText = '';
      try {
        const apiRes = await chatbotApi.sendMessage(text);
        if (apiRes.ok && apiRes.data?.reply) {
          responseText = apiRes.data.reply;
        }
      } catch {}

      if (!responseText) {
        const ctx = {
          destinations,
          selectedState,
          selectedDistrict,
        };
        const match = matchIntent(text, ctx);
        responseText = generateResponse(match, ctx);
      }

      const botMsg = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('[ChatBot] Error generating response:', err);
      setMessages((prev) => [...prev, {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: "I'm sorry, I encountered an error. Please try asking in a different way.",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [selectedState, selectedDistrict]);

  const handleSuggestion = useCallback((query) => {
    handleSend(query);
  }, [handleSend]);

  const handleClear = useCallback(() => {
    const fresh = [{ ...WELCOME_MESSAGE, timestamp: Date.now() }];
    setMessages(fresh);
    saveMessages(fresh);
  }, []);

  const toggleMinimize = () => {
    setIsMinimized((v) => !v);
  };

  const toggleMaximize = () => {
    setIsMaximized((v) => !v);
    if (!isMaximized) setIsMinimized(false);
  };

  // Window sizing
  const windowStyle = isMaximized
    ? { width: '100vw', height: '100vh', left: 0, top: 0, borderRadius: 0 }
    : {
        width: 'min(460px, calc(100vw - 2rem))',
        height: 'min(720px, 85vh)',
        left: drag.x || 'auto',
        right: drag.x ? 'auto' : '1.5rem',
        top: drag.y || 'auto',
        bottom: drag.y ? 'auto' : '6rem',
      };

  return (
    <>
      <FloatingChatButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />

      {isOpen && (
        <div
          className="fixed z-50 flex flex-col overflow-hidden shadow-2xl shadow-stone-900/20 dark:shadow-black/50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-white/60 dark:border-stone-700/50 animate-scale-in origin-bottom-right rounded-3xl"
          style={windowStyle}
        >
          {/* Header — draggable */}
          <div
            ref={headerRef}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white cursor-move select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  AI Travel Assistant
                  <Sparkles size={12} className="text-accent-300" />
                </h3>
                <p className="text-[11px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-300 animate-pulse" />
                  Online — Explore India
                  {selectedState && (
                    <span className="ml-1 opacity-75">· {selectedState.name}{selectedDistrict ? `, ${selectedDistrict.name}` : ''}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Clear conversation"
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={toggleMinimize}
                title={isMinimized ? 'Restore' : 'Minimize'}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                {isMinimized ? <Maximize2 size={15} /> : <Minus size={16} />}
              </button>
              <button
                onClick={toggleMaximize}
                title={isMaximized ? 'Restore' : 'Maximize'}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body — hidden when minimized */}
          {!isMinimized && (
            <>
              {/* Conversation */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-stone-50/50 dark:bg-stone-950/50 scrollbar-thin"
              >
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isTyping && (
                  <ChatMessage
                    message={{ id: 'typing', sender: 'bot', typing: true, timestamp: Date.now() }}
                  />
                )}
              </div>

              {/* Suggestion chips */}
              <SuggestionChips onSuggestion={handleSuggestion} />

              {/* Input */}
              <ChatInput onSend={handleSend} disabled={isTyping} />
            </>
          )}
        </div>
      )}
    </>
  );
}
