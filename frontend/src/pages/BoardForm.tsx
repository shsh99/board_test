import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { boardAPI } from '../api/board';
import { useAuth } from '../context/AuthContext';

export default function BoardForm() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (isEditMode) {
      fetchBoard();
    }
  }, [id, isAuthenticated]);

  const fetchBoard = async () => {
    if (!id) return;

    try {
      const data = await boardAPI.getBoardById(Number(id));
      setTitle(data.title);
      setContent(data.content);
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode && id) {
        await boardAPI.updateBoard(Number(id), { title, content });
        alert('수정되었습니다.');
        navigate(`/boards/${id}`);
      } else {
        const newBoard = await boardAPI.createBoard({ title, content });
        alert('작성되었습니다.');
        navigate(`/boards/${newBoard.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '작업에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            {isEditMode ? '게시글 수정' : '게시글 작성'}
          </h1>
          <p className="text-slate-600">
            {isEditMode ? '게시글을 수정하세요' : '새로운 게시글을 작성하세요'}
          </p>
        </div>

        {/* Form Card */}
        <div className="card-glass p-8 animate-scale-in">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-slide-down">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="게시글 제목을 입력하세요"
                required
                maxLength={200}
              />
              <p className="mt-1 text-xs text-slate-500">
                {title.length}/200자
              </p>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field min-h-[400px] resize-y"
                placeholder="게시글 내용을 입력하세요"
                rows={15}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>취소</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary inline-flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>처리 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{isEditMode ? '수정 완료' : '작성 완료'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
