// app/components/dashboard/chat-interface.tsx
'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Mic, Send, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import {
  AvatarState,
  StatefulDataBarkAvatar,
} from '@/app/components/ui/log-person-avatar';
import { dataBarkPersona } from '@/app/services/databark-persona';
import { toast } from '@/lib/toast';
import { avatarLog } from '@/app/components/ui/avatar-logger';
import { errorEventName } from '@/lib/posthog-event';
import { Button } from '@/components/ui/button';
import {
  isMarkdownTable,
  parseMarkdownTable,
  tableToObjects,
  objectsToCsv,
} from '@/app/lib/markdown-table';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/app/store/root-store';
import { apiService } from '@/app/services/api';
import { validateWidget } from '@/app/lib/widget-validation';

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
}

export default function ChatInterface() {
  const posthog = usePostHog();
  const [isExpanded, setIsExpanded] = useState(false);
  const fixedHeight = 60; // Fixed height in vh when expanded (50% of page)
  const [personalizedGreeting, setPersonalizedGreeting] = useState<string>('');
  const [memojiMood, setMemojiMood] = useState<
    'happy' | 'thinking' | 'excited' | 'working' | 'confused' | 'celebrating'
  >('happy');
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [isThinking, setIsThinking] = useState(false);
  const [systemMessage, setSystemMessage] = useState<string>('');
  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => {
      const next = !prev;
      posthog?.capture(next ? 'chat_expanded' : 'chat_collapsed');
      return next;
    });
  }, [posthog]);
  useEffect(() => {
    const handleOpen = () => {
      setIsExpanded(true);
      posthog?.capture('chat_expanded');
      setTimeout(() => {
        const input = document.querySelector(
          '.chat-input',
        ) as HTMLElement | null;
        input?.focus();
      }, 0);
    };
    window.addEventListener('open-chat', handleOpen);
    return () => window.removeEventListener('open-chat', handleOpen);
  }, [posthog]);

  // Generate unique greeting messages for different chat contexts
  const generateUniqueGreeting = useCallback(
    async (tabId: string, isFirstTab: boolean = false) => {
      try {
        dataBarkPersona.setPostHog(posthog);

        const greetingVariations = [
          {
            opener: "Hi there! I'm DataBark — your analytics companion.",
            focus: 'Ready to transform your data into actionable insights?',
            suggestions: [
              '• Analyze user engagement trends',
              '• Create conversion funnel dashboards',
              '• Track revenue performance metrics',
              '• Build customer behavior reports',
            ],
          },
          {
            opener: "Welcome back! Let's dive into your data.",
            focus: 'What business question can I help you answer today?',
            suggestions: [
              '• Monitor key performance indicators',
              '• Visualize seasonal trends and patterns',
              '• Compare metrics across time periods',
              '• Identify growth opportunities',
            ],
          },
          {
            opener: 'DataBark here — your intelligent dashboard builder.',
            focus: "Let's create some powerful visualizations together.",
            suggestions: [
              '• Track customer acquisition costs',
              '• Analyze product performance data',
              '• Monitor operational efficiency',
              '• Create executive summary dashboards',
            ],
          },
          {
            opener: 'Hello! Ready for some data magic?',
            focus: "I'll help you build the perfect dashboard widgets.",
            suggestions: [
              '• Examine user retention patterns',
              '• Create marketing ROI reports',
              '• Track support ticket trends',
              '• Build financial performance views',
            ],
          },
        ];

        // Use tab ID to consistently select a greeting variation
        const variationIndex = isFirstTab
          ? 0
          : parseInt(tabId.slice(-1)) % greetingVariations.length;
        const variation = greetingVariations[variationIndex];

        const personalizedData = await dataBarkPersona.getPersonalizedMessage();

        const uniqueMessage = `${variation.opener}\n\n${variation.focus}\n\n**Quick start ideas:**\n${variation.suggestions.join('\n')}\n\n*What insights are you looking for?*`;

        return {
          message: uniqueMessage,
          mood: personalizedData.mood || 'happy',
        };
      } catch (error) {
        posthog?.capture('personalized_greeting_error', {
          error_message:
            error instanceof Error ? error.message : 'Unknown error',
        });
        const fallbackVariations = [
          "Hello! I'm DataBark — let's build some amazing dashboards together. What data would you like to explore?",
          'Hi there! Ready to turn your data into powerful visualizations? Ask me anything about your metrics.',
          "Welcome! I'm here to help you create insightful dashboard widgets. What would you like to analyze?",
          "Hey! Let's transform your business questions into data-driven answers. What can I build for you?",
        ];

        const fallbackIndex =
          parseInt(tabId.slice(-1)) % fallbackVariations.length;
        return {
          message: fallbackVariations[fallbackIndex],
          mood: 'happy',
        };
      }
    },
    [posthog],
  );

  // Initialize personalized greeting for first tab
  useEffect(() => {
    const initializeFirstTab = async () => {
      const greeting = await generateUniqueGreeting('1', true);
      setPersonalizedGreeting(greeting.message);
      setMemojiMood(greeting.mood as typeof memojiMood);
    };

    initializeFirstTab();
  }, [generateUniqueGreeting]);

  const defaultMessage: Message = {
    id: '1',
    role: 'bot',
    content: personalizedGreeting || 'Loading your personalized experience...',
  };

  const [tabs, setTabs] = useState<{ id: string; name: string }[]>([
    { id: '1', name: 'Welcome' },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [messagesByTab, setMessagesByTab] = useState<Record<string, Message[]>>(
    {
      '1': [defaultMessage],
    },
  );
  const [threadIds, setThreadIds] = useState<Record<string, string>>({
    '1': crypto.randomUUID(),
  });

  // Update default message when personalized greeting is ready
  useEffect(() => {
    if (personalizedGreeting) {
      setMessagesByTab((prev) => ({
        ...prev,
        '1': [
          {
            id: '1',
            role: 'bot',
            content: personalizedGreeting,
          },
        ],
      }));
    }
  }, [personalizedGreeting]);

  // Load chat history from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('debark-chat');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed.tabs &&
          parsed.activeTabId &&
          parsed.messagesByTab &&
          parsed.threadIds
        ) {
          setTabs(parsed.tabs);
          setActiveTabId(parsed.activeTabId);
          setMessagesByTab(parsed.messagesByTab);
          setThreadIds(parsed.threadIds);
        }
      }
    } catch {}
  }, []);

  // Persist chat history
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      'debark-chat',
      JSON.stringify({ tabs, activeTabId, messagesByTab, threadIds }),
    );
  }, [tabs, activeTabId, messagesByTab, threadIds]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(
    null,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (!isLoading) {
        setAvatarState(e.target.value ? 'listening' : 'idle');
      }
    },
    [isLoading],
  );

  const {
    activeDashboardId,
    addWidget,
    addDashboard,
    setActiveDashboard,
    dashboards,
  } = useAppStore();
  const remainingCredits = useAppStore((state) => state.remainingCredits);
  const setRemainingCredits = useAppStore((state) => state.setRemainingCredits);

  // Get current dashboard
  const currentDashboard = useMemo(
    () => dashboards.find((d: { id: any }) => d.id === activeDashboardId),
    [dashboards, activeDashboardId],
  );

  // Chat box is now fixed height - no resize functionality

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && isExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesByTab, activeTabId, isExpanded]);

  const handleDeleteTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const remaining = prev.filter((t) => t.id !== id);
        if (remaining.length === 0) {
          const newId = Date.now().toString();
          setActiveTabId(newId);
          setMessagesByTab({ [newId]: [defaultMessage] });
          setThreadIds({ [newId]: crypto.randomUUID() });
          return [{ id: newId, name: 'Chat 1' }];
        }
        if (activeTabId === id) {
          setActiveTabId(remaining[0].id);
        }
        setMessagesByTab((prevMsgs) => {
          const { [id]: _removed, ...rest } = prevMsgs;
          return rest;
        });
        setThreadIds((prevThreads) => {
          const { [id]: _removed, ...rest } = prevThreads;
          return rest;
        });
        return remaining;
      });
      posthog?.capture('chat_tab_deleted');
    },
    [activeTabId, defaultMessage, posthog],
  );

  const downloadFile = useCallback(
    (filename: string, content: string, type: string) => {
      if (typeof window === 'undefined') return;
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    [],
  );

  const handleExport = useCallback(
    async (messageContent: string, mode: 'csv' | 'json' | 'airtable') => {
      const parsed = parseMarkdownTable(messageContent);
      if (!parsed) {
        toast.error('No markdown table detected to export');
        return;
      }
      const records = tableToObjects(parsed);

      if (mode === 'csv') {
        const csv = objectsToCsv(records);
        downloadFile('export.csv', csv, 'text/csv;charset=utf-8');
        return;
      }
      if (mode === 'json') {
        downloadFile(
          'export.json',
          JSON.stringify(records, null, 2),
          'application/json',
        );
        return;
      }

      try {
        const res = await fetch('/api/airtable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ records }),
        });
        const data = await res.json();
        if (!res.ok) {
          console.error('Airtable error:', data);
          toast.error('Failed to add to Airtable');
          posthog?.capture('airtable_export_failed', {
            reason: data?.error || 'unknown',
          });
        } else {
          toast.success(
            `Added ${data.inserted ?? records.length} records to Airtable`,
          );
          posthog?.capture('airtable_export_success', {
            count: data.inserted ?? records.length,
          });
        }
      } catch (e) {
        toast.error('Failed to add to Airtable');
        posthog?.capture('airtable_export_failed', { reason: 'network_error' });
      }
    },
    [downloadFile, posthog],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!inputValue.trim()) return;

      if (remainingCredits <= 0) {
        toast.error('You have no remaining widget credits.', {
          event: 'no_widget_credits',
        });
        posthog?.capture(errorEventName('widget_add_blocked'), {
          dashboard_id: activeDashboardId,
        });
        return;
      }

      posthog?.capture('chat_message_sent', {
        dashboard_id: activeDashboardId,
        message: inputValue,
      });

      avatarLog.info('Processing your request...', 'thinking');
      setSystemMessage('Processing your request...');

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: inputValue,
      };

      setMessagesByTab((prev) => ({
        ...prev,
        [activeTabId]: [...(prev[activeTabId] || []), userMessage],
      }));
      setInputValue('');
      setIsLoading(true);
      setAvatarState('thinking');

      try {
        // Send message to API
        const response = await apiService.sendChatMessage({
          message: inputValue,
          dashboardId: activeDashboardId,
          threadId: threadIds[activeTabId],
          history: (messagesByTab[activeTabId] || []).map((m) => ({
            role: m.role,
            message: m.content,
          })),
        });
        setThreadIds((prev) => ({ ...prev, [activeTabId]: response.threadId }));

        // Process any actions from the response
        if (response.action && response.action.type === 'add_widgets') {
          const widgets = response.action.widgets;
          const widgetMessage = `Creating ${widgets.length} widget${widgets.length === 1 ? '' : 's'}...`;
          avatarLog.success(widgetMessage, 'talking');
          setSystemMessage(widgetMessage);
          let targetDashboardId = activeDashboardId;
          if (widgets.length > 3) {
            const suggestedName = (() => {
              const first = widgets[0]?.title?.replace(/\*\*/g, '') || 'New';
              return `${first} Dashboard`;
            })();
            if (
              typeof window !== 'undefined' &&
              window.confirm(
                `Add ${widgets.length} widgets to a new dashboard "${suggestedName}"?`,
              )
            ) {
              const newId = crypto.randomUUID();
              addDashboard(newId, suggestedName);
              setActiveDashboard(newId);
              targetDashboardId = newId;
            }
          }
          for (const widget of widgets) {
            if (validateWidget(widget)) {
              const success = addWidget(targetDashboardId, widget);
              posthog?.capture('widget_add_attempt', {
                dashboard_id: targetDashboardId,
                widget_type: widget.type,
                success,
              });
              if (!success) {
                toast.error('Failed to add widget.', {
                  event: 'widget_add_failed',
                });
                posthog?.capture(errorEventName('widget_add_failed'), {
                  reason: 'unknown',
                  dashboard_id: targetDashboardId,
                });
              } else {
                posthog?.capture('widget_added', {
                  dashboard_id: targetDashboardId,
                  widget_type: widget.type,
                });
              }
            } else {
              posthog?.capture(errorEventName('widget_add_invalid'));
              toast.error('The server returned invalid widget data.', {
                event: 'invalid_widget_data',
              });
            }
          }
          if (typeof response.remainingCredits === 'number') {
            setRemainingCredits(response.remainingCredits);
          } else {
            setRemainingCredits(remainingCredits - widgets.length);
          }
        }

        // Add bot response
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content: response.reply,
        };
        const failureMessage =
          "I couldn't process your request. Please try rephrasing it.";
        if (response.reply === failureMessage) {
          posthog?.capture(errorEventName('invalid_agent_response'));
        } else if (response.reply.toLowerCase().includes('data source')) {
          posthog?.capture(errorEventName('missing_data_source'));
        }
        if (response.reply.includes('trouble connecting')) {
          posthog?.capture(errorEventName('chat_connection_error'));
        }
        posthog?.capture('chat_bot_replied');

        setMessagesByTab((prev) => ({
          ...prev,
          [activeTabId]: [...(prev[activeTabId] || []), botResponse],
        }));
        setFeedbackMessageId(null);
        setAvatarState('talking');

        // Clear system message and set back to listening after a delay
        setTimeout(() => {
          setAvatarState('listening');
          setSystemMessage('');
        }, 2000);
      } catch (error) {
        // Handle error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          content:
            'Sorry, I encountered an error processing your request. Please try again.',
        };

        posthog?.capture(errorEventName('chat_error'), { message: inputValue });

        setMessagesByTab((prev) => ({
          ...prev,
          [activeTabId]: [...(prev[activeTabId] || []), errorMessage],
        }));

        posthog?.capture('chat_api_error', {
          error_message:
            error instanceof Error ? error.message : 'Unknown error',
          dashboard_id: activeDashboardId,
        });
        setAvatarState('idle');
      } finally {
        setIsLoading(false);
      }
    },
    [
      inputValue,
      activeDashboardId,
      addWidget,
      addDashboard,
      setActiveDashboard,
      threadIds,
      messagesByTab,
      activeTabId,
      posthog,
      remainingCredits,
      setRemainingCredits,
    ],
  );

  return (
    <div className="chat-interface pointer-events-none fixed right-0 bottom-0 left-0 z-30">
      {/* Revolutionary Fading Chat Interface */}
      <div
        className="chat-container pointer-events-auto relative flex flex-col"
        style={{ height: isExpanded ? `${fixedHeight}vh` : 'auto' }}
      >
        {/* Minimal Chat Header - Always Visible for E2E Tests */}
        <div className="chat-header">
          <button
            onClick={toggleExpanded}
            className="w-full border-t border-gray-200 bg-white/90 p-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            {isExpanded ? '− AI Chat' : '+ AI Chat'}
          </button>
        </div>

        {/* Chat Content */}
        {isExpanded && (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-100/80 text-sm dark:border-gray-600 dark:bg-gray-700/80">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className="flex items-center border-r border-gray-200 dark:border-gray-600"
                >
                  <button
                    onClick={() => setActiveTabId(tab.id)}
                    className={`px-3 py-2 focus:outline-none ${
                      activeTabId === tab.id
                        ? 'bg-white/80 text-gray-900 dark:bg-gray-900/80 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600/80 dark:hover:text-white'
                    }`}
                  >
                    {tab.name}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTab(tab.id);
                    }}
                    className="px-2 text-gray-400 hover:text-red-600 focus:outline-none"
                    aria-label="Delete chat"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {tabs.length < 10 && (
                <button
                  onClick={async () => {
                    const newId = Date.now().toString();
                    const threadId = crypto.randomUUID();

                    // Generate professional tab names
                    const tabNameOptions = [
                      'Analysis',
                      'Insights',
                      'Reports',
                      'Metrics',
                      'Data Dive',
                      'Dashboard',
                      'Analytics',
                      'Trends',
                      'Performance',
                      'Growth',
                    ];
                    const timeStamp = new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const tabName = `${tabNameOptions[tabs.length % tabNameOptions.length]} ${timeStamp}`;

                    // Generate unique greeting for this tab
                    const greeting = await generateUniqueGreeting(newId);
                    const uniqueMessage: Message = {
                      id: newId,
                      role: 'bot',
                      content: greeting.message,
                    };

                    setTabs((prev) => [...prev, { id: newId, name: tabName }]);
                    setMessagesByTab((prev) => ({
                      ...prev,
                      [newId]: [uniqueMessage],
                    }));
                    setThreadIds((prev) => ({ ...prev, [newId]: threadId }));
                    setActiveTabId(newId);
                    setMemojiMood(greeting.mood as typeof memojiMood);

                    posthog?.capture('chat_tab_created', {
                      tab_name: tabName,
                      total_tabs: tabs.length + 1,
                    });
                  }}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-600/80 dark:hover:text-white"
                >
                  + New
                </button>
              )}
            </div>

            <div className="flex flex-1 flex-col overflow-hidden bg-gray-50/80 dark:bg-gray-900/80">
              {/* Centralized System Message - Fixed at top */}
              {systemMessage && (
                <div className="flex justify-center border-b border-blue-200/50 bg-blue-50/80 p-3 dark:border-blue-800/50 dark:bg-blue-900/20">
                  <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                    <StatefulDataBarkAvatar size={16} state={avatarState} />
                    <span className="animate-pulse text-sm font-medium">
                      {systemMessage}
                    </span>
                  </div>
                </div>
              )}

              {/* Scrollable conversation history */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {(messagesByTab[activeTabId] || []).map(
                  (message, index, arr) => (
                    <div
                      key={message.id}
                      className={`flex transition-all duration-200 ease-in-out ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'bot' && (
                        <div className="mr-2 flex items-center justify-center">
                          <StatefulDataBarkAvatar size={20} state="idle" />
                        </div>
                      )}
                      <div className="flex max-w-[80%] flex-col">
                        <div
                          className={`rounded-lg px-4 py-2 transition-all duration-150 ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'border border-gray-200 bg-white/80 text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-800/80 dark:text-white'
                          }`}
                        >
                          <ReactMarkdown className="prose prose-invert break-words">
                            {message.content}
                          </ReactMarkdown>
                          {message.role === 'bot' &&
                            index === arr.length - 1 &&
                            isMarkdownTable(message.content) && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    handleExport(message.content, 'csv')
                                  }
                                >
                                  Download CSV
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    handleExport(message.content, 'json')
                                  }
                                >
                                  Download JSON
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() =>
                                    handleExport(message.content, 'airtable')
                                  }
                                >
                                  Add to Airtable
                                </Button>
                              </div>
                            )}
                        </div>
                        {message.role === 'bot' &&
                          index === arr.length - 1 &&
                          feedbackMessageId !== message.id && (
                            <div className="mt-1 flex justify-between">
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Thumbs down"
                                className="posthog-tooltip text-red-500 hover:text-red-600"
                                data-tooltip="Dislike response"
                                onClick={() => {
                                  posthog?.capture('Feedback_negative');
                                  setFeedbackMessageId(message.id);
                                }}
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Thumbs up"
                                className="posthog-tooltip text-green-500 hover:text-green-600"
                                data-tooltip="Like response"
                                onClick={() => {
                                  posthog?.capture('Feedback_positive');
                                  setFeedbackMessageId(message.id);
                                }}
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                      </div>
                      {message.role === 'user' && (
                        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200/80 dark:bg-gray-700/80">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Me
                          </span>
                        </div>
                      )}
                    </div>
                  ),
                )}
                {isLoading && !systemMessage && (
                  <div className="flex justify-start">
                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                      <StatefulDataBarkAvatar size={20} state="thinking" />
                    </div>
                    <div className="max-w-[80%] rounded-lg border border-gray-200 bg-white/80 px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white">
                      <div className="flex space-x-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '0.2s' }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '0.4s' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white/80 p-4 dark:border-gray-800 dark:bg-gray-900/80">
              <form onSubmit={handleSubmit} className="flex items-center">
                <Input
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Ask me to create or modify widgets..."
                  className="chat-input flex-1 border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  disabled={isLoading}
                />
                <div className="ml-2 flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="posthog-tooltip text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    data-tooltip="Voice input"
                    disabled={isLoading}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="posthog-tooltip text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    data-tooltip="Send message"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
