'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Edit3, Save, X, Eye, Code, FileText } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import mermaid from 'mermaid';

interface MarkdownWidgetProps {
  title: string;
  content: string;
  widgetId: string;
  onSave?: (content: string) => void;
  onRefresh?: () => void;
  className?: string;
  editable?: boolean;
  liveUpdate?: boolean;
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#fff',
    primaryBorderColor: '#1e40af',
    lineColor: '#5f6368',
    secondaryColor: '#10b981',
    tertiaryColor: '#8b5cf6',
  },
});

export default function MarkdownWidget({
  title,
  content: initialContent,
  widgetId,
  onSave,
  onRefresh,
  className = '',
  editable = true,
  liveUpdate = false,
}: MarkdownWidgetProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(content);
  const [viewMode, setViewMode] = useState<'preview' | 'source' | 'split'>('preview');

  // Render mermaid diagrams
  useEffect(() => {
    const renderMermaid = async () => {
      const elements = document.querySelectorAll('.mermaid-unprocessed');
      for (const element of elements) {
        try {
          const graphDefinition = element.textContent || '';
          const { svg } = await mermaid.render(`mermaid-${Date.now()}`, graphDefinition);
          element.innerHTML = svg;
          element.classList.remove('mermaid-unprocessed');
          element.classList.add('mermaid-processed');
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      }
    };
    renderMermaid();
  }, [content, viewMode]);

  // Live update from external source
  useEffect(() => {
    if (!liveUpdate) return;

    const interval = setInterval(() => {
      // Simulate live updates - in production, this would be a WebSocket or API poll
      if (onRefresh) onRefresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [liveUpdate, onRefresh]);

  const handleSave = () => {
    setContent(tempContent);
    setIsEditing(false);
    if (onSave) onSave(tempContent);
  };

  const handleCancel = () => {
    setTempContent(content);
    setIsEditing(false);
  };

  const renderContent = () => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Code blocks with syntax highlighting
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            // Handle mermaid diagrams
            if (language === 'mermaid') {
              return (
                <div className="mermaid-unprocessed my-4 flex justify-center">
                  {String(children).replace(/\n$/, '')}
                </div>
              );
            }

            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="my-4 rounded-lg"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm dark:bg-gray-800"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Tables with styling
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
              {children}
            </td>
          ),
          // Headings with anchors
          h1: ({ children }) => (
            <h1 className="mt-6 mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-5 mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              {children}
            </h3>
          ),
          // Lists with proper spacing
          ul: ({ children }) => (
            <ul className="my-3 list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 list-inside list-decimal space-y-1 text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-blue-500 py-2 pl-4 text-gray-700 italic dark:text-gray-300">
              {children}
            </blockquote>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {children}
            </a>
          ),
          // Images with responsive sizing
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="my-4 h-auto max-w-full rounded-lg shadow-md" />
          ),
        }}
      >
        {viewMode === 'preview' ? content : tempContent}
      </ReactMarkdown>
    );
  };

  return (
    <div
      className={cn(
        'h-full w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700/50 dark:bg-gray-800/50',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700/50">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <div className="flex items-center gap-2">
          {/* View mode toggles */}
          <div className="flex items-center rounded-lg bg-gray-100 p-0.5 dark:bg-gray-700">
            <button
              onClick={() => setViewMode('preview')}
              className={cn(
                'rounded px-2 py-1 text-xs transition-colors',
                viewMode === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400',
              )}
            >
              <Eye className="h-3 w-3" />
            </button>
            <button
              onClick={() => setViewMode('source')}
              className={cn(
                'rounded px-2 py-1 text-xs transition-colors',
                viewMode === 'source'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400',
              )}
            >
              <Code className="h-3 w-3" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={cn(
                'rounded px-2 py-1 text-xs transition-colors',
                viewMode === 'split'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400',
              )}
            >
              <FileText className="h-3 w-3" />
            </button>
          </div>

          {/* Edit controls */}
          {editable && (
            <>
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="rounded p-1.5 text-green-600 transition-colors hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setViewMode('source');
                  }}
                  className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              )}
            </>
          )}

          {liveUpdate && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="h-[calc(100%-3.5rem)] overflow-auto">
        {viewMode === 'split' ? (
          <div className="flex h-full">
            <div className="h-full w-1/2 border-r border-gray-200 dark:border-gray-700">
              <textarea
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none dark:text-gray-100"
                placeholder="Enter markdown content..."
                readOnly={!isEditing}
              />
            </div>
            <div className="prose prose-sm dark:prose-invert h-full w-1/2 max-w-none overflow-auto p-4">
              {renderContent()}
            </div>
          </div>
        ) : viewMode === 'source' ? (
          <textarea
            value={isEditing ? tempContent : content}
            onChange={(e) => setTempContent(e.target.value)}
            className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm text-gray-900 focus:outline-none dark:text-gray-100"
            placeholder="Enter markdown content..."
            readOnly={!isEditing}
          />
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none p-4">{renderContent()}</div>
        )}
      </div>
    </div>
  );
}
