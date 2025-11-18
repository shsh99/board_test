import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Board {
  id: number;
  title: string;
  content: string;
  authorUsername: string;
  createdAt: string;
}

interface Comment {
  id: number;
  content: string;
  boardId: number;
  boardTitle: string;
  authorUsername: string;
  createdAt: string;
}

interface BoardsResponse {
  content: Board[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export default function MyPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'boards' | 'comments' | 'profile'>('profile');
  const [boards, setBoards] = useState<Board[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfileImage();
  }, []);

  useEffect(() => {
    if (activeTab === 'boards') {
      fetchMyBoards(currentPage);
    } else if (activeTab === 'comments') {
      fetchMyComments();
    }
  }, [activeTab, currentPage]);

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get('http://localhost:8020/api/users/me/profile-image');
      setProfileImageUrl(response.data.profileImageUrl);
    } catch (error) {
      console.error('Failed to fetch profile image:', error);
    }
  };

  const fetchMyBoards = async (page: number) => {
    try {
      const response = await axios.get<BoardsResponse>(
        `http://localhost:8020/api/users/me/boards?page=${page}&size=10`
      );
      setBoards(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
    }
  };

  const fetchMyComments = async () => {
    try {
      const response = await axios.get<Comment[]>('http://localhost:8020/api/users/me/comments');
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:8020/api/users/me/profile-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProfileImageUrl(response.data.profileImageUrl);
      alert('프로필 이미지가 업로드되었습니다.');
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      alert(error.response?.data?.message || '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!confirm('프로필 이미지를 삭제하시겠습니까?')) return;

    try {
      await axios.delete('http://localhost:8020/api/users/me/profile-image');
      setProfileImageUrl(null);
      alert('프로필 이미지가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('이미지 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="glass-effect rounded-2xl p-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-white/20">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {(user?.fullName || user?.username)?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">{user?.fullName || user?.username}</h1>
            <p className="text-slate-600">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-white/20">
          <button
            onClick={() => {
              setActiveTab('profile');
              setCurrentPage(0);
            }}
            className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
              activeTab === 'profile'
                ? 'text-primary-600 border-primary-600'
                : 'text-slate-600 border-transparent hover:text-slate-800'
            }`}
          >
            프로필
          </button>
          <button
            onClick={() => {
              setActiveTab('boards');
              setCurrentPage(0);
            }}
            className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
              activeTab === 'boards'
                ? 'text-primary-600 border-primary-600'
                : 'text-slate-600 border-transparent hover:text-slate-800'
            }`}
          >
            내 게시글
          </button>
          <button
            onClick={() => {
              setActiveTab('comments');
              setCurrentPage(0);
            }}
            className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
              activeTab === 'comments'
                ? 'text-primary-600 border-primary-600'
                : 'text-slate-600 border-transparent hover:text-slate-800'
            }`}
          >
            내 댓글
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white/50 rounded-xl p-6 border border-white/30">
                <h2 className="text-xl font-bold text-slate-800 mb-4">프로필 이미지</h2>
                <div className="flex items-center space-x-6">
                  {/* Profile Image Preview */}
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                    {profileImageUrl ? (
                      <img
                        src={`http://localhost:8020${profileImageUrl}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-4xl">
                        {(user?.fullName || user?.username)?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{isUploading ? '업로드 중...' : '이미지 업로드'}</span>
                      </button>
                      {profileImageUrl && (
                        <button
                          onClick={handleDeleteImage}
                          disabled={isUploading}
                          className="px-4 py-2 bg-red-500/10 text-red-600 font-medium rounded-lg hover:bg-red-500/20 transition-all duration-200 border border-red-200"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      JPG, PNG, GIF 파일을 업로드할 수 있습니다. (최대 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-white/50 rounded-xl p-6 border border-white/30 space-y-4">
                <h2 className="text-xl font-bold text-slate-800 mb-4">계정 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">사용자명</label>
                    <p className="text-lg text-slate-800 mt-1">{user?.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">이메일</label>
                    <p className="text-lg text-slate-800 mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">이름</label>
                    <p className="text-lg text-slate-800 mt-1">{user?.fullName || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Boards Tab */}
          {activeTab === 'boards' && (
            <div className="space-y-4 animate-fade-in">
              {boards.length === 0 ? (
                <div className="text-center py-12 text-slate-600">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>작성한 게시글이 없습니다.</p>
                </div>
              ) : (
                <>
                  {boards.map((board) => (
                    <Link
                      key={board.id}
                      to={`/boards/${board.id}`}
                      className="block bg-white/50 rounded-xl p-6 border border-white/30 hover:bg-white/60 transition-all duration-200"
                    >
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">{board.title}</h3>
                      <p className="text-slate-600 line-clamp-2 mb-3">{board.content}</p>
                      <p className="text-sm text-slate-500">{formatDate(board.createdAt)}</p>
                    </Link>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mt-6">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            currentPage === i
                              ? 'bg-primary-500 text-white'
                              : 'bg-white/50 text-slate-700 hover:bg-white/70'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4 animate-fade-in">
              {comments.length === 0 ? (
                <div className="text-center py-12 text-slate-600">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <p>작성한 댓글이 없습니다.</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white/50 rounded-xl p-6 border border-white/30 hover:bg-white/60 transition-all duration-200"
                  >
                    <Link
                      to={`/boards/${comment.boardId}`}
                      className="text-primary-600 hover:text-primary-700 font-medium mb-2 inline-block"
                    >
                      {comment.boardTitle}
                    </Link>
                    <p className="text-slate-700 mb-2">{comment.content}</p>
                    <p className="text-sm text-slate-500">{formatDate(comment.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
