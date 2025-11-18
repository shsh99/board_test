# Kanban Board 프로젝트 컨텍스트

## 프로젝트 개요

Spring Boot 백엔드와 React 프론트엔드로 구성된 칸반 게시판 모노레포 프로젝트입니다.
Google OAuth2 소셜 로그인, JWT 인증, 게시판 CRUD, 댓글 기능을 지원하며 Glassmorphism 디자인이 적용되어 있습니다.

## 기술 스택 및 버전

### 백엔드
- **언어**: Java 21
- **프레임워크**: Spring Boot 3.2.0
- **보안**: Spring Security + JWT + OAuth2 (Google)
- **데이터베이스**: H2 (개발), PostgreSQL (프로덕션)
- **빌드 도구**: Gradle 8.5+
- **환경 변수**: spring-dotenv 4.0.0
- **포트**: 8020

### 프론트엔드
- **언어**: TypeScript
- **프레임워크**: React 19
- **빌드 도구**: Vite 5.0.8
- **스타일링**: Tailwind CSS 3.3.6
- **HTTP 클라이언트**: Axios 1.6.2
- **라우팅**: React Router DOM 6.21.0
- **포트**: 3020

## 아키텍처 원칙

### 통신 규칙
- 모든 백엔드 API는 `/api` 접두사 사용
- 프론트엔드 개발 서버는 `/api` 요청을 백엔드(8020)로 프록시
- 백엔드 CORS는 프론트엔드 오리진(`http://localhost:3020`) 허용
- 프로덕션에서는 각각 독립 배포 가능

### 인증 방식
- JWT 토큰 기반 인증
- 토큰 유효 기간: 24시간 (86400000ms)
- Authorization 헤더에 `Bearer <token>` 형식
- 프론트엔드는 localStorage에 토큰 저장
- 401 응답 시 자동 로그아웃 및 로그인 페이지 리다이렉트

## 프로젝트 구조

```
board/
├── backend/                              # Spring Boot 백엔드
│   ├── src/main/java/com/kanban/board/
│   │   ├── KanbanBoardApplication.java  # 애플리케이션 진입점
│   │   ├── config/                       # 설정 클래스
│   │   │   ├── JpaConfig.java           # JPA Auditing 설정
│   │   │   └── SecurityConfig.java      # Spring Security + CORS 설정
│   │   ├── controller/                   # REST 컨트롤러
│   │   │   ├── AuthController.java      # 인증 API
│   │   │   └── BoardController.java     # 게시판 API
│   │   ├── dto/                          # 데이터 전송 객체
│   │   ├── entity/                       # JPA 엔티티
│   │   │   ├── User.java                # 사용자 엔티티
│   │   │   └── Board.java               # 게시판 엔티티
│   │   ├── exception/                    # 예외 처리
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── repository/                   # JPA 리포지토리
│   │   ├── security/                     # 보안 관련
│   │   │   ├── JwtUtil.java             # JWT 생성/검증
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── CustomUserDetailsService.java
│   │   └── service/                      # 비즈니스 로직
│   ├── src/main/resources/
│   │   └── application.yml              # 애플리케이션 설정
│   ├── build.gradle                      # Gradle 빌드 설정
│   └── CLAUDE.md                         # 백엔드 개발 가이드
│
├── frontend/                             # React 프론트엔드
│   ├── src/
│   │   ├── api/                          # API 클라이언트
│   │   │   ├── axios.ts                 # Axios 인스턴스 + 인터셉터
│   │   │   ├── auth.ts                  # 인증 API
│   │   │   └── board.ts                 # 게시판 API
│   │   ├── components/                   # 재사용 컴포넌트
│   │   │   └── Navbar.tsx               # 네비게이션 바
│   │   ├── context/                      # React Context
│   │   │   └── AuthContext.tsx          # 인증 상태 관리
│   │   ├── pages/                        # 페이지 컴포넌트
│   │   │   ├── Login.tsx                # 로그인
│   │   │   ├── Register.tsx             # 회원가입
│   │   │   ├── BoardList.tsx            # 게시글 목록
│   │   │   ├── BoardDetail.tsx          # 게시글 상세
│   │   │   └── BoardForm.tsx            # 게시글 작성/수정
│   │   ├── types/                        # TypeScript 타입
│   │   │   └── index.ts
│   │   ├── App.tsx                       # 메인 앱 컴포넌트
│   │   ├── main.tsx                      # 진입점
│   │   └── index.css                     # 전역 스타일 (Tailwind)
│   ├── vite.config.ts                    # Vite 설정 (포트 3020, 프록시)
│   ├── tailwind.config.js                # Tailwind 설정
│   ├── package.json                      # 프론트엔드 의존성
│   └── CLAUDE.md                         # 프론트엔드 개발 가이드
│
├── secrets/                              # Git Submodule (환경 변수)
│   ├── .env.development                 # 개발 환경 변수
│   ├── .env.example                     # 환경 변수 템플릿
│   └── README.md                        # Secrets 관리 가이드
├── package.json                          # 루트 오케스트레이션
├── README.md                             # 프로젝트 문서
├── CONTEXT.md                            # 이 파일
└── .gitignore                            # Git 제외 파일
```

