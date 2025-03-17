import React from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { RootState } from '../../store';
import SourcesDisplay from '../SourcesDisplay';
import ThoughtsDisplay from '../ThoughtsDisplay';

const MessagesContainer = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  max-height: 500px;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  margin: 12px 0;
  padding: 12px 16px;
  max-width: 80%;
  width: fit-content;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  ${props => props.$isUser ? `
    margin-left: auto;
    background: #1890ff;
    color: white;
    border-bottom-right-radius: 4px;
    text-align: right;
  ` : `
    margin-right: auto;
    background: #f5f5f5;
    color: #333;
    border-bottom-left-radius: 4px;
    text-align: left;
  `}
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  word-break: break-word;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: currentColor;
  margin-left: 2px;
  animation: ${blink} 1s step-end infinite;
`;

const MarkdownContent = styled.div`
  text-align: left;
  & > * {
    margin-bottom: 8px;
  }
  & > *:last-child {
    margin-bottom: 0;
  }
`;

const UserContent = styled.div`
  white-space: pre-wrap;
  text-align: right;
`;

const ChatMessages: React.FC = () => {
  const messages = useSelector((state: RootState) => state.aiModule.conversation.messages);

  React.useEffect(() => {
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
            <>
              <ThoughtsDisplay thoughts={message.thoughts} isTyping={message.isTyping} />
              <MarkdownContent>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {message.content}
                </ReactMarkdown>
                {message.isTyping && <Cursor />}
              </MarkdownContent>
              {!message.isTyping && message.sources && message.sources.length > 0 && (
                <SourcesDisplay sources={message.sources} />
              )}
            </>
          )}
        </MessageBubble>
      ))}
    </MessagesContainer>
  );
};

export default ChatMessages; 