import { store } from '../store';
import { updateMessage } from '../store/aiModuleSlice';

export const streamRequest = async (message: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const reader = response.body?.getReader();
    if (!reader) return;

    let accumulatedContent = '';
    const decoder = new TextDecoder();
    const messages = store.getState().aiModule.conversation.messages;
    const assistantMessageIndex = messages.length - 1;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      
      // 逐字显示
      for (let i = 0; i < chunk.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30)); // 控制打字速度
        accumulatedContent += chunk[i];
        store.dispatch(updateMessage({
          index: assistantMessageIndex,
          content: accumulatedContent
        }));
      }
    }
  } catch (error) {
    console.error('Stream request failed:', error);
  }
}; 