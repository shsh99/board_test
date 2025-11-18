package com.kanban.board.service;

import com.kanban.board.dto.BoardResponse;
import com.kanban.board.dto.CommentResponse;
import com.kanban.board.entity.Board;
import com.kanban.board.entity.Comment;
import com.kanban.board.entity.User;
import com.kanban.board.repository.BoardRepository;
import com.kanban.board.repository.CommentRepository;
import com.kanban.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final CommentRepository commentRepository;

    private static final String UPLOAD_DIR = "uploads/profiles/";

    @Transactional
    public String uploadProfileImage(String username, MultipartFile file) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 파일 검증
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("File is not an image");
        }

        // 파일 크기 제한 (5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 5MB");
        }

        try {
            // 업로드 디렉토리 생성
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 기존 프로필 이미지 삭제
            if (user.getProfileImageUrl() != null && !user.getProfileImageUrl().isEmpty()) {
                deleteProfileImageFile(user.getProfileImageUrl());
            }

            // 고유한 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;

            // 파일 저장
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // URL 생성 (상대 경로)
            String fileUrl = "/uploads/profiles/" + filename;
            user.setProfileImageUrl(fileUrl);
            userRepository.save(user);

            return fileUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    @Transactional
    public void deleteProfileImage(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getProfileImageUrl() != null && !user.getProfileImageUrl().isEmpty()) {
            deleteProfileImageFile(user.getProfileImageUrl());
            user.setProfileImageUrl(null);
            userRepository.save(user);
        }
    }

    private void deleteProfileImageFile(String fileUrl) {
        try {
            if (fileUrl.startsWith("/uploads/profiles/")) {
                String filename = fileUrl.substring("/uploads/profiles/".length());
                Path filePath = Paths.get(UPLOAD_DIR).resolve(filename);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            // 로그만 남기고 계속 진행
            System.err.println("Failed to delete file: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Page<BoardResponse> getMyBoards(String username, Pageable pageable) {
        Page<Board> boards = boardRepository.findByAuthor_UsernameOrderByCreatedAtDesc(username, pageable);
        return boards.map(BoardResponse::from);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getMyComments(String username) {
        List<Comment> comments = commentRepository.findByAuthor_UsernameWithBoard(username);
        return comments.stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public String getProfileImageUrl(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getProfileImageUrl();
    }
}
