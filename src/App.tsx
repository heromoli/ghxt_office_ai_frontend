import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store';
import MainLayout from './components/Layout/MainLayout';
import ChatPage from './pages/ChatPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import PestPage from './pages/PestPage'; // 新增引入

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/chat/:moduleId" element={<ChatPage />} />
            <Route path="/chat/pest" element={<PestPage />} /> {/* 新增路由 */}
          </Routes>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