## API 엔드포인트

### 인증 API
- `POST /api/auth/register` - 회원가입
  - 요청: `{ username, email, password, fullName? }`
  - 응답: `{ token, username, email, fullName }`
- `POST /api/auth/login` - 로그인
  - 요청: `{ username, password }`
  - 응답: `{ token, username, email, fullName }`
- `POST /api/auth/logout` - 로그아웃
- `GET /oauth2/authorization/google` - Google 소셜 로그인 시작
- `GET /login/oauth2/code/google` - Google OAuth2 콜백 (자동 처리)

### 게시판 API
- `GET /api/boards?page={page}&size={size}` - 게시글 목록 (공개)
- `GET /api/boards/{id}` - 게시글 상세 (공개, 조회수 증가)
- `POST /api/boards` - 게시글 생성 (인증 필요)
- `PUT /api/boards/{id}` - 게시글 수정 (인증 필요, 작성자만)
- `DELETE /api/boards/{id}` - 게시글 삭제 (인증 필요, 작성자만)
- `GET /api/boards/search?keyword={keyword}&page={page}&size={size}` - 게시글 검색 (공개)
- `GET /api/boards/user/{username}?page={page}&size={size}` - 사용자별 게시글 (공개)

### 댓글 API
- `GET /api/boards/{boardId}/comments` - 게시글의 댓글 목록 조회
- `POST /api/boards/{boardId}/comments` - 댓글 작성 (인증 필요)
- `PUT /api/comments/{id}` - 댓글 수정 (작성자만)
- `DELETE /api/comments/{id}` - 댓글 삭제 (작성자만)

## 데이터 모델

### User
```
id: Long (PK, AUTO_INCREMENT)
username: String (UNIQUE, NOT NULL, max 50)
email: String (UNIQUE, NOT NULL, max 100)
password: String (NOT NULL, BCrypt 암호화)
fullName: String (max 100)
createdAt: LocalDateTime (자동)
updatedAt: LocalDateTime (자동)
```

### Board
```
id: Long (PK, AUTO_INCREMENT)
title: String (NOT NULL, max 200)
content: Text (NOT NULL)
author: User (FK, LAZY)
viewCount: Integer (기본값 0)
createdAt: LocalDateTime (자동)
updatedAt: LocalDateTime (자동)
```

### Comment
```
id: Long (PK, AUTO_INCREMENT)
content: Text (NOT NULL)
author: User (FK, LAZY)
board: Board (FK, LAZY)
createdAt: LocalDateTime (자동)
updatedAt: LocalDateTime (자동)
```

## 개발 워크플로

### 로컬 개발 환경 설정

1. **저장소 클론 및 서브모듈 초기화**
   ```bash
   git clone https://github.com/shsh99/board_test.git
   cd board_test
   git submodule update --init --recursive
   ```

2. **의존성 설치**
   ```bash
   npm install                # 루트 (concurrently)
   cd frontend && npm install # 프론트엔드
   ```

3. **환경 변수 설정**
   ```bash
   cp secrets/.env.development backend/.env
   ```

4. **백엔드 실행** (IDE 권장)
   - IntelliJ IDEA: `backend` 폴더 열기 → `KanbanBoardApplication.java` 실행
   - VS Code: Spring Boot Extension Pack 설치 후 실행
   - 환경 변수는 `backend/.env` 파일에서 자동 로드됨

5. **프론트엔드 실행**
   ```bash
   cd frontend
   npm run dev
   ```

6. **접속**
   - 프론트엔드: http://localhost:3020
   - 백엔드 API: http://localhost:8020/api
   - H2 콘솔: http://localhost:8020/h2-console

### 코딩 규칙

#### 백엔드
- **패키지 구조**: 기능별 레이어 분리 (controller → service → repository)
- **예외 처리**: GlobalExceptionHandler에서 중앙 집중식 처리
- **보안**:
  - 입력 검증 (`@Valid`, `@NotBlank` 등)
  - SQL Injection 방지 (JPA 파라미터 바인딩)
  - XSS 방지 (Spring Security 기본 설정)
- **네이밍**:
  - 클래스: PascalCase
  - 메서드/변수: camelCase
  - 상수: UPPER_SNAKE_CASE
- **응답 형식**: DTO 사용 (Entity 직접 반환 금지)

#### 프론트엔드
- **컴포넌트 구조**:
  - pages/: 라우트 페이지
  - components/: 재사용 컴포넌트
  - context/: 전역 상태
