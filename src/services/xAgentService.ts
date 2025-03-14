import { store } from '../store';
import { updateMessage, updateSources, setTypingStatus } from '../store/aiModuleSlice';

interface StreamResponse {
  content: string;
  sources?: any[];
  done?: boolean;
}

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
      
      try {
        // 尝试解析JSON响应
        const jsonResponse: StreamResponse = JSON.parse(chunk);
        
        if (jsonResponse.content) {
          // 更新内容
          accumulatedContent = jsonResponse.content;
          store.dispatch(updateMessage({
            index: assistantMessageIndex,
            content: accumulatedContent
          }));
        }
        
        // 如果有来源信息，更新来源
        if (jsonResponse.sources) {
          store.dispatch(updateSources({
            index: assistantMessageIndex,
            sources: jsonResponse.sources
          }));
        }
        
        // 如果响应标记为完成，退出循环
        if (jsonResponse.done) {
          break;
        }
      } catch (e) {
        // 如果不是JSON格式，按照原来的方式处理
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
    }

    // 完成后关闭打字机光标
    store.dispatch(setTypingStatus({ 
      index: assistantMessageIndex, 
      isTyping: false 
    }));
  } catch (error) {
    console.error('Stream request failed:', error);
  }
}; 