import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuth2Redirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const fullName = searchParams.get('fullName');
    const profileImageUrl = searchParams.get('profileImageUrl');

    if (token && username && email) {
      // Store token and user info
      login(token, {
        username,
        email,
        fullName: fullName || '',
        profileImageUrl: profileImageUrl || undefined,
      });

      // Redirect to home page
      navigate('/', { replace: true });
    } else {
      // If no token, redirect to login with error
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full shadow-lg mb-4 animate-pulse">
          <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">로그인 처리 중...</h2>
        <p className="text-slate-600">잠시만 기다려주세요</p>
      </div>
    </div>
  );
}
