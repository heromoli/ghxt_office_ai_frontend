import React from 'react';
import { Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { message } from 'antd';

// 导入图片图标
import yzcIcon from './icons/yzc.png';
import bstIcon from './icons/bst.png';
import xmsIcon from './icons/xms.png';
import jjfaIcon from './icons/jjfa.png';

const FeatureCard = styled(Card)`
  margin: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
  height: 320px;
  cursor: pointer;
  text-align: center;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }

  .ant-card-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 30px;
  }
`;

const CardTitle = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #333;
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const BlueCard = styled(FeatureCard)`
  background-color: rgba(230, 247, 255, 0.8);
`;

const GreenCard = styled(FeatureCard)`
  background-color: rgba(230, 255, 240, 0.8);
`;

const YellowCard = styled(FeatureCard)`
  background-color: rgba(255, 251, 230, 0.8);
`;

const PurpleCard = styled(FeatureCard)`
  background-color: rgba(249, 240, 255, 0.8);
`;

const modules = [
  {
    title: '产品一指禅',
    icon: yzcIcon,
    key: 'product',
    disabled: false,
    CardComponent: BlueCard,
  },
  {
    title: '规章制度百事通',
    icon: bstIcon,
    key: 'rules',
    disabled: false,
    CardComponent: GreenCard,
  },
  {
    title: '会议小秘书',
    icon: xmsIcon,
    key: 'meeting',
    disabled: false,
    CardComponent: YellowCard,
  },
  {
    title: 'AI解决方案平台',
    icon: jjfaIcon,
    key: 'solutions',
    disabled: true,
    CardComponent: PurpleCard,
  },
];

const ModuleCards: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (key: string, disabled: boolean) => {
    if (disabled) {
      message.info('该功能暂未开放');
      return;
    }
    navigate(`/chat/${key}`);
  };

  return (
    <Row gutter={[24, 24]}>
      {modules.map((module) => {
        const { CardComponent } = module;
        return (
          <Col xs={24} sm={12} md={6} lg={6} xl={6} key={module.key}>
            <CardComponent
              onClick={() => handleCardClick(module.key, module.disabled)}
              bordered={false}
            >
              <IconWrapper>
                <img src={module.icon} alt={module.title} />
              </IconWrapper>
              <CardTitle>{module.title}</CardTitle>
            </CardComponent>
          </Col>
        );
      })}
    </Row>
  );
};

export default ModuleCards; 