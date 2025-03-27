import styled from 'styled-components';
import { Layout, Button } from 'antd';

export const StyledHeader = styled(Layout.Header)`
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

export const HeaderContent = styled.div`
  //max-width: 900px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BackButton = styled(Button)`
  margin-right: 20px;
`;
