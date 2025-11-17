package com.kanban.board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {

    @NotBlank(message = "댓글 내용을 입력해주세요")
    @Size(max = 1000, message = "댓글은 1000자를 초과할 수 없습니다")
    private String content;
}
