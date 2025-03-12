import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { RootState } from '../../store';

const MessagesContainer = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  max-height: 500px;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  margin: 12px 0;
  padding: 12px 16px;
  max-width: 80%;
  border-radius: 12px;
  ${props => props.$isUser ? `
    margin-left: auto;
    background: #1890ff;
    color: white;
    border-bottom-right-radius: 4px;
  ` : `
    margin-right: auto;
    background: #f5f5f5;
    color: #333;
    border-bottom-left-radius: 4px;
  `}
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  word-break: break-word;
`;

const MarkdownContent = styled.div`
  & > * {
    margin-bottom: 8px;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.25;
  }

  h1 {
    font-size: 1.5em;
  }

  h2 {
    font-size: 1.3em;
  }

  h3 {
    font-size: 1.1em;
  }

  a {
    color: #1890ff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  code {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    padding: 0.2em 0.4em;
    font-family: monospace;
  }

  pre {
    background-color: #f6f8fa;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
  }

  pre code {
    background-color: transparent;
    padding: 0;
  }

  blockquote {
    border-left: 4px solid #ddd;
    padding-left: 16px;
    margin-left: 0;
    color: #666;
  }

  img {
    max-width: 100%;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 12px 0;
  }

  table th, table td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  table th {
    background-color: #f2f2f2;
    text-align: left;
  }

  ul, ol {
    padding-left: 20px;
  }
`;

const UserContent = styled.div`
  white-space: pre-wrap;
`;

const ChatMessages: React.FC = () => {
  const messages = useSelector((state: RootState) => state.aiModule.conversation.messages);

  React.useEffect(() => {
    // 自动滚动到底部
    const container = document.getElementById('messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <MessagesContainer id="messages-container">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          $isUser={message.role === 'user'}
        >
          {message.role === 'user' ? (
            <UserContent>{message.content}</UserContent>
          ) : (
            <MarkdownContent>
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {message.content}
              </ReactMarkdown>
            </MarkdownContent>
          )}
        </MessageBubble>
      ))}
    </MessagesContainer>
  );
};

export default ChatMessages; 