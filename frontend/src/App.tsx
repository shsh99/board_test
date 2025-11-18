import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import BoardList from './pages/BoardList';
import BoardDetail from './pages/BoardDetail';
import BoardForm from './pages/BoardForm';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuth2Redirect from './pages/OAuth2Redirect';
import MyPage from './pages/MyPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<BoardList />} />
            <Route path="/boards/:id" element={<BoardDetail />} />
            <Route path="/boards/new" element={<BoardForm />} />
            <Route path="/boards/:id/edit" element={<BoardForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
