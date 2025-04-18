import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';
import MainLayout from './components/Layout/MainLayout';
import ChatPage from './pages/ChatPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import PestPage from './pages/PestPage'; // 新增引入
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/chat/:moduleId" element={<ChatPage />} />
            <Route path="/chat/pest" element={<PestPage />} /> {/* 新增路由 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/404" element={<ErrorPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
