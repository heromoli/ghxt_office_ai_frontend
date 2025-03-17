import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessages from '../../components/ChatMessages';
import ChatInput from '../../components/ChatInput';
import { addMessage, clearConversation, setTypingStatus } from '../../store/aiModuleSlice';

const { Header, Content } = Layout;

const StyledHeader = styled(Header)`
  background: rgb(211, 236, 250) !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 100%;
  z-index: 100;
  height: 64px;
  padding: 0;
  display: flex;
  align-items: center;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
`;

const BackButton = styled(Button)`
  margin-right: 20px;
`;

const WelcomeSection = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const WelcomeTitle = styled.h2`
  color: #1890ff;
  margin-bottom: 16px;
`;

const QuickQuestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
`;

const QuestionButton = styled(Button)`
  border-radius: 16px;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StyledContent = styled(Content)`
  padding: 24px;
  min-height: 100vh;
  background: #f5f7fa;
`;

const ContentWrapper = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const moduleConfig = {
  rules: {
    title: '规章制度百事通',
    welcome: '您好，我是规章制度百事通，有什么我可以帮您的？',
    questions: [
      '请介绍公司的考勤制度。',
      '出差及差旅费有什么管理规定？',
      '查询公司的公车使用规定。'
    ]
  },
  product: {
    title: '产品一指禅',
    welcome: '您好，我是产品一指禅，请问您想了解哪些产品信息？',
    questions: [
      '请介绍“慧农云”小程序的主要功能。',
      '“未来乡村”项目的简介。',
      '海洋灾害综合防治系统是做什么的？'
    ]
  },
  meeting: {
    title: '会议小秘书',
    welcome: '您好，我是会议小秘书，需要我帮您记录会议内容吗？',
    questions: [
      '如何开始会议记录？',
      '如何导出会议纪要？',
      '如何分享会议内容？'
    ]
  },
  solutions: {
    title: 'AI解决方案平台',
    welcome: '您好，我是AI解决方案专家，请问您需要什么样的解决方案？',
    questions: [
      '有哪些AI解决方案？',
      '如何定制AI解决方案？',
      '解决方案的实施周期是多久？'
    ]
  }
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const ChatPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: keyof typeof moduleConfig }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef<{ setInput: (value: string) => void }>(null);


  useEffect(() => {
    if (!moduleId || !moduleConfig[moduleId]) {
      message.error('无效的模块ID');
      navigate('/');
      return;
    }

    // 清空之前的对话
    dispatch(clearConversation());

    // 添加欢迎消息
    dispatch(addMessage({
      role: 'assistant',
      content: moduleConfig[moduleId].welcome,
      thoughts: ''
    }));

    // 由于欢迎消息是静态的，立即关闭打字机光标
    dispatch(setTypingStatus({ 
      index: 0, // 第一条消息
      isTyping: false 
    }));
  }, [moduleId, navigate, dispatch]);

  const handleBack = () => {
    navigate('/');
  };

  const handleQuestionClick = (question: string) => {
    if (inputRef.current) {
      inputRef.current.setInput(question);
    }
  };

  if (!moduleId || !moduleConfig[moduleId]) {
    return null;
  }

  const config = moduleConfig[moduleId];

  return (
    <Layout>
      <StyledHeader>
        <HeaderContent>
          <BackButton 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
          >
            返回
          </BackButton>
          <h2>{config.title}</h2>
        </HeaderContent>
      </StyledHeader>
      <StyledContent>
        <AnimatePresence mode="wait">
          <ContentWrapper
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <WelcomeSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <WelcomeTitle>{config.welcome}</WelcomeTitle>
              <div>您可以问我以下问题：</div>
              <QuickQuestions>
                {config.questions.map((question, index) => (
                  <QuestionButton 
                    key={index}
                    type="default"
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </QuestionButton>
                ))}
              </QuickQuestions>
            </WelcomeSection>
            <ChatMessages />
            <ChatInput ref={inputRef} />
          </ContentWrapper>
        </AnimatePresence>
      </StyledContent>
    </Layout>
  );
};

export default ChatPage; 