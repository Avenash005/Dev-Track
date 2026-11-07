import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Plus,
  Trash2,
  Sparkles,
  Terminal,
  AlertCircle,
  User,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import Badge from '../components/common/Badge';

const DEFAULT_CONVERSATIONS = [
  {
    id: 'conv-1',
    title: 'Event Loop & Microtasks Explanation',
    createdAt: '2026-11-06T14:20:00Z',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Can you explain why Promise microtasks execute before setTimeout macrotasks in the Node.js event loop?',
        timestamp: '2:20 PM',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `In JavaScript runtimes (V8 / Node.js), the event loop processes asynchronous tasks through specific queues with strict priorities:\n\n1. **Call Stack**: Executes synchronous JavaScript code until it drains.\n2. **Microtask Queue** (Promises, \`queueMicrotask\`, \`process.nextTick\`): Evaluated immediately after the currently running script finishes, *before* yielding to any macrotask.\n3. **Macrotask / Timer Queue** (\`setTimeout\`, \`setInterval\`, I/O): Executes only after the microtask queue is completely empty.\n\nTherefore, even with \`setTimeout(fn, 0)\`, the callback is placed in the timers phase of the event loop, whereas a resolved Promise microtask executes right after the current execution context concludes!`,
        timestamp: '2:21 PM',
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Prisma vs Mongoose in DevTrack AI',
    createdAt: '2026-11-05T09:10:00Z',
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: 'Why is DevTrack AI using both PostgreSQL with Prisma and MongoDB with Mongoose?',
        timestamp: '9:10 AM',
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: `DevTrack AI leverages a **Polyglot Persistence Architecture**:\n\n- **PostgreSQL + Prisma ORM**: Best for strictly structured relational models (Users, Projects, Tasks) where ACID transactions, foreign keys, and relational integrity are paramount.\n- **MongoDB + Mongoose ODM**: Best for polymorphic, flexible document models like AI chat histories, message sequences, and dynamic session logs that vary in shape and length.`,
        timestamp: '9:11 AM',
      },
    ],
  },
];

export default function AIAssistantPage() {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('devtrack_ai_convs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_CONVERSATIONS;
      }
    }
    return DEFAULT_CONVERSATIONS;
  });

  const [activeConvId, setActiveConvId] = useState(() => {
    return conversations[0]?.id || 'conv-1';
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState('READY'); // 'READY' | 'OFFLINE' | 'BUSY'
  const messagesEndRef = useRef(null);

  // Sync conversations to localStorage
  useEffect(() => {
    localStorage.setItem('devtrack_ai_convs', JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isLoading]);

  const handleNewConversation = () => {
    const newConv = {
      id: 'conv-' + Date.now(),
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'welcome-' + Date.now(),
          role: 'assistant',
          content: 'Hello! I am your DevTrack AI engineering mentor. Ask me about software design patterns, debugging JavaScript runtime mechanics, or configuring PostgreSQL and Ollama.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
  };

  const handleDeleteConversation = (id, e) => {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    if (activeConvId === id && updated.length > 0) {
      setActiveConvId(updated[0].id);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const userMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Append user message immediately
    const updatedMessages = [...(activeConversation?.messages || []), userMessage];
    const updatedTitle =
      activeConversation?.title === 'New Conversation'
        ? userText.slice(0, 32) + (userText.length > 32 ? '...' : '')
        : activeConversation?.title;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId ? { ...c, title: updatedTitle, messages: updatedMessages } : c
      )
    );

    setIsLoading(true);

    try {
      // In Phase 1 frontend preview, we simulate local Ollama inference response
      // In Phase 4, this calls POST /api/ai/chat through the Express backend proxy!
      await new Promise((res) => setTimeout(res, 900));

      const aiReply = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: `[Ollama Model: llama3.2]\n\nRegarding: "${userText}"\n\nIn modern web engineering, breaking down this task requires understanding the execution context and data contracts. Ensure your backend validates inputs before committing transactions to PostgreSQL, and persist the conversation payload to MongoDB for asynchronous retrieval.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, messages: [...c.messages, aiReply] } : c
        )
      );
    } catch (err) {
      setAiStatus('OFFLINE');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] overflow-hidden rounded-2xl border border-border bg-card">
      {/* Sidebar: Conversation history */}
      <div className="hidden md:flex w-72 flex-col border-r border-border bg-sidebar/50">
        <div className="p-4 border-b border-border">
          <button
            onClick={handleNewConversation}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-hover transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-xs cursor-pointer transition ${
                  isActive
                    ? 'bg-zinc-800 text-text-primary border border-zinc-700'
                    : 'text-text-secondary hover:bg-zinc-900 hover:text-text-primary'
                }`}
              >
                <div className="truncate mr-2">
                  <p className="truncate font-medium">{conv.title}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {conv.messages.length} messages
                  </p>
                </div>
                {conversations.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-rose-400 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Ollama local status */}
        <div className="p-3 border-t border-border bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-text-secondary">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              Ollama Engine
            </span>
            <Badge variant="success" size="sm" dot>
              llama3.2
            </Badge>
          </div>
          <p className="mt-1 text-[10px] text-text-muted">
            http://localhost:11434 via Express proxy
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background/50">
        {/* Top Chat Bar */}
        <div className="flex h-14 items-center justify-between border-b border-border px-5 bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-text-primary">
                {activeConversation?.title || 'AI Mentor'}
              </h3>
              <p className="text-[10px] text-text-muted">Local inference mode enabled</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm">
              REST: /api/ai/chat
            </Badge>
          </div>
        </div>

        {/* Message scroll list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeConversation?.messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                    isUser
                      ? 'border-secondary/30 bg-secondary/10 text-secondary'
                      : 'border-primary/30 bg-primary/10 text-primary'
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`space-y-1 rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-primary text-white shadow-md'
                      : 'border border-border bg-card text-text-primary shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                  <div
                    className={`text-[10px] ${
                      isUser ? 'text-white/70 text-right' : 'text-text-muted'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-3xl">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-card px-4 py-3 text-xs text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                <span className="ml-2">Ollama is generating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="border-t border-border p-4 bg-card/60">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask DevTrack AI about JavaScript mechanics, Node.js, databases, or algorithms..."
              className="w-full rounded-xl border border-border bg-zinc-900 py-3 pl-4 pr-12 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-primary-hover disabled:opacity-40 disabled:hover:bg-primary"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-text-muted">
            DevTrack AI passes all inference requests through Express to your local Ollama daemon.
          </p>
        </div>
      </div>
    </div>
  );
}
