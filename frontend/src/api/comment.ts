import api from './axios';
import { Comment, CommentRequest } from '../types';

export const commentAPI = {
  getComments: async (boardId: number): Promise<Comment[]> => {
    const response = await api.get(`/boards/${boardId}/comments`);
    return response.data;
  },

  createComment: async (boardId: number, data: CommentRequest): Promise<Comment> => {
    const response = await api.post(`/boards/${boardId}/comments`, data);
    return response.data;
  },

  updateComment: async (boardId: number, commentId: number, data: CommentRequest): Promise<Comment> => {
    const response = await api.put(`/boards/${boardId}/comments/${commentId}`, data);
    return response.data;
  },

  deleteComment: async (boardId: number, commentId: number): Promise<void> => {
    await api.delete(`/boards/${boardId}/comments/${commentId}`);
  },
};
