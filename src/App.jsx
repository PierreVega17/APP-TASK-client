import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Boards from './pages/Boards';
import BoardDetail from './pages/BoardDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Boards />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/boards/:id" element={<BoardDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
