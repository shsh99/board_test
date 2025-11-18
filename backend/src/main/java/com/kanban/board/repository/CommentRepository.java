package com.kanban.board.repository;

import com.kanban.board.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c JOIN FETCH c.author WHERE c.board.id = :boardId ORDER BY c.createdAt ASC")
    List<Comment> findByBoardIdWithAuthor(@Param("boardId") Long boardId);

    @Query("SELECT c FROM Comment c JOIN FETCH c.board JOIN FETCH c.author WHERE c.author.username = :username ORDER BY c.createdAt DESC")
    List<Comment> findByAuthor_UsernameWithBoard(@Param("username") String username);
}
