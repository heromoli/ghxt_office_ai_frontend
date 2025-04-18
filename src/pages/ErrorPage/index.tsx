import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ErrorContainer>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    </ErrorContainer>
  );
};

export default ErrorPage;