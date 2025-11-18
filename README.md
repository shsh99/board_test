# Kanban Board - Monorepo

Spring Boot 백엔드와 React 프론트엔드로 구성된 칸반 게시판 모노레포 프로젝트입니다.
Google OAuth2 소셜 로그인, JWT 인증, 게시판 CRUD, 댓글 기능을 지원하며 모던한 Glassmorphism 디자인이 적용되어 있습니다.

## 기술 스택

### 백엔드
- Java 21
- Spring Boot 3.2
- Spring Security
- Spring OAuth2 Client (Google 소셜 로그인)
- Spring Data JPA
- H2 Database (개발용 인메모리 DB)
- JWT (JSON Web Token)
- Gradle 8.5
- JUnit 5

### 프론트엔드
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM

## 프로젝트 구조

```
board/
├── backend/          # Spring Boot 백엔드
│   ├── src/
│   ├── build.gradle
│   └── CLAUDE.md
├── frontend/         # React 프론트엔드
│   ├── src/
│   ├── package.json
│   └── CLAUDE.md
├── docs/            # 프로젝트 문서
├── package.json     # 루트 오케스트레이션
└── README.md
```

## 포트 설정

- 백엔드: `http://localhost:8020`
- 프론트엔드: `http://localhost:3020`
- API 엔드포인트: `/api/*`

## 시작하기

### 사전 요구사항

- Java 21+
- Node.js 18+
- npm 또는 yarn
- Gradle 8.5+ (또는 IntelliJ IDEA, Eclipse 등의 IDE)
- Google OAuth2 클라이언트 ID 및 시크릿 (소셜 로그인 사용 시)

### 설치

```bash
# 1. 루트에서 concurrently 설치
npm install

# 2. 프론트엔드 의존성 설치
cd frontend
npm install
cd ..

# 3. Secrets 서브모듈 초기화 (환경 변수 파일 포함)
git submodule update --init --recursive
# 자세한 내용은 아래 "환경 변수 및 Secrets 관리" 섹션 참조
```

### 환경 변수 및 Secrets 관리

이 프로젝트는 민감한 정보(API 키, 시크릿 등)를 **Git Submodule**로 관리합니다.

#### Secrets 저장소 초기화

프로젝트 클론 후 반드시 서브모듈을 초기화해야 합니다:

```bash
# 서브모듈 초기화
git submodule update --init --recursive

# 환경 변수 확인
cat secrets/.env.development
```

#### 환경 변수 파일 구조

```
secrets/
├── .env.development      # 개발 환경 변수 (실제 값 포함)
├── .env.production       # 프로덕션 환경 변수 (실제 값 포함)
├── .env.example          # 환경 변수 템플릿 (예시 값)
└── README.md             # Secrets 저장소 가이드
```

#### 환경 변수 사용 방법

**Spring Boot (Backend)**
- IntelliJ IDEA: Run Configuration → Environment Variables 설정
- VS Code: launch.json에 env 설정 추가
- 명령줄:
  ```bash
  # Windows (PowerShell)
  $env:GOOGLE_CLIENT_ID="your-client-id"
  $env:GOOGLE_CLIENT_SECRET="your-client-secret"
  ./gradlew bootRun

  # Linux/Mac
  export $(cat secrets/.env.development | xargs)
  ./gradlew bootRun
  ```

**주요 환경 변수**:
- `GOOGLE_CLIENT_ID`: Google OAuth2 클라이언트 ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth2 클라이언트 시크릿
- `JWT_SECRET`: JWT 토큰 서명 키 (최소 256비트)
- `JWT_EXPIRATION`: JWT 토큰 만료 시간 (밀리초, 기본: 86400000 = 24시간)
- `OAUTH2_REDIRECT_URI`: OAuth2 인증 성공 후 리다이렉트 URI

#### 새로운 팀원 온보딩

1. **Secrets 저장소 접근 권한 요청** (Private Repository)
2. **서브모듈 업데이트**:
   ```bash
   git submodule update --init --recursive
   ```
3. **환경 변수 확인**:
   ```bash
   cat secrets/.env.development
   ```

#### 환경 변수 업데이트 (팀원 공유)

```bash
# secrets 디렉토리로 이동
cd secrets

# 환경 변수 파일 수정
vim .env.development

# 변경사항 커밋 및 푸시
git add .env.development
git commit -m "Update environment variables"
git push origin main

# 메인 프로젝트로 돌아가기
cd ..
```

#### 다른 팀원의 업데이트 받기

```bash
cd secrets
git pull origin main
cd ..
```

⚠️ **보안 주의사항**:
- `secrets/` 저장소는 **반드시 Private Repository**로 관리
- `.env.development`, `.env.production` 파일은 실제 값 포함
- 절대로 메인 프로젝트에 민감 정보를 커밋하지 말 것

### Google OAuth2 설정

소셜 로그인 기능을 사용하려면 Google Cloud Console에서 OAuth2 클라이언트를 생성해야 합니다.

#### Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" → "사용자 인증 정보" 메뉴 선택
4. "사용자 인증 정보 만들기" → "OAuth 클라이언트 ID" 선택
5. 애플리케이션 유형: "웹 애플리케이션" 선택
6. 승인된 리디렉션 URI에 다음 추가:
   - `http://localhost:8020/login/oauth2/code/google`

생성된 클라이언트 ID와 시크릿을 `secrets/.env.development` 파일에 추가하세요.

### 개발 서버 실행

#### 방법 1: IDE 사용 (권장)

**IntelliJ IDEA, Eclipse, VS Code (Spring Boot Extension)**
1. `backend` 폴더를 IDE에서 열기
2. `KanbanBoardApplication.java` 실행
3. 백엔드 서버가 `http://localhost:8020`에서 실행됨

**프론트엔드**
```bash
cd frontend
npm run dev
```
프론트엔드가 `http://localhost:3020`에서 실행됨

#### 방법 2: 명령줄 사용 (Gradle 설치 필요)

Windows에서 Gradle이 설치되어 있다면:
```bash
# 백엔드와 프론트엔드 동시 실행
npm run dev

# 또는 개별 실행
# 백엔드만 실행
npm run dev:backend

# 프론트엔드만 실행
npm run dev:frontend
```

#### 방법 3: Gradle Wrapper 초기화 (Gradle 설치 시)

```bash
cd backend
gradle wrapper --gradle-version 8.5
cd ..
npm run dev
```

### 빌드

```bash
# 전체 빌드
npm run build

# 백엔드만 빌드
npm run build:backend

# 프론트엔드만 빌드
npm run build:frontend
```

### 테스트

```bash
# 전체 테스트
npm run test

# 백엔드 테스트
npm run test:backend

# 프론트엔드 테스트
npm run test:frontend
```

## 주요 기능

### 인증 및 보안
- 일반 회원가입/로그인 (JWT 토큰 기반)
- Google OAuth2 소셜 로그인
- 로그아웃 및 세션 관리
- JWT 인증 필터를 통한 API 보호

### 게시판
- 게시글 CRUD (생성, 조회, 수정, 삭제)
- 게시글 검색 기능 (제목, 내용, 작성자)
- 사용자별 게시글 조회
- 페이지네이션 (기본 10개씩)
- 작성자 정보 표시 (fullName 또는 username)

### 댓글
- 게시글별 댓글 작성
- 댓글 조회
- 댓글 수정/삭제
- 댓글 작성자 정보 표시

