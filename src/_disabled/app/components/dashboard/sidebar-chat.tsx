// app/components/dashboard/sidebar-chat.tsx
'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import ReactMarkdown from 'react-markdown';
import { Bot, Loader2, Send, MessageCircle, X, ChevronUp, ChevronDown } from 'lucide-react';
import { StatefulDataBarkAvatar, AvatarState } from '@/app/components/ui/log-person-avatar';
import { dataBarkPersona } from '@/app/services/databark-persona';
import { toast } from '@/lib/toast';
import { useAppStore } from '@/app/store/root-store';
import { apiService } from '@/app/services/api';
import { validateWidget } from '@/app/lib/widget-validation';

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
}

export default function SidebarChat() {
  const posthog = usePostHog();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [personalizedGreeting, setPersonalizedGreeting] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { activeDashboardId, addWidget, remainingCredits } = useAppStore();

  // Generate personalized greeting
  useEffect(() => {
    const generateGreeting = async () => {
      try {
        dataBarkPersona.setPostHog(posthog);
        const personalizedData = await dataBarkPersona.getPersonalizedMessage();
        const greeting = `Hi! I'm DataBark — your analytics assistant.\n\n**Quick start:**\n• "Add user growth chart"\n• "Show revenue trends"\n• "Create conversion dashboard"\n\nWhat insights would you like?`;
        setPersonalizedGreeting(greeting);

        setMessages([
          {
            id: '1',
            role: 'bot',
            content: greeting,
          },
        ]);
      } catch (error) {
        const fallback =
          "Hi! I'm DataBark — your analytics assistant. What dashboard would you like me to create?";
        setPersonalizedGreeting(fallback);
        setMessages([{ id: '1', role: 'bot', content: fallback }]);
      }
    };

    generateGreeting();
  }, [posthog]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && isExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isExpanded]);

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || isThinking) return;
    if (remainingCredits <= 0) {
      toast.error('No widget credits remaining');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage('');
    setIsThinking(true);
    setAvatarState('thinking');

    try {
      const response = await apiService.sendChatMessage({
        message: currentMessage.trim(),
        threadId: crypto.randomUUID(),
        dashboardId: activeDashboardId,
      });

      if (response) {
        const data = response;

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: data.reply || 'I helped create that widget for you!',
        };

        setMessages((prev) => [...prev, botMessage]);

        // Handle widget creation
        if (data.action && data.action.type === 'add_widgets' && data.action.widgets.length > 0) {
          for (const widget of data.action.widgets) {
            const isValid = validateWidget(widget);
            if (isValid) {
              addWidget(activeDashboardId, widget);
              toast.success('Widget added to dashboard!');
              posthog?.capture('widget_created_via_chat', {
                widget_type: widget.type,
                dashboard_id: activeDashboardId,
              });
            }
          }
        }
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
      toast.error('Failed to process message');
    } finally {
      setIsThinking(false);
      setAvatarState('idle');
    }
  }, [currentMessage, isThinking, remainingCredits, activeDashboardId, addWidget, posthog]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  return (
    <div className="border-sidebar-border border-t">
      {/* Compact Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex w-full items-center justify-between p-3 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
            <StatefulDataBarkAvatar size={14} state={avatarState} />
          </div>
          <span className="text-sm font-medium">DataBark</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-sidebar-foreground/60 text-xs">
            {isExpanded ? 'Chat' : 'Ask AI'}
          </span>
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
        </div>
      </button>

      {/* Expanded Chat Interface */}
      {isExpanded && (
        <div className="border-sidebar-border bg-sidebar/50 border-t flex flex-col max-h-[50vh]">
          {/* Chat Header with Minimize */}
          <div className="border-sidebar-border border-b px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-medium text-sidebar-foreground">Chat with DataBark</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground p-0.5 rounded hover:bg-sidebar-accent transition-colors"
              aria-label="Minimize chat"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 min-h-0 space-y-2 overflow-y-auto p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'bot' && (
                  <div className="mt-0.5 mr-2">
                    <StatefulDataBarkAvatar size={16} state="idle" />
                  </div>
                )}
                <div className="max-w-[85%]">
                  <div
                    className={`rounded-lg px-2 py-1.5 text-xs ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border border'
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <div className="leading-relaxed">{children}</div>,
                        strong: ({ children }) => <span className="font-semibold">{children}</span>,
                        em: ({ children }) => <span className="italic">{children}</span>,
                        ul: ({ children }) => (
                          <ul className="mt-1 list-inside list-disc space-y-0.5">{children}</ul>
                        ),
                        li: ({ children }) => <li className="text-xs">{children}</li>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="mt-0.5 mr-2">
                  <StatefulDataBarkAvatar size={16} state="thinking" />
                </div>
                <div className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border rounded-lg border px-2 py-1.5">
                  <div className="flex items-center space-x-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-xs">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-sidebar-border border-t p-3">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to create a widget..."
                disabled={isThinking || remainingCredits <= 0}
                className="border-sidebar-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary flex-1 rounded-md border px-2 py-1 text-xs focus:ring-1 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isThinking || remainingCredits <= 0}
                className="rounded-md bg-blue-600 p-1 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-3 w-3" />
              </button>
            </div>

            {remainingCredits <= 0 && (
              <div className="mt-1 text-xs text-red-500">No widget credits remaining</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
