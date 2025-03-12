import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  role: 'user' | 'assistant';
  content: string;
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
}

interface UpdateMessagePayload {
  index: number;
  content: string;
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
      const { role, content } = action.payload;
      state.conversation.messages.push({ role, content });
    },
    updateMessage: (state, action: PayloadAction<UpdateMessagePayload>) => {
      const { index, content } = action.payload;
      if (index >= 0 && index < state.conversation.messages.length) {
        state.conversation.messages[index].content = content;
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
  clearConversation, 
  setSessionId,
} = aiModuleSlice.actions;

export default aiModuleSlice.reducer; 