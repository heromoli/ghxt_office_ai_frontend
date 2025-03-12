import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store';
import MainLayout from './components/Layout/MainLayout';
import ChatPage from './pages/ChatPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />} />
            <Route path="/chat/:moduleId" element={<ChatPage />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
