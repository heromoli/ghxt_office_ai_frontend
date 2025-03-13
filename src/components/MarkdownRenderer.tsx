import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import styled from 'styled-components';

const MarkdownContainer = styled.div`
  font-size: 16px;
  line-height: 1.6;
  
  pre {
    margin: 0;
    padding: 8px;
    background-color: #f5f5f5;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  code {
    font-family: 'Fira Code', monospace;
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 0.9em;
  }
  
  pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
  }
  
  p {
    margin-bottom: 16px;
  }
  
  ul, ol {
    padding-left: 20px;
  }
  
  blockquote {
    border-left: 4px solid #ddd;
    padding-left: 16px;
    margin-left: 0;
    color: #666;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 16px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f2f2f2;
  }
`;

const BlinkingCursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 18px;
  background-color: #333;
  margin-left: 4px;
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isLoading?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className, isLoading }) => {
  return (
    <MarkdownContainer className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
      >
        {content}
      </ReactMarkdown>
      {isLoading && <BlinkingCursor />}
    </MarkdownContainer>
  );
};

export default MarkdownRenderer; 