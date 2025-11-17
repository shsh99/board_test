import api from './axios';
import { Board, BoardRequest, PageResponse } from '../types';

export const boardAPI = {
  getBoards: async (page = 0, size = 10): Promise<PageResponse<Board>> => {
    const response = await api.get<PageResponse<Board>>('/boards', {
      params: { page, size },
    });
    return response.data;
  },

  getBoardById: async (id: number): Promise<Board> => {
    const response = await api.get<Board>(`/boards/${id}`);
    return response.data;
  },

  createBoard: async (data: BoardRequest): Promise<Board> => {
    const response = await api.post<Board>('/boards', data);
    return response.data;
  },

  updateBoard: async (id: number, data: BoardRequest): Promise<Board> => {
    const response = await api.put<Board>(`/boards/${id}`, data);
    return response.data;
  },

  deleteBoard: async (id: number): Promise<void> => {
    await api.delete(`/boards/${id}`);
  },

  searchBoards: async (
    keyword: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<Board>> => {
    const response = await api.get<PageResponse<Board>>('/boards/search', {
      params: { keyword, page, size },
    });
    return response.data;
  },

  getBoardsByUsername: async (
    username: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<Board>> => {
    const response = await api.get<PageResponse<Board>>(
      `/boards/user/${username}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },
};
