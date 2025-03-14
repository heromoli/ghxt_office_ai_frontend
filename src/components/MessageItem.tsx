import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import MarkdownRenderer from './MarkdownRenderer';
import SourcesDisplay from './SourcesDisplay';
import type { RootState } from '../store';

const MessageContainer = styled.div`
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  max-width: 85%;
`;

const UserMessage = styled(MessageContainer)`
  background-color: #e6f7ff;
  align-self: flex-end;
  margin-left: auto;
`;

const AssistantMessage = styled(MessageContainer)`
  background-color: #f5f5f5;
  align-self: flex-start;
`;

interface MessageItemProps {
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
  isLast?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ role, content, sources, isLast = false }) => {
  const MessageComponent = role === 'user' ? UserMessage : AssistantMessage;
  const loading = useSelector((state: RootState) => state.aiModule.loading);
  
  // 只有最后一条助手消息且正在加载时才显示加载状态
  const isLoading = role === 'assistant' && isLast && loading;
  
  return (
    <MessageComponent>
      {role === 'assistant' ? (
        <>
          <MarkdownRenderer content={content} isLoading={isLoading} />
          {!isLoading && <SourcesDisplay sources={sources} />}
        </>
      ) : (
        <div>{content}</div>
      )}
    </MessageComponent>
  );
};

export default MessageItem; 