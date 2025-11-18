import { useState, useEffect } from 'react';
import { commentAPI } from '../api/comment';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';

interface CommentsProps {
  boardId: number;
}

export default function Comments({ boardId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [boardId]);

  const fetchComments = async () => {
    try {
      const data = await commentAPI.getComments(boardId);
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError('');

    try {
      await commentAPI.createComment(boardId, { content: newComment });
      setNewComment('');
      await fetchComments();
    } catch (err: any) {
      setError(err.response?.data?.error || '댓글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      await commentAPI.updateComment(boardId, commentId, { content: editContent });
      setEditingId(null);
      setEditContent('');
      await fetchComments();
    } catch (err) {
      alert('댓글 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await commentAPI.deleteComment(boardId, commentId);
      await fetchComments();
    } catch (err) {
      alert('댓글 삭제에 실패했습니다.');
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
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
  };

  return (
    <div className="card-glass p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <h2 className="text-2xl font-bold text-slate-900">
          댓글 <span className="text-primary-600">{comments.length}</span>
        </h2>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="input-field min-h-[100px] resize-y"
              placeholder="댓글을 작성하세요..."
              maxLength={1000}
              required
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">{newComment.length}/1000자</span>
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="btn-primary inline-flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>등록 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>댓글 등록</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
          <p className="text-slate-600">댓글을 작성하려면 로그인이 필요합니다.</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-slate-500">첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id}
              className="bg-white/50 rounded-lg p-5 border border-slate-200 hover:border-slate-300 transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {editingId === comment.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="input-field min-h-[80px] resize-y"
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{editContent.length}/1000자</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancelEdit}
                        className="btn-secondary text-sm"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        className="btn-primary text-sm"
                      >
                        수정 완료
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-primary-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {comment.authorUsername.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{comment.authorUsername}</p>
                        <p className="text-xs text-slate-500">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    {isAuthenticated && user?.username === comment.authorUsername && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(comment)}
                          className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="수정"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="삭제"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
                  {comment.updatedAt !== comment.createdAt && (
                    <p className="text-xs text-slate-400 mt-2">(수정됨)</p>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
