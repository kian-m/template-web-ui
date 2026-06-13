'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X, Sparkles, Mic, MicOff } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(input),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1000);
  };

  const generateResponse = (query: string): string => {
    const responses = [
      "I've analyzed your dashboard data and found some interesting patterns.",
      "Based on your metrics, here are some insights I've discovered.",
      'Let me help you understand these trends better.',
      'I can create a widget to visualize this data for you.',
      'Your data shows strong performance indicators.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="hover:shadow-3xl fixed right-8 bottom-8 z-50 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white shadow-2xl transition-all duration-200"
          >
            <MessageCircle className="h-6 w-6" />
            <motion.div
              className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed right-8 bottom-8 z-50 flex h-[600px] w-96 flex-col"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            {/* Glass morphism container */}
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/50 bg-white/80 shadow-2xl backdrop-blur-2xl dark:border-gray-700/50 dark:bg-gray-900/80">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-4 backdrop-blur-xl dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <motion.div
                      className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      DataBark AI
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Always here to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ask me anything about your data!
                    </p>
                    <div className="mt-4 space-y-2">
                      {[
                        'Show me revenue trends',
                        'Create a user analytics widget',
                        'What are my top metrics?',
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setInput(suggestion)}
                          className="block w-full rounded-lg bg-gray-100 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        'flex',
                        message.role === 'user' ? 'justify-end' : 'justify-start',
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2',
                          message.role === 'user'
                            ? 'rounded-br-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                            : 'rounded-bl-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={cn(
                            'mt-1 text-xs opacity-70',
                            message.role === 'user'
                              ? 'text-white'
                              : 'text-gray-500 dark:text-gray-400',
                          )}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3 dark:bg-gray-800">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                          className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                          className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"
                        />
                        <motion.div
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                          className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200/50 bg-white/50 px-4 pt-2 pb-4 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/50">
                <div className="flex items-end gap-2">
                  <button
                    onClick={() => setIsListening(!isListening)}
                    className={cn(
                      'rounded-lg p-2.5 transition-all',
                      isListening
                        ? 'animate-pulse bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700',
                    )}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>

                  <div className="relative flex-1">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      className="w-full resize-none rounded-xl bg-gray-100 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100"
                      rows={1}
                      style={{ minHeight: '40px', maxHeight: '120px' }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!input.trim() || isThinking}
                    className={cn(
                      'rounded-lg p-2.5 transition-all',
                      input.trim() && !isThinking
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                        : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800',
                    )}
                  >
                    <Send className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
