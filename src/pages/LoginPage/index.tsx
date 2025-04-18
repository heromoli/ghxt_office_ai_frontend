import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import test from 'node:test';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const LoginForm = styled.div`
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const hasTestedConnection = useRef(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);

    try {
      window.location.href = 'https://login.dingtalk.com/oauth2/auth?redirect_uri=http://8.134.253.211:8099/generator/dingtalk/getUserAccessToken&response_type=code&client_id=dinggssciyz1sjkdgnbd&scope=openid&state=dddd&prompt=consent';
      setLoading(false);

      // 这里替换为实际的登录API调用
      setTimeout(() => {
        message.success('登录成功');
        setLoading(false);
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Connection test failed:', error);
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginForm>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>登录</h2>
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: '请输入账号!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;