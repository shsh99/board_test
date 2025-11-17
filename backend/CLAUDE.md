# Backend Development Guide

## 기술 스택

- Java 17
- Spring Boot 3.2
- Spring Security (JWT 인증)
- Spring Data JPA
- H2 Database (개발용)
- Gradle
- Lombok

## 프로젝트 구조

```
backend/
├── src/main/java/com/kanban/board/
│   ├── KanbanBoardApplication.java  # 메인 애플리케이션
│   ├── config/                      # 설정 클래스
│   │   ├── JpaConfig.java
│   │   └── SecurityConfig.java
│   ├── controller/                  # REST 컨트롤러
│   │   ├── AuthController.java
│   │   └── BoardController.java
│   ├── dto/                         # 데이터 전송 객체
│   │   ├── AuthRequest.java
│   │   ├── AuthResponse.java
│   │   ├── RegisterRequest.java
│   │   ├── BoardRequest.java
│   │   └── BoardResponse.java
│   ├── entity/                      # JPA 엔티티
│   │   ├── User.java
│   │   └── Board.java
│   ├── exception/                   # 예외 처리
│   │   └── GlobalExceptionHandler.java
│   ├── repository/                  # JPA 리포지토리
│   │   ├── UserRepository.java
│   │   └── BoardRepository.java
│   ├── security/                    # 보안 관련
│   │   ├── JwtUtil.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   └── service/                     # 비즈니스 로직
│       ├── AuthService.java
│       └── BoardService.java
└── src/main/resources/
    └── application.yml              # 애플리케이션 설정
```

## API 엔드포인트

### 인증 API

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 게시판 API

- `GET /api/boards` - 게시글 목록 조회 (페이지네이션)
- `GET /api/boards/{id}` - 게시글 상세 조회
- `POST /api/boards` - 게시글 생성 (인증 필요)
- `PUT /api/boards/{id}` - 게시글 수정 (인증 필요)
- `DELETE /api/boards/{id}` - 게시글 삭제 (인증 필요)
- `GET /api/boards/search?keyword={keyword}` - 게시글 검색
- `GET /api/boards/user/{username}` - 특정 사용자 게시글 조회

## 보안

### JWT 인증

- JWT 토큰 기반 인증 사용
- 토큰 유효 기간: 24시간 (application.yml에서 설정 가능)
- Authorization 헤더에 Bearer 토큰 포함 필요

### CORS 설정

- 프론트엔드 오리진(`http://localhost:3020`) 허용
- 모든 HTTP 메서드 허용
- 인증 정보(쿠키, 헤더) 전송 허용

### 비밀번호 암호화

- BCrypt 알고리즘 사용
- Spring Security의 PasswordEncoder 활용

## 데이터베이스

### H2 Database

- 인메모리 데이터베이스 사용
- H2 콘솔: `http://localhost:8020/h2-console`
- JDBC URL: `jdbc:h2:mem:kanbandb`
- Username: `sa`
- Password: (없음)

### JPA 설정

- DDL Auto: create-drop (개발 환경)
- Show SQL: true (쿼리 로깅)
- Auditing: 생성/수정 시간 자동 관리

## 개발 가이드라인

### 코딩 스타일

- Java 17 기능 활용
- Lombok을 사용한 보일러플레이트 코드 감소
- Builder 패턴 사용 권장

### 에러 처리

- GlobalExceptionHandler에서 중앙 집중식 예외 처리
- 적절한 HTTP 상태 코드 반환
- 명확한 에러 메시지 제공

### 테스트

- JUnit 5 사용
- 단위 테스트: 비즈니스 로직
- 통합 테스트: REST API 엔드포인트
- 최소 80% 테스트 커버리지 유지

### 성능 최적화

- N+1 문제 방지 (Fetch Join 활용)
- 페이지네이션 사용
- 적절한 인덱스 설정
- 쿼리 성능 모니터링

## 실행 방법

### 개발 서버 실행

```bash
cd backend
./gradlew bootRun
```

### 빌드

```bash
./gradlew build
```

### 테스트 실행

```bash
./gradlew test
```

## 환경 변수

`application.yml`에서 다음 설정 가능:

- `server.port`: 서버 포트 (기본값: 8020)
- `jwt.secret`: JWT 시크릿 키
- `jwt.expiration`: JWT 만료 시간 (밀리초)

## 주의사항

- 프로덕션 환경에서는 H2 대신 PostgreSQL 등의 데이터베이스 사용 권장
- JWT 시크릿 키는 환경 변수로 관리 권장
- CORS 설정은 프로덕션 환경에 맞게 조정 필요
- DDL Auto 설정은 프로덕션에서 validate로 변경 권장
