import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import AuthPage from './pages/Auth';
import ChatUi from './pages/ChatUi';
import { useState } from 'react';
import { UserContext } from './context/userContext';

function App() {
    const [user, setUser] = useState(0);

    return (
        <UserContext value={{user, setUser}}> 
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/chat" element={<ChatUi />} />
                </Routes>
            </BrowserRouter>
        </UserContext>
    );
}

export default App;
