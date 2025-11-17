import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { boardAPI } from '../api/board';
import { Board } from '../types';
import { useAuth } from '../context/AuthContext';
import Comments from '../components/Comments';

export default function BoardDetail() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 🟢 수정 사항 적용: hasFetched useRef는 유지
  const hasFetched = useRef(false); 

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoard = async () => {
      // 1. 이미 호출했거나, ID가 없으면 중단
      if (!id || hasFetched.current) return;
      
      // 2. 호출 플래그를 true로 설정하여 이후 중복 호출 방지
      hasFetched.current = true; 

      try {
        setLoading(true);
        // 이 API 호출 (getBoardById) 시 백엔드에서 조회수를 증가시키는 로직이 포함되어 있음
        const data = await boardAPI.getBoardById(Number(id));
        setBoard(data);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();

    // ⚠️ 수정 사항: 클린업 함수(return)에서 hasFetched.current를 false로 리셋하는 코드를 제거
    // 이 코드를 제거해야 React Strict Mode에서 재실행 시 API가 두 번 호출되는 것을 막을 수 있습니다.
    // return () => {
    //   hasFetched.current = false; 
    // };
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await boardAPI.deleteBoard(Number(id));
      alert('삭제되었습니다.');
      navigate('/');
    } catch (err) {
      alert('삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInHours < 48) {
      return '어제';
    } else {
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-12 w-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-600 font-medium">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="card-glass p-8 animate-scale-in">
            <div className="flex items-start space-x-3 mb-6">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-1">오류가 발생했습니다</h3>
                <p className="text-red-600">{error || '게시글을 찾을 수 없습니다.'}</p>
              </div>
            </div>
            <Link to="/" className="btn-primary inline-flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>목록으로 돌아가기</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = isAuthenticated && user?.username === board.authorUsername;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6 animate-slide-up">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>목록으로 돌아가기</span>
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="card-glass p-8 mb-6 animate-scale-in">
          {/* Header Section */}
          <div className="border-b border-slate-200 pb-6 mb-6">
            <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {board.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              {/* Author */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {(board.authorFullName || board.authorUsername).charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-slate-700">{board.authorFullName || board.authorUsername}</span>
              </div>

              <span className="text-slate-300">|</span>

              {/* View Count */}
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>조회 {board.viewCount}</span>
              </div>

              <span className="text-slate-300">|</span>

              {/* Created Date */}
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formatDate(board.createdAt)}</span>
              </div>

              <span className="text-slate-300">|</span>

              {/* Updated Date (if different) */}
              {board.updatedAt !== board.createdAt && (
                <>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-xs text-slate-500">(수정됨)</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="prose max-w-none mb-8">
            <div className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">
              {board.content}
            </div>
          </div>

          {/* Action Buttons */}
          {isAuthor && (
            <div className="flex justify-end items-center gap-2 pt-6 border-t border-slate-200">
              <Link
                to={`/boards/${board.id}/edit`}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>수정</span>
              </Link>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 bg-red-500/10 text-red-600 font-medium rounded-lg hover:bg-red-500/20 transition-all duration-200 border border-red-200 inline-flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>삭제</span>
              </button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <Comments boardId={Number(id)} />
      </div>
    </div>
  );
}