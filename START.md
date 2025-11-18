# 빠른 시작 가이드

## Windows 환경에서 실행하기

### 1단계: 의존성 설치

```bash
# 루트 디렉토리에서
npm install

# 프론트엔드 의존성 설치
cd frontend
npm install
cd ..
```

### 2단계: 백엔드 실행

**옵션 A: IntelliJ IDEA 사용 (가장 쉬움)**

1. IntelliJ IDEA를 실행
2. `File` → `Open` → `board/backend` 폴더 선택
3. Gradle 프로젝트로 import 될 때까지 대기
4. `src/main/java/com/kanban/board/KanbanBoardApplication.java` 파일 열기
5. 파일 내 `main` 메서드 옆의 실행 버튼(▶) 클릭
6. 콘솔에서 "Started KanbanBoardApplication" 메시지 확인
7. 브라우저에서 http://localhost:8020 접속하여 확인

**옵션 B: VS Code 사용**

1. VS Code 확장 설치:
   - Extension Pack for Java
   - Spring Boot Extension Pack
2. `board/backend` 폴더를 VS Code에서 열기
3. `KanbanBoardApplication.java` 파일 열기
4. `Run` 버튼 클릭 또는 F5 키 누름

**옵션 C: 명령줄 사용 (Gradle 설치 필요)**

```bash
# Gradle이 설치되어 있다면
cd backend
gradle wrapper --gradle-version 8.5
gradlew.bat bootRun
```

### 3단계: 프론트엔드 실행

새 터미널을 열고:

```bash
cd frontend
npm run dev
```

브라우저가 자동으로 열리거나 http://localhost:3020 을 직접 열기

### 4단계: 애플리케이션 사용

1. 회원가입: http://localhost:3020/register
2. 로그인 후 게시글 작성 및 관리

## 문제 해결

### Gradle을 찾을 수 없다는 오류

**해결책 1**: IDE 사용 (IntelliJ IDEA, Eclipse, VS Code)
- IDE가 자동으로 Gradle을 처리해줍니다

**해결책 2**: Gradle 설치
1. https://gradle.org/install/ 방문
2. Gradle 8.5 이상 다운로드 및 설치
3. 환경 변수 PATH에 Gradle bin 폴더 추가
4. 새 터미널에서 `gradle --version` 확인

**해결책 3**: Gradle Wrapper 사용
```bash
# Gradle이 시스템에 설치되어 있다면
cd backend
gradle wrapper --gradle-version 8.5

# 이제 gradlew.bat 사용 가능
gradlew.bat bootRun
```

### 포트가 이미 사용 중이라는 오류

```bash
# Windows에서 포트 사용 프로세스 확인
netstat -ano | findstr :8020
netstat -ano | findstr :3020

# 프로세스 종료 (PID는 위 명령에서 확인)
taskkill /F /PID <PID번호>
```

### Java 버전 오류

- Java 17 이상이 설치되어 있는지 확인
- `java -version` 명령으로 버전 확인
- https://adoptium.net/ 에서 Java 17 다운로드

## 데이터베이스 확인

H2 콘솔: http://localhost:8020/h2-console

- JDBC URL: `jdbc:h2:mem:kanbandb`
- Username: `sa`
- Password: (비워두기)

## API 테스트

REST 클라이언트(Postman, Thunder Client 등) 사용:

### 회원가입
```
POST http://localhost:8020/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User"
}
```

### 로그인
```
POST http://localhost:8020/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

응답에서 받은 `token`을 저장하여 다른 API 호출 시 사용

### 게시글 생성
```
POST http://localhost:8020/api/boards
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "title": "테스트 게시글",
  "content": "게시글 내용"
}
```

## 추가 정보

- 백엔드 가이드: [backend/CLAUDE.md](backend/CLAUDE.md)
- 프론트엔드 가이드: [frontend/CLAUDE.md](frontend/CLAUDE.md)
- 전체 README: [README.md](README.md)
