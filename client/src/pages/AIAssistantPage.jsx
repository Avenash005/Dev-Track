import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Plus,
  Trash2,
  Sparkles,
  User,
  Cpu,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import Badge from '../components/common/Badge';

export default function AIAssistantPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Load user conversations on mount
  const loadConversations = async () => {
    try {
      const res = await api.ai.getConversations();
      if (res?.data) {
        setConversations(res.data);
        if (res.data.length > 0 && !activeConvId) {
          setActiveConvId(res.data[0].id);
        }
      }
    } catch (err) {
      console.warn('[AI] Could not load past threads:', err.message);
    } finally {
      setLoadingConvs(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Load specific conversation details when activeConvId changes
  useEffect(() => {
    async function loadThread() {
      if (!activeConvId) {
        setActiveConversation(null);
        return;
      }
      try {
        const res = await api.ai.getConversationById(activeConvId);
        if (res?.data) {
          setActiveConversation(res.data);
        }
      } catch (err) {
        console.warn('[AI] Could not load thread details:', err.message);
      }
    }
    loadThread();
  }, [activeConvId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isLoading]);

  const handleNewConversation = () => {
    setActiveConvId(null);
    setActiveConversation({
      id: null,
      title: 'New Conversation',
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Hello! I am your DevTrack AI engineering mentor. Ask me about system architecture, JavaScript runtime mechanics, or setting up PostgreSQL and Ollama.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    });
  };

  const handleDeleteConversation = async (id, e) => {
    e.stopPropagation();
    try {
      await api.ai.deleteConversation(id);
      const updated = conversations.filter((c) => c.id !== id);
      setConversations(updated);
      if (activeConvId === id) {
        if (updated.length > 0) {
          setActiveConvId(updated[0].id);
        } else {
          handleNewConversation();
        }
      }
    } catch (err) {
      console.error('[AI] Delete failed:', err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setErrorMessage('');

    const localUserMsg = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistically show user message
    setActiveConversation((prev) => ({
      ...prev,
      messages: [...(prev?.messages || []), localUserMsg],
    }));

    setIsLoading(true);

    try {
      const res = await api.ai.chat({
        conversationId: activeConvId || undefined,
        message: userText,
      });

      if (res?.data) {
        const { conversationId, assistantMessage } = res.data;
        if (!activeConvId) {
          setActiveConvId(conversationId);
          loadConversations();
        }

        setActiveConversation((prev) => ({
          ...prev,
          id: conversationId,
          messages: [
            ...(prev?.messages || []).filter((m) => m.id !== localUserMsg.id),
            localUserMsg,
            assistantMessage,
          ],
        }));
      }
    } catch (err) {
      setErrorMessage(err.message || 'AI request failed.');
      // Append diagnostic message
      setActiveConversation((prev) => ({
        ...prev,
        messages: [
          ...(prev?.messages || []),
          {
            id: 'err-' + Date.now(),
            role: 'assistant',
            content: `[Ollama Proxy Notice]: ${err.message}. If Ollama is not yet started, launch it locally with: 'ollama serve' and pull the model with: 'ollama pull llama3.2'.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
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
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-text-muted">
              No previous conversations. Start a new chat!
            </div>
          ) : (
            conversations.map((conv) => {
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
                      {new Date(conv.updatedAt || conv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-rose-400 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Ollama local status */}
        <div className="p-3 border-t border-border bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-text-secondary">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              Ollama Core
            </span>
            <Badge variant="success" size="sm" dot>
              llama3.2
            </Badge>
          </div>
          <p className="mt-1 text-[10px] text-text-muted">
            Proxied via Express backend: POST /api/ai/chat
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
                {activeConversation?.title || 'New Conversation'}
              </h3>
              <p className="text-[10px] text-text-muted">
                Frontend → Express API → Ollama (localhost:11434)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm">
              Model: llama3.2
            </Badge>
          </div>
        </div>

        {/* Message scroll list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {(activeConversation?.messages || []).map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id || index}
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
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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
                <span className="ml-2">Ollama is synthesizing response...</span>
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
            All prompts are proxied securely through the Express API layer to your local Ollama engine.
          </p>
        </div>
      </div>
    </div>
  );
}
