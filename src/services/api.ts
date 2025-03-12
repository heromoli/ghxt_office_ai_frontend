import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AIResponse {
  content: string;
  module: string;
}

export const sendMessage = async (
  message: string,
  module: string
): Promise<AIResponse> => {
  try {
    const response = await api.post('/api/chat', {
      message,
      module,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default api; 