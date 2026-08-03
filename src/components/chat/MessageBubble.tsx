import { memo, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { User, Sparkles, Copy, Check, Download } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const sanitizeOptions = {
  tagNames: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'blockquote',
    'strong', 'em', 'code', 'pre',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
  ],
  attributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
    code: ['className'],
    pre: ['className'],
    span: ['className'],
    div: ['className'],
  },
};

const CopyButton = memo(function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-luxury-silver hover:text-gold-400 transition-colors"
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
});

const CodeBlock = memo(function CodeBlock({
  language,
  codeString
}: {
  language: string;
  codeString: string;
}) {
  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-luxury-charcoal rounded-t-lg px-4 py-2 border-b border-gold-500/10">
        <span className="text-xs text-luxury-silver">{language}</span>
        <CopyButton text={codeString} />
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="!mt-0 !rounded-t-none !bg-luxury-charcoal"
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
});

export const MessageBubble = memo(function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  const handleExport = useCallback(() => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archimind-response-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${role === 'user' ? 'flex-row-reverse' : ''}`}
      role="article"
      aria-label={`${role === 'user' ? 'Your message' : 'AI response'}`}
    >
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
        ${role === 'user'
          ? 'bg-gradient-to-br from-gold-400 to-gold-500'
          : 'bg-gold-500/10 border border-gold-500/20'
        }
      `}>
        {role === 'user' ? (
          <User size={20} className="text-luxury-black" aria-hidden="true" />
        ) : (
          <Sparkles size={20} className="text-gold-400" aria-hidden="true" />
        )}
      </div>

      <div className={`
        max-w-[85%] rounded-2xl px-5 py-4
        ${role === 'user'
          ? 'bg-gradient-to-br from-gold-400 to-gold-500 text-luxury-black rounded-br-md'
          : 'bg-luxury-charcoal/70 backdrop-blur-md border border-gold-500/10 rounded-bl-md'
        }
      `}>
        <div className={`prose prose-sm max-w-none ${role === 'user' ? 'prose-invert' : 'dark:prose-invert'}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeSanitize, sanitizeOptions]]}
            components={{
              code({ inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');

                if (!inline && match) {
                  return <CodeBlock language={match[1]} codeString={codeString} />;
                }

                return (
                  <code
                    className="px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 font-mono text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              h1({ children }) {
                return <h1 className="text-xl font-bold mb-3 text-luxury-pearl">{children}</h1>;
              },
              h2({ children }) {
                return <h2 className="text-lg font-bold mb-2 text-gold-400">{children}</h2>;
              },
              h3({ children }) {
                return <h3 className="text-base font-semibold mb-2 text-luxury-pearl">{children}</h3>;
              },
              p({ children }) {
                return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
              },
              ul({ children }) {
                return <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>;
              },
              li({ children }) {
                return <li className="ml-2">{children}</li>;
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-2 border-gold-500 pl-4 italic text-luxury-silver/80 my-3">
                    {children}
                  </blockquote>
                );
              },
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-400 hover:text-gold-300 underline"
                  >
                    {children}
                  </a>
                );
              },
              hr() {
                return <hr className="my-4 border-gold-500/20" />;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Action buttons for AI messages */}
        {role === 'assistant' && (
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-luxury-charcoal/50 border border-gold-500/10 hover:border-gold-500/30 transition-colors text-xs text-luxury-silver hover:text-gold-400"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-luxury-charcoal/50 border border-gold-500/10 hover:border-gold-500/30 transition-colors text-xs text-luxury-silver hover:text-gold-400"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        )}

        {timestamp && (
          <p className={`text-xs mt-2 ${role === 'user' ? 'text-luxury-black/60' : 'text-luxury-silver/40'}`}>
            {new Date(timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </motion.div>
  );
});
