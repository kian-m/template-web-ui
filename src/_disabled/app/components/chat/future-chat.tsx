'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  BarChart3,
  LineChart,
  PieChart,
  Table,
  Code,
  Image,
  FileText,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  ChevronDown,
  Brain,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  visualizations?: Visualization[];
  audioUrl?: string;
  thinking?: boolean;
  confidence?: number;
  suggestedActions?: Action[];
}

interface Visualization {
  type: 'line' | 'bar' | 'pie' | 'table' | 'markdown' | 'code' | 'image';
  data: any;
  title?: string;
  description?: string;
}

interface Action {
  label: string;
  action: string;
  icon?: React.ElementType;
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function FutureChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const toggleSpeaking = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

    // Simulate AI processing with visualizations
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateSmartResponse(input),
        timestamp: new Date(),
        visualizations: generateVisualizations(input),
        confidence: Math.random() * 30 + 70,
        suggestedActions: generateActions(input),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const generateSmartResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) {
      return `Based on the current data trends, revenue is showing strong growth with a 14.68% increase from the previous period. 

The key insights are:
- **Total Revenue**: $2.1M this quarter
- **Growth Rate**: 14.68% QoQ
- **Top Performing Segment**: Enterprise (+23%)
- **Projected Next Quarter**: $2.4M

I've created visualizations below to help you understand the trends better.`;
    }

    if (lowerQuery.includes('user') || lowerQuery.includes('customer')) {
      return `User analytics show positive engagement metrics:

- **Active Users**: 128,473 (+14.68%)
- **New Signups**: 1,605 today
- **Retention Rate**: 87%
- **Average Session**: 12m 34s

The funnel analysis shows opportunities to improve checkout conversion.`;
    }

    return `I've analyzed your request and prepared the relevant data visualizations. The charts below show the current trends and patterns in your data.

Key findings:
- Strong upward trend in core metrics
- Seasonal patterns detected
- Optimization opportunities identified`;
  };

  const generateVisualizations = (query: string): Visualization[] => {
    const visualizations: Visualization[] = [];

    // Always include a line chart for trends
    visualizations.push({
      type: 'line',
      title: 'Trend Analysis',
      data: Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: Math.floor(Math.random() * 1000) + 500,
        projected: Math.floor(Math.random() * 1000) + 600,
      })),
    });

    // Add relevant visualizations based on query
    if (query.toLowerCase().includes('breakdown') || query.toLowerCase().includes('distribution')) {
      visualizations.push({
        type: 'pie',
        title: 'Distribution Breakdown',
        data: [
          { name: 'Segment A', value: 35 },
          { name: 'Segment B', value: 28 },
          { name: 'Segment C', value: 22 },
          { name: 'Segment D', value: 15 },
        ],
      });
    }

    if (query.toLowerCase().includes('compare') || query.toLowerCase().includes('vs')) {
      visualizations.push({
        type: 'bar',
        title: 'Comparative Analysis',
        data: Array.from({ length: 5 }, (_, i) => ({
          name: `Category ${i + 1}`,
          current: Math.floor(Math.random() * 1000) + 200,
          previous: Math.floor(Math.random() * 1000) + 150,
        })),
      });
    }

    return visualizations;
  };

  const generateActions = (query: string): Action[] => {
    return [
      { label: 'Create Widget', action: 'create_widget', icon: BarChart3 },
      { label: 'Export Data', action: 'export', icon: FileText },
      { label: 'Deep Dive', action: 'analyze', icon: Brain },
      { label: 'Set Alert', action: 'alert', icon: Zap },
    ];
  };

  const renderVisualization = (viz: Visualization, index: number) => {
    switch (viz.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <RechartsLineChart data={viz.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              {viz.data[0]?.projected && (
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              )}
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <RechartsBarChart data={viz.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" />
              {viz.data[0]?.previous && <Bar dataKey="previous" fill="#10b981" />}
            </RechartsBarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={viz.data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#3b82f6"
                dataKey="value"
                label
              >
                {viz.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'fixed z-50 bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-2xl',
        'border-t border-gray-800 shadow-2xl',
        'transition-all duration-500 ease-out',
        isExpanded ? 'inset-0' : 'right-0 bottom-0 left-0 h-[500px]',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isThinking ? 360 : 0 }}
            transition={{ duration: 2, repeat: isThinking ? Infinity : 0, ease: 'linear' }}
            className="rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2"
          >
            <Brain className="h-5 w-5 text-blue-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">DataBark AI</h3>
            <p className="text-xs text-gray-400">
              {isThinking ? 'Analyzing...' : 'Ready to assist'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg p-2 transition-colors hover:bg-gray-800"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4 text-gray-400" />
            ) : (
              <Maximize2 className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={cn('overflow-y-auto', isExpanded ? 'h-[calc(100vh-180px)]' : 'h-[340px]')}>
        <div className="space-y-6 px-6 py-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  'flex gap-4',
                  message.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] space-y-3',
                    message.role === 'user' ? 'items-end' : 'items-start',
                  )}
                >
                  {/* Message bubble */}
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-3',
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-100',
                    )}
                  >
                    <ReactMarkdown
                      components={{
                        code: ({ node, inline, className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="rounded bg-gray-700 px-1 py-0.5 text-sm" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>

                    {/* Confidence indicator */}
                    {message.confidence && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="text-xs text-gray-400">Confidence:</div>
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${message.confidence}%` }}
                            className={cn(
                              'h-full',
                              message.confidence > 80
                                ? 'bg-green-500'
                                : message.confidence > 60
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500',
                            )}
                          />
                        </div>
                        <div className="text-xs text-gray-400">
                          {Math.round(message.confidence)}%
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Visualizations */}
                  {message.visualizations && message.visualizations.length > 0 && (
                    <div className="space-y-3">
                      {message.visualizations.map((viz, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="rounded-xl border border-gray-700 bg-gray-800/50 p-4"
                        >
                          {viz.title && (
                            <h4 className="mb-3 text-sm font-medium text-gray-300">{viz.title}</h4>
                          )}
                          {renderVisualization(viz, index)}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Suggested actions */}
                  {message.suggestedActions && message.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {message.suggestedActions.map((action, index) => {
                        const Icon = action.icon || Sparkles;
                        return (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-gray-700"
                          >
                            <Icon className="h-3 w-3" />
                            <span>{action.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Message actions */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {message.role === 'assistant' && (
                      <>
                        <button
                          onClick={() => toggleSpeaking(message.content)}
                          className="rounded p-1 transition-colors hover:bg-gray-800"
                        >
                          {isSpeaking ? (
                            <VolumeX className="h-3 w-3" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="rounded p-1 transition-colors hover:bg-gray-800"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="rounded-2xl bg-gray-800 p-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    className="h-2 w-2 rounded-full bg-blue-400"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className="h-2 w-2 rounded-full bg-blue-400"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className="h-2 w-2 rounded-full bg-blue-400"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="absolute right-0 bottom-0 left-0 border-t border-gray-800 bg-gray-900/50 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-end gap-3">
          <button
            onClick={toggleListening}
            className={cn(
              'rounded-lg p-3 transition-all',
              isListening
                ? 'animate-pulse bg-red-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
            )}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
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
              placeholder="Ask me anything about your data..."
              className="w-full resize-none rounded-xl bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={1}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!input.trim() || isThinking}
            className={cn(
              'rounded-lg p-3 transition-all',
              input.trim() && !isThinking
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-800 text-gray-600',
            )}
          >
            <Send className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Quick actions */}
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {['Show revenue trends', 'User analytics', 'Create dashboard', 'Export report'].map(
            (prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="rounded-lg bg-gray-800 px-3 py-1 text-xs whitespace-nowrap text-gray-400 transition-colors hover:bg-gray-700"
              >
                {prompt}
              </button>
            ),
          )}
        </div>
      </div>
    </motion.div>
  );
}
