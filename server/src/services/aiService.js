import { env } from '../config/env.js';
import Conversation from '../models/Conversation.js';
import { isMongoConnected, localDb } from '../config/database.js';

export const aiService = {
  async getConversations(userId) {
    if (isMongoConnected) {
      const convs = await Conversation.find({ userId })
        .sort({ updatedAt: -1 })
        .lean();
      return convs.map((c) => ({
        id: c._id.toString(),
        userId: c.userId,
        title: c.title,
        messagesCount: c.messages.length,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }));
    } else {
      const store = localDb.getStore();
      const userConvs = (store.conversations || []).filter((c) => c.userId === userId);
      return userConvs.map((c) => ({
        id: c.id,
        userId: c.userId,
        title: c.title,
        messagesCount: c.messages.length,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }));
    }
  },

  async getConversationById(userId, conversationId) {
    if (isMongoConnected) {
      const conv = await Conversation.findOne({ _id: conversationId, userId }).lean();
      if (!conv) {
        const error = new Error('Conversation not found or access denied.');
        error.statusCode = 404;
        throw error;
      }
      return {
        id: conv._id.toString(),
        userId: conv.userId,
        title: conv.title,
        messages: conv.messages,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      };
    } else {
      const store = localDb.getStore();
      const conv = (store.conversations || []).find(
        (c) => c.id === conversationId && c.userId === userId
      );
      if (!conv) {
        const error = new Error('Conversation not found or access denied.');
        error.statusCode = 404;
        throw error;
      }
      return conv;
    }
  },

  async deleteConversation(userId, conversationId) {
    if (isMongoConnected) {
      const res = await Conversation.deleteOne({ _id: conversationId, userId });
      if (res.deletedCount === 0) {
        const error = new Error('Conversation not found or access denied.');
        error.statusCode = 404;
        throw error;
      }
    } else {
      const store = localDb.getStore();
      const initialLen = (store.conversations || []).length;
      store.conversations = (store.conversations || []).filter(
        (c) => !(c.id === conversationId && c.userId === userId)
      );
      if (store.conversations.length === initialLen) {
        const error = new Error('Conversation not found or access denied.');
        error.statusCode = 404;
        throw error;
      }
      localDb.save();
    }
    return true;
  },

  async chat(userId, { conversationId, message }) {
    // 1. Fetch or create conversation
    let conv;
    if (conversationId) {
      conv = await this.getConversationById(userId, conversationId);
    } else {
      // Create new conversation
      const autoTitle = message.slice(0, 32) + (message.length > 32 ? '...' : '');
      if (isMongoConnected) {
        const created = await Conversation.create({
          userId,
          title: autoTitle,
          messages: [],
        });
        conv = {
          id: created._id.toString(),
          userId: created.userId,
          title: created.title,
          messages: [],
        };
      } else {
        const store = localDb.getStore();
        if (!store.conversations) store.conversations = [];
        const newConv = {
          id: `conv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          userId,
          title: autoTitle,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        store.conversations.unshift(newConv);
        localDb.save();
        conv = newConv;
      }
    }

    // 2. Prepare message history for Ollama
    const userMessageObj = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    const ollamaMessages = [
      {
        role: 'system',
        content:
          'You are DevTrack AI, an expert computer science and full-stack software engineering mentor. Provide clear, accurate, and concise explanations.',
      },
      ...conv.messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    let assistantReply = '';
    let isOllamaOnline = false;

    // 3. Make HTTP call to local Ollama daemon
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch(`${env.OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: env.OLLAMA_MODEL,
          messages: ollamaMessages,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        assistantReply = data.message?.content || 'No response generated.';
        isOllamaOnline = true;
      } else {
        assistantReply = `Ollama responded with HTTP ${response.status}: Model ${env.OLLAMA_MODEL} may need to be pulled using 'ollama pull ${env.OLLAMA_MODEL}'.`;
      }
    } catch (fetchErr) {
      // Ollama daemon offline or unreachable
      assistantReply = `[Ollama Daemon Notice]\nUnable to connect to local Ollama at ${env.OLLAMA_BASE_URL}.\n\nTo enable full local LLM inference:\n1. Ensure Ollama is running: 'ollama serve'\n2. Ensure model is installed: 'ollama pull ${env.OLLAMA_MODEL}'\n\nYour question was: "${message}"\nDevTrack AI recorded your query in conversation history.`;
    }

    const assistantMessageObj = {
      role: 'assistant',
      content: assistantReply,
      timestamp: new Date().toISOString(),
    };

    // 4. Persist updated messages to MongoDB or local store
    if (isMongoConnected) {
      await Conversation.updateOne(
        { _id: conv.id },
        {
          $push: { messages: { $each: [userMessageObj, assistantMessageObj] } },
          $set: { updatedAt: new Date() },
        }
      );
    } else {
      const store = localDb.getStore();
      const c = store.conversations.find((item) => item.id === conv.id);
      if (c) {
        c.messages.push(userMessageObj, assistantMessageObj);
        c.updatedAt = new Date().toISOString();
        localDb.save();
      }
    }

    return {
      conversationId: conv.id,
      userMessage: userMessageObj,
      assistantMessage: assistantMessageObj,
      isOllamaOnline,
    };
  },
};