### UI/UX
- 모던한 Glassmorphism 디자인
- 반응형 디자인 (모바일/태블릿/데스크톱)
- Tailwind CSS를 활용한 세련된 UI
- 부드러운 애니메이션 효과

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /oauth2/authorization/google` - Google 소셜 로그인 시작
- `GET /login/oauth2/code/google` - Google OAuth2 콜백 (자동 처리)

### 게시판
- `GET /api/boards` - 게시글 목록 조회 (페이지네이션)
  - Query params: `page` (default: 0), `size` (default: 10)
- `GET /api/boards/{id}` - 게시글 상세 조회
- `POST /api/boards` - 게시글 생성 (인증 필요)
- `PUT /api/boards/{id}` - 게시글 수정 (작성자만)
- `DELETE /api/boards/{id}` - 게시글 삭제 (작성자만)
- `GET /api/boards/search` - 게시글 검색
  - Query params: `keyword`, `page`, `size`
- `GET /api/boards/user/{username}` - 특정 사용자의 게시글 조회

### 댓글
- `GET /api/boards/{boardId}/comments` - 게시글의 댓글 목록 조회
- `POST /api/boards/{boardId}/comments` - 댓글 작성 (인증 필요)
- `PUT /api/comments/{id}` - 댓글 수정 (작성자만)
- `DELETE /api/comments/{id}` - 댓글 삭제 (작성자만)

## 프로젝트 아키텍처

### 백엔드 구조
```
backend/src/main/java/com/kanban/board/
├── config/                      # 설정 클래스
│   ├── SecurityConfig.java      # Spring Security 설정
│   ├── PasswordEncoderConfig.java
│   └── WebConfig.java           # CORS 설정
├── controller/                  # REST API 컨트롤러
│   ├── AuthController.java      # 인증 관련 API
│   ├── BoardController.java     # 게시판 API
│   └── CommentController.java   # 댓글 API
├── dto/                         # 데이터 전송 객체
├── entity/                      # JPA 엔티티
│   ├── User.java
│   ├── Board.java
│   └── Comment.java
├── oauth/                       # OAuth2 관련
│   ├── CustomOAuth2UserService.java
│   ├── OAuth2Attributes.java
│   ├── CustomOAuth2User.java
│   └── OAuth2AuthenticationSuccessHandler.java
├── repository/                  # JPA 리포지토리
├── security/                    # 보안 관련
│   ├── JwtUtil.java            # JWT 유틸리티
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
└── service/                     # 비즈니스 로직
```

### 프론트엔드 구조
```
frontend/src/
├── api/                         # API 클라이언트
│   ├── axios.ts                 # Axios 인스턴스 (인터셉터 포함)
│   ├── auth.ts                  # 인증 API
│   ├── board.ts                 # 게시판 API
│   └── comment.ts               # 댓글 API
├── components/                  # 재사용 가능한 컴포넌트
│   ├── Navbar.tsx               # 네비게이션 바
│   └── PrivateRoute.tsx         # 인증된 사용자 전용 라우트
├── context/                     # React Context
│   └── AuthContext.tsx          # 인증 상태 관리
├── pages/                       # 페이지 컴포넌트
│   ├── Login.tsx                # 로그인 페이지
│   ├── Register.tsx             # 회원가입 페이지
│   ├── OAuth2Redirect.tsx       # OAuth2 콜백 페이지
│   ├── BoardList.tsx            # 게시글 목록
│   ├── BoardDetail.tsx          # 게시글 상세
│   ├── BoardForm.tsx            # 게시글 작성/수정
│   └── MyBoards.tsx             # 내 게시글
├── types/                       # TypeScript 타입 정의
└── App.tsx                      # 메인 앱 컴포넌트
```

## 주요 기술 구현

### JWT 인증
- 로그인 성공 시 JWT 토큰 발급
- 모든 API 요청에 `Authorization: Bearer {token}` 헤더 포함
- Axios 인터셉터를 통한 자동 토큰 주입
- 401 에러 시 자동 로그아웃 및 로그인 페이지 리다이렉트

### OAuth2 소셜 로그인
- Google OAuth2 Authorization Code Flow 구현
- 소셜 로그인 시 사용자 정보 자동 저장 (email, fullName)
- 중복 이메일 체크 및 사용자 정보 업데이트
- OAuth2 성공 시 JWT 토큰 발급 및 프론트엔드로 리다이렉트

### 보안
- Spring Security 기반 인증/인가
- 비밀번호 BCrypt 암호화
- CORS 설정 (localhost:3020 허용)
- CSRF 보호 비활성화 (JWT 사용)
- H2 Console 개발 환경에서만 접근 가능

### 데이터베이스
- H2 인메모리 데이터베이스 사용
- 서버 재시작 시 데이터 초기화
- 엔티티 간 연관관계 (User ↔ Board ↔ Comment)

## 문제 해결 (Troubleshooting)

### 백엔드 실행 오류

**문제**: `Cannot resolve symbol 'springframework'`
**해결**: IDE에서 Gradle을 다시 로드하거나 `gradle clean build` 실행

**문제**: 포트 8020이 이미 사용 중
**해결**:
```bash
# Windows
netstat -ano | findstr :8020
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:8020 | xargs kill -9
```

### OAuth2 로그인 오류

**문제**: `authorization_request_not_found`
**해결**:
- `SecurityConfig`에서 `SessionCreationPolicy`가 `IF_REQUIRED`로 설정되어 있는지 확인
- Google Cloud Console에서 리디렉션 URI가 정확히 설정되어 있는지 확인

**문제**: 한글 이름이 URL에서 깨짐
**해결**: 이미 `OAuth2AuthenticationSuccessHandler`에서 `.encode()` 메서드로 처리됨

### 프론트엔드 실행 오류

**문제**: `CORS policy` 에러
**해결**: 백엔드의 `WebConfig`에서 CORS 설정 확인 (이미 설정됨)

**문제**: 로그인 후에도 게시글 작성 불가
**해결**: localStorage에 token이 저장되어 있는지 확인
```javascript
console.log(localStorage.getItem('token'));
```

## 데이터베이스 초기화

H2 인메모리 데이터베이스는 서버 재시작 시 자동으로 초기화됩니다.

```bash
# 백엔드 프로세스 종료 (Windows)
taskkill /F /IM java.exe

# 백엔드 재시작
cd backend
./gradlew.bat bootRun
```

## H2 Console 접속

개발 중 데이터베이스를 확인하려면:

1. 백엔드 서버 실행
2. 브라우저에서 `http://localhost:8020/h2-console` 접속
3. JDBC URL: `jdbc:h2:mem:kanban`
4. Username: `sa`
5. Password: (비워둠)

## 개발 가이드

- 백엔드: [backend/CLAUDE.md](backend/CLAUDE.md)
- 프론트엔드: [frontend/CLAUDE.md](frontend/CLAUDE.md)

## 향후 개발 계획

- [ ] 프로필 이미지 업로드 기능
- [ ] 게시글 좋아요/북마크 기능
- [ ] 실시간 알림 (WebSocket)
- [ ] 다크 모드
- [ ] 이메일 인증
- [ ] 비밀번호 찾기/재설정
- [ ] 프로덕션 데이터베이스 마이그레이션 (PostgreSQL/MySQL)

## 라이선스

MIT
