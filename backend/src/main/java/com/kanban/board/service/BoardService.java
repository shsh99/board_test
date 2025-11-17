package com.kanban.board.service;

import com.kanban.board.dto.BoardRequest;
import com.kanban.board.dto.BoardResponse;
import com.kanban.board.entity.Board;
import com.kanban.board.entity.User;
import com.kanban.board.repository.BoardRepository;
import com.kanban.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<BoardResponse> getAllBoards(Pageable pageable) {
        return boardRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(BoardResponse::from);
    }

    @Transactional
    public BoardResponse getBoardById(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Board not found with id: " + id));

        board.setViewCount(board.getViewCount() + 1);
        boardRepository.save(board);

        return BoardResponse.from(board);
    }

    @Transactional
    public BoardResponse createBoard(BoardRequest request, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Board board = Board.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(author)
                .viewCount(0)
                .build();

        Board savedBoard = boardRepository.save(board);
        return BoardResponse.from(savedBoard);
    }

    @Transactional
    public BoardResponse updateBoard(Long id, BoardRequest request, String username) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Board not found with id: " + id));

        if (!board.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to update this board");
        }

        board.setTitle(request.getTitle());
        board.setContent(request.getContent());

        Board updatedBoard = boardRepository.save(board);
        return BoardResponse.from(updatedBoard);
    }

    @Transactional
    public void deleteBoard(Long id, String username) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Board not found with id: " + id));

        if (!board.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this board");
        }

        boardRepository.delete(board);
    }

    @Transactional(readOnly = true)
    public Page<BoardResponse> searchBoards(String keyword, Pageable pageable) {
        return boardRepository.searchByKeyword(keyword, pageable)
                .map(BoardResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<BoardResponse> getBoardsByUsername(String username, Pageable pageable) {
        return boardRepository.findByAuthor_UsernameOrderByCreatedAtDesc(username, pageable)
                .map(BoardResponse::from);
    }

}
