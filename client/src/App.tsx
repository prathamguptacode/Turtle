import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import AuthPage from './pages/auth';
import ChatUi from './pages/ChatUi';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/chat" element={<ChatUi />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
