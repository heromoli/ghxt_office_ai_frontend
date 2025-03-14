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
      const { role, content, sources } = action.payload;
      state.conversation.messages.push({ role, content, sources });
    },
    updateMessage: (state, action: PayloadAction<UpdateMessagePayload>) => {
      const { index, content } = action.payload;
      if (index >= 0 && index < state.conversation.messages.length) {
        state.conversation.messages[index].content = content;
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
  clearConversation, 
  setSessionId,
} = aiModuleSlice.actions;

export default aiModuleSlice.reducer; 