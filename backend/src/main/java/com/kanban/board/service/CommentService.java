package com.kanban.board.service;

import com.kanban.board.dto.CommentRequest;
import com.kanban.board.dto.CommentResponse;
import com.kanban.board.entity.Board;
import com.kanban.board.entity.Comment;
import com.kanban.board.entity.User;
import com.kanban.board.repository.BoardRepository;
import com.kanban.board.repository.CommentRepository;
import com.kanban.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByBoardId(Long boardId) {
        return commentRepository.findByBoardIdWithAuthor(boardId).stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse createComment(Long boardId, CommentRequest request, String username) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .board(board)
                .author(author)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.fromEntity(savedComment);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, CommentRequest request, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다"));

        if (!comment.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("댓글 수정 권한이 없습니다");
        }

        comment.setContent(request.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return CommentResponse.fromEntity(updatedComment);
    }

    @Transactional
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다"));

        if (!comment.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("댓글 삭제 권한이 없습니다");
        }

        commentRepository.delete(comment);
    }
}
