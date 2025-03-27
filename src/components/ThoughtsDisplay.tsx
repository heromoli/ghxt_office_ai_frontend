import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

const ThoughtsContainer = styled.div`
  margin-top: 8px;
  margin-bottom: 12px;
  border-top: 1px solid #e8e8e8;
  padding-top: 8px;
  font-size: 0.9em;
`;

const ThoughtsHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #1890ff;
  font-weight: 500;
`;

const ThoughtsList = styled.div`
  margin-top: 8px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
`;

const ThoughtItem = styled.div`
  margin-bottom: 8px;
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
`;

const ThoughtHeader = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
`;

const ThoughtContent = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
`;

const NoThoughtsText = styled.div`
  color: #999;
  font-style: italic;
  padding: 8px;
`;

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: currentColor;
  margin-left: 2px;
  animation: ${blink} 1s step-end infinite;
`;

interface ThoughtsDisplayProps {
  thoughts?: string;
  isExpanded?: boolean;
}

const ThoughtsDisplay: React.FC<ThoughtsDisplayProps> = ({ thoughts, isExpanded = true }) => {
  
  const [expanded, setExpanded] = useState(isExpanded);

  useEffect(() => {
    if (!thoughts) return;
  }, [thoughts]);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  if (!thoughts) {
    return null;
  }
  
  return (
    <ThoughtsContainer>
      <ThoughtsHeader onClick={toggleExpanded}>
        {expanded ? <DownOutlined /> : <RightOutlined />}
        <span style={{ marginLeft: 8 }}>思考过程</span>
      </ThoughtsHeader>
      
      {expanded && (
        <ThoughtsList>
          <ThoughtItem>
            <ThoughtContent>
              {thoughts}
            </ThoughtContent>
          </ThoughtItem>
        </ThoughtsList>
      )}
    </ThoughtsContainer>
  );
  
  
  // if (parsedThoughts.length === 0) {
  //   return null;
  // }
  
  // return (
  //   <ThoughtsContainer>
  //     <ThoughtsHeader onClick={toggleExpanded}>
  //       {expanded ? <DownOutlined /> : <RightOutlined />}
  //       <span style={{ marginLeft: 8 }}>思考过程</span>
  //       {isTyping && <Cursor />}
  //     </ThoughtsHeader>
      
  //     {expanded && (
  //       <ThoughtsList>
  //         {parsedThoughts.map((thought, index) => (
  //           <ThoughtItem key={index}>
  //             <ThoughtHeader>
  //               {thought.action_name || thought.action_type || '思考步骤'}
  //               {isTyping && index === parsedThoughts.length - 1 && <Cursor />}
  //             </ThoughtHeader>
  //             <ThoughtContent>
  //               {thought.thought || thought.response || thought.observation || JSON.stringify(thought)}
  //               {isTyping && index === parsedThoughts.length - 1 && <Cursor />}
  //             </ThoughtContent>
  //           </ThoughtItem>
  //         ))}
  //       </ThoughtsList>
  //     )}
  //   </ThoughtsContainer>
  // );
};

export default ThoughtsDisplay; 