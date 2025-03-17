import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Source {
  indexId: string;
  title?: string;
  docId: string;
  docName: string;
  docUrl?: string | null;
  text: string;
  bizId?: string | null;
  images?: any[];
  pageNumber?: number[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;  // 添加打字机效果状态
  sources?: Source[];  // 添加来源信息
  thoughts: string;    // 添加思考过程
}

interface AIModuleState {
  currentModule: string;
  loading: boolean;
  conversation: {
    messages: Message[];
  };
  sessionId: string;
}

const initialState: AIModuleState = {
  currentModule: '',
  loading: false,
  conversation: {
    messages: [],
  },
  sessionId: '',
};

interface AddMessagePayload {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  thoughts: string;
}

interface UpdateMessagePayload {
  index: number;
  content: string;
}

interface UpdateTypingStatusPayload {
  index: number;
  isTyping: boolean;
}

interface UpdateSourcesPayload {
  index: number;
  sources: Source[];
}

interface UpdateThoughtsPayload {
  index: number;
  thoughts: string;
}

const aiModuleSlice = createSlice({
  name: 'aiModule',
  initialState,
  reducers: {
    setCurrentModule: (state, action: PayloadAction<string>) => {
      state.currentModule = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addMessage: (state, action: PayloadAction<AddMessagePayload>) => {
      const { role, content, sources, thoughts } = action.payload;
      state.conversation.messages.push({ 
        role, 
        content, 
        sources,
        thoughts: thoughts || '',
        isTyping: role === 'assistant' // 如果是助手消息，默认设置为正在输入状态 
      });
    },
    updateMessage: (state, action: PayloadAction<UpdateMessagePayload>) => {
      const { index, content } = action.payload;
      if (index >= 0 && index < state.conversation.messages.length) {
        const message = state.conversation.messages[index];
        // 只更新消息内容
        message.content = content;
        // 只有当消息是助手消息时才设置打字机状态
        if (message.role === 'assistant') {
          message.isTyping = true;
        }
      }
    },
    appendMessageContent: (state, action: PayloadAction<UpdateMessagePayload>) => {
      const { index, content } = action.payload;
      if (index >= 0 && index < state.conversation.messages.length) {
        state.conversation.messages[index].content += content;
      }
    },
    setTypingStatus: (state, action: PayloadAction<UpdateTypingStatusPayload>) => {
      const { index, isTyping } = action.payload;
      if (index >= 0 && index < state.conversation.messages.length) {
        state.conversation.messages[index].isTyping = isTyping;
      }
    },
    updateSources: (state, action: PayloadAction<UpdateSourcesPayload>) => {
      const { index, sources } = action.payload;
      if (index >= 0 && index < state.conversation.messages.length) {
        state.conversation.messages[index].sources = sources;
      }
    },
    updateThoughts: (state, action: PayloadAction<UpdateThoughtsPayload>) => {
      const { index, thoughts } = action.payload;
      if (index >= 0 && index < state.conversation.messages.length) {
        state.conversation.messages[index].thoughts += thoughts;
      }
    },
    clearConversation: (state) => {
      state.conversation.messages = [];
      state.sessionId = '';
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
  },
});

export const { 
  setCurrentModule, 
  setLoading, 
  addMessage, 
  updateMessage,
  appendMessageContent,
  updateSources,
  setTypingStatus,
  updateThoughts,
  clearConversation, 
  setSessionId,
} = aiModuleSlice.actions;

export default aiModuleSlice.reducer; 