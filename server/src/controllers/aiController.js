import { aiService } from '../services/aiService.js';
import { apiResponse } from '../utils/apiResponse.js';

export const aiController = {
  async getConversations(req, res, next) {
    try {
      const convs = await aiService.getConversations(req.user.id);
      return apiResponse.success(res, convs, 'AI conversations retrieved.');
    } catch (error) {
      next(error);
    }
  },

  async getConversationById(req, res, next) {
    try {
      const conv = await aiService.getConversationById(req.user.id, req.params.id);
      return apiResponse.success(res, conv, 'Conversation details retrieved.');
    } catch (error) {
      next(error);
    }
  },

  async deleteConversation(req, res, next) {
    try {
      await aiService.deleteConversation(req.user.id, req.params.id);
      return apiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  },

  async chat(req, res, next) {
    try {
      const { conversationId, message } = req.body;
      const result = await aiService.chat(req.user.id, { conversationId, message });
      return apiResponse.success(res, result, 'AI message processed.');
    } catch (error) {
      next(error);
    }
  },
};
