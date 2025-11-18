package com.kanban.board.controller;

import com.kanban.board.dto.BoardResponse;
import com.kanban.board.dto.CommentResponse;
import com.kanban.board.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me/boards")
    public ResponseEntity<Page<BoardResponse>> getMyBoards(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.getMyBoards(username, pageable));
    }

    @GetMapping("/me/comments")
    public ResponseEntity<List<CommentResponse>> getMyComments(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.getMyComments(username));
    }

    @PostMapping(value = "/me/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        String username = authentication.getName();
        String imageUrl = userService.uploadProfileImage(username, file);

        Map<String, String> response = new HashMap<>();
        response.put("profileImageUrl", imageUrl);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me/profile-image")
    public ResponseEntity<Void> deleteProfileImage(Authentication authentication) {
        String username = authentication.getName();
        userService.deleteProfileImage(username);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me/profile-image")
    public ResponseEntity<Map<String, String>> getProfileImage(Authentication authentication) {
        String username = authentication.getName();
        String imageUrl = userService.getProfileImageUrl(username);

        Map<String, String> response = new HashMap<>();
        response.put("profileImageUrl", imageUrl);
        return ResponseEntity.ok(response);
    }
}
