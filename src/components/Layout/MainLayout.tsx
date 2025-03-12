import React from 'react';
import { Layout, Menu, Tag, message } from 'antd';
import styled from 'styled-components';
import { MessageOutlined } from '@ant-design/icons';
import ModuleCards from '../ModuleCards';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import titleBg from './icons/title_bg.png';

const { Header, Content, Sider } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: rgb(211, 236, 250) !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 100%;
  z-index: 100;
  height: 64px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  background: linear-gradient(120deg, #1890ff, #722ed1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin: 0;
  font-weight: 700;
`;

const StyledContent = styled(Content)`
  background: #f5f7fa;
  padding: 16px;
  overflow-y: auto;
  height: calc(100vh - 64px);
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 15% auto;
  padding: 0 8px;
`;

const StyledSider = styled(Sider)`
  background: #f5f7fa !important;
  overflow-y: auto;
  height: 100%;
  padding: 10px;

  .ant-menu {
    background: transparent;
    border-right: none;
  }

  .ant-menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin:  16px;
    border-radius: 10px;
    background: white;
    height: auto !important;
    padding: 12px !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    font-size: 15px;
    
    &:hover {
      background: #f0f7ff;
    }
  }

  .ant-menu-item-selected {
    background: #e6f7ff !important;
    
    &::after {
      display: none;
    }
  }
`;

const MenuItemContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const MenuItemText = styled.span`
  flex: 1;
  font-weight: 600;
    color:rgb(5, 56, 115);
  font-size: 18px;
`;

const StyledTag = styled(Tag)`
  margin-right: 0;
  font-size: 11px;
  line-height: 1.2;
  padding: 2px 5px;
  border: none;
`;

const ChatIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(120deg, #36d1dc, #5b86e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const AITitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background-size: contain;
  padding: 15px;
  margin: 0 12px;
`;
// background: url(${titleBg}) no-repeat center center;
const AITitle = styled.div`
  font-size: 20px;
  color:rgb(127, 151, 179);
  font-weight: 600;
`;

const menuItems = [
  {
    key: 'product',
    label: '产品一指禅',
    status: '内测版',
    statusColor: 'green',
  },
  {
    key: 'rules',
    label: '规章制度百事通',
    status: '内测版',
    statusColor: 'green',
  },
  {
    key: 'meeting',
    label: '会议记录秘书',
    status: '内测版',
    statusColor: 'green',
  },
  {
    key: 'solutions',
    label: 'AI解决方案平台',
    status: '即将上线',
    statusColor: 'pink',
  },
  {
    key: 'agriculture',
    label: '农业大模型',
    status: '即将上线',
    statusColor: 'pink',
  },
  {
    key: 'ocean',
    label: '海洋预警模型',
    status: '即将上线',
    statusColor: 'pink',
  },
  {
    key: 'pest',
    label: '病虫害识别',
    status: '即将上线',
    statusColor: 'pink',
  },
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const handleMenuClick = (key: string) => {
    
    if (['product', 'rules', 'meeting'].includes(key)) {
      navigate(`/chat/${key}`);
    } else if (key === 'agriculture' || key === 'pest') {
      message.info('该功能即将上线，敬请期待');
    } else if (key === 'solutions' || key === 'ocean') {
      message.info('正在开发中，敬请期待');
    }
  };

  return (
    <StyledLayout>
      <StyledHeader>
        <HeaderContent>
          <Title>您好，欢迎使用国海信通办公大模型</Title>
        </HeaderContent>
      </StyledHeader>
      <Layout>
        <StyledSider width={350} theme="light">
          <AITitleWrapper>
            <ChatIcon>
              <MessageOutlined style={{ fontSize: 20 }} />
            </ChatIcon>
            <AITitle>AI智能体</AITitle>
          </AITitleWrapper>
          <Menu
            mode="inline"
            defaultSelectedKeys={[]}
            style={{ borderRight: 0 }}
            items={menuItems.map(item => ({
              key: item.key,
              label: (
                <MenuItemContent>
                  <MenuItemText>{item.label}</MenuItemText>
                  {item.status && (
                    <StyledTag color={item.statusColor}>
                      {item.status}
                    </StyledTag>
                  )}
                </MenuItemContent>
              ),
              onClick: () => handleMenuClick(item.key),
            }))}
          />
        </StyledSider>
        <StyledContent>
          <ContentWrapper>
            <ModuleCards />
          </ContentWrapper>
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default MainLayout; 