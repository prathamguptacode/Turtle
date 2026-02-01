import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import AuthPage from './pages/auth';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />}></Route>
                <Route path='/auth' element={<AuthPage />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
