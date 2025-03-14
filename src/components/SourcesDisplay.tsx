import React, { useState } from 'react';
import styled from 'styled-components';
import { CopyOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';

// 来源信息接口
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

// 样式组件
const SourcesContainer = styled.div`
  margin-top: 12px;
  border-top: 1px solid #e8e8e8;
  padding-top: 8px;
`;

const SourcesHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  user-select: none;
  margin-bottom: 8px;
`;

const SourcesList = styled.div`
  margin-top: 8px;
`;

const SourceItem = styled.div`
  margin-bottom: 12px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 6px;
  font-size: 13px;
  position: relative;
`;

const SourceTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SourceDocName = styled.span`
  color: #1890ff;
`;

const SourcePageNumber = styled.span`
  color: #888;
  font-size: 12px;
  margin-left: 8px;
`;

const SourceText = styled.div`
  color: #333;
  white-space: pre-wrap;
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
`;

const CopyButton = styled.div`
  cursor: pointer;
  color: #1890ff;
  
  &:hover {
    color: #40a9ff;
  }
`;

const NoSourcesText = styled.div`
  color: #999;
  font-style: italic;
  font-size: 13px;
`;

interface SourcesDisplayProps {
  sources?: Source[];
}

const SourcesDisplay: React.FC<SourcesDisplayProps> = ({ sources }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const copySourceText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success('已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败');
      });
  };
  
  if (!sources || sources.length === 0) {
    return (
      <SourcesContainer>
        <SourcesHeader onClick={toggleExpanded}>
          {expanded ? <DownOutlined /> : <RightOutlined />}
          <span style={{ marginLeft: 8 }}>来源</span>
        </SourcesHeader>
        {expanded && <NoSourcesText>无特定参考来源</NoSourcesText>}
      </SourcesContainer>
    );
  }
  
  return (
    <SourcesContainer>
      <SourcesHeader onClick={toggleExpanded}>
        {expanded ? <DownOutlined /> : <RightOutlined />}
        <span style={{ marginLeft: 8 }}>来源 ({sources.length})</span>
      </SourcesHeader>
      
      {expanded && (
        <SourcesList>
          {sources.map((source, index) => (
            <SourceItem key={source.indexId || index}>
              <SourceTitle>
                <div>
                  <SourceDocName>
                    {source.docUrl ? (
                      <a href={source.docUrl} target="_blank" rel="noopener noreferrer">
                        {source.docName}
                      </a>
                    ) : (
                      source.docName
                    )}
                  </SourceDocName>
                  {source.title && <span> - {source.title}</span>}
                  {source.pageNumber && source.pageNumber.length > 0 && (
                    <SourcePageNumber>
                      页码: {source.pageNumber.join(', ')}
                    </SourcePageNumber>
                  )}
                </div>
                <Tooltip title="复制内容">
                  <CopyButton onClick={() => copySourceText(source.text)}>
                    <CopyOutlined />
                  </CopyButton>
                </Tooltip>
              </SourceTitle>
              <SourceText>{source.text}</SourceText>
            </SourceItem>
          ))}
        </SourcesList>
      )}
    </SourcesContainer>
  );
};

export default SourcesDisplay; 