- **타입 안정성**:
  - `any` 타입 최소화
  - API 응답에 타입 정의
  - Props 인터페이스 명시
- **스타일링**:
  - Tailwind 유틸리티 클래스 우선
  - 반응형: `sm:`, `md:`, `lg:` 사용
- **네이밍**:
  - 컴포넌트: PascalCase
  - 함수/변수: camelCase
  - 상수: UPPER_SNAKE_CASE
- **상태 관리**:
  - 로컬 상태: `useState`
  - 전역 상태: Context API (AuthContext)
  - 사이드 이펙트: `useEffect`

### Git 커밋 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅 (기능 변경 없음)
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드/설정 변경
```

예: `feat: 게시글 검색 기능 추가`

## 품질 기준

### 테스트 커버리지
- **목표**: 최소 80%
- **백엔드**: JUnit 5, MockMvc
- **프론트엔드**: Vitest (권장)

### 성능 목표
- **백엔드 CRUD**: 200ms 이하
- **프론트엔드 초기 로드**: 3초 이하 (3G 기준)
- **번들 크기**: 500KB 이하

### 보안 체크리스트
- [ ] SQL Injection 방지 (파라미터 바인딩)
- [ ] XSS 방지 (React 기본 이스케이핑)
- [ ] CSRF 보호 (Spring Security 설정)
- [ ] JWT 시크릿 환경 변수화
- [ ] 비밀번호 BCrypt 암호화
- [ ] CORS 프로덕션 설정 제한

## 트러블슈팅

### 포트 충돌
```bash
# Windows
netstat -ano | findstr :8020
netstat -ano | findstr :3020
taskkill /F /PID <PID>
```

### Gradle 없음
- **해결책**: IDE 사용 (IntelliJ IDEA가 Gradle 자동 처리)
- **대안**: Gradle 설치 후 `gradle wrapper --gradle-version 8.5`

### CORS 에러
- 백엔드 SecurityConfig의 `allowedOrigins` 확인
- 프론트엔드 vite.config.ts의 proxy 설정 확인

### 401 Unauthorized
- JWT 토큰 만료 여부 확인
- Authorization 헤더 형식: `Bearer <token>`
- 토큰 localStorage 저장 여부 확인

## 환경별 설정

### 개발 (dev)
- H2 인메모리 DB
- DDL auto: create-drop
- CORS: localhost:3020
- 로그 레벨: DEBUG

### 프로덕션 (prod)
- PostgreSQL
- DDL auto: validate
- CORS: 실제 도메인만
- 로그 레벨: INFO
- JWT 시크릿: 환경 변수

## 배포

### 백엔드
```bash
cd backend
./gradlew build
java -jar build/libs/kanban-board-backend-1.0.0.jar
```

### 프론트엔드
```bash
cd frontend
npm run build
# dist/ 폴더를 정적 호스팅에 업로드
```

## 참고 문서

- [README.md](README.md) - 프로젝트 전체 가이드
- [backend/CLAUDE.md](backend/CLAUDE.md) - 백엔드 개발 표준
- [frontend/CLAUDE.md](frontend/CLAUDE.md) - 프론트엔드 개발 표준
- [secrets/README.md](secrets/README.md) - 환경 변수 관리 가이드

## 주요 의존성 버전

### 백엔드
```gradle
Spring Boot: 3.2.0
Java: 21
Spring Security OAuth2 Client: 포함
JWT: 0.11.5 (jjwt)
spring-dotenv: 4.0.0
H2: runtime
Lombok: compileOnly
```

### 프론트엔드
```json
React: 19.0.0
TypeScript: 5.3.3
Vite: 5.0.8
Tailwind CSS: 3.3.6
Axios: 1.6.2
React Router: 6.21.0
```

## 구현 완료 기능

- [x] 일반 회원가입/로그인 (JWT)
- [x] Google OAuth2 소셜 로그인
- [x] 게시판 CRUD
- [x] 댓글 기능
- [x] Glassmorphism 디자인
- [x] Git Submodule 환경 변수 관리
- [x] 자동 환경 변수 로드 (spring-dotenv)

## 향후 개선사항

- [ ] 테스트 코드 작성 (백엔드/프론트엔드)
- [ ] 프로필 이미지 업로드
- [ ] 게시글 좋아요/북마크
- [ ] 실시간 알림 (WebSocket)
- [ ] 다크 모드
- [ ] 이메일 인증
- [ ] 비밀번호 찾기/재설정
- [ ] 프로덕션 데이터베이스 마이그레이션 (PostgreSQL)
- [ ] Docker 배포 설정
- [ ] CI/CD 파이프라인

---

**마지막 업데이트**: 2025-11-18
**프로젝트 버전**: 1.0.0
