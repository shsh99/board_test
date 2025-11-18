# 🚀 빠른 시작 가이드

## Windows 환경에서 바로 실행하기

### 1단계: 의존성 설치 ✅

```bash
# 루트 디렉토리에서
npm install

# 프론트엔드 의존성 설치
cd frontend
npm install
cd ..
```

### 2단계: 백엔드 실행 🔧

**⚠️ 중요**: Windows에서는 IDE 사용을 강력히 권장합니다!

#### 옵션 A: IntelliJ IDEA (가장 쉬움) ⭐

1. **IntelliJ IDEA Community Edition** 다운로드 및 설치
   - https://www.jetbrains.com/idea/download/ (무료)

2. IntelliJ 실행 → `File` → `Open` → `C:\Users\MZC01-\Desktop\board\backend` 선택

3. Gradle 프로젝트 import 완료 대기 (우측 하단 진행 표시)

4. 왼쪽 프로젝트 탐색기에서:
   ```
   src/main/java/com/kanban/board/KanbanBoardApplication.java
   ```
   파일을 더블클릭하여 열기

5. 파일 내 `public static void main` 옆의 **녹색 재생 버튼(▶)** 클릭

6. 콘솔에서 다음 메시지 확인:
   ```
   Started KanbanBoardApplication in X.XXX seconds
   ```

7. 백엔드가 **http://localhost:8020** 에서 실행 중! ✅

#### 옵션 B: VS Code

1. **확장 프로그램 설치**:
   - Extension Pack for Java
   - Spring Boot Extension Pack

2. `backend` 폴더를 VS Code에서 열기

3. `KanbanBoardApplication.java` 파일 열기

4. 우측 상단 `Run` 버튼 클릭 또는 `F5` 키

#### 옵션 C: 명령줄 (Gradle 설치 필요)

```bash
# Gradle이 시스템에 설치되어 있다면
cd backend

# Gradle Wrapper 생성
gradle wrapper --gradle-version 8.5

# 백엔드 실행
gradlew.bat bootRun
```

### 3단계: 프론트엔드 실행 🎨

**새 터미널**을 열고:

```bash
cd frontend
npm run dev
```

출력 예시:
```
➜  Local:   http://localhost:3020/
```

브라우저에서 **http://localhost:3020** 접속! 🎉

---

## ✅ 실행 확인

### 백엔드 확인
- 브라우저: http://localhost:8020
- 정상이면: `{"timestamp":"...","status":404,...}` (404는 정상, API가 동작 중)

### 프론트엔드 확인
- 브라우저: http://localhost:3020
- 게시판 메인 페이지가 표시되어야 함

### H2 데이터베이스 콘솔
- URL: http://localhost:8020/h2-console
- JDBC URL: `jdbc:h2:mem:kanbandb`
- Username: `sa`
- Password: (비워두기)

---

## 🎮 애플리케이션 사용

### 1. 회원가입
1. 우측 상단 **"회원가입"** 클릭
2. 정보 입력:
   - 아이디: `testuser`
   - 이메일: `test@example.com`
   - 비밀번호: `password123`
   - 이름: `테스트유저` (선택)
3. 자동 로그인됨

### 2. 게시글 작성
1. 우측 상단 **"글쓰기"** 버튼 클릭
2. 제목과 내용 입력
3. **"작성"** 버튼 클릭

### 3. 게시글 관리
- **조회**: 목록에서 제목 클릭
- **수정**: 게시글 상세에서 **"수정"** 버튼 (본인 글만)
- **삭제**: 게시글 상세에서 **"삭제"** 버튼 (본인 글만)
- **검색**: 상단 검색창에 키워드 입력

---

## 🔧 문제 해결

### "gradlew.bat를 찾을 수 없습니다"

**해결책**: IDE 사용 (IntelliJ IDEA 또는 VS Code)
- IDE가 Gradle을 자동으로 처리해줍니다
- 별도 설치 불필요!

### "포트 8020이 이미 사용 중입니다"

```bash
# 포트 사용 프로세스 확인
netstat -ano | findstr :8020

# 프로세스 종료 (PID는 위 명령 결과에서 확인)
taskkill /F /PID <PID번호>
```

### "Java를 찾을 수 없습니다"

1. Java 17 설치: https://adoptium.net/
2. 환경 변수 설정 (자동으로 됨)
3. 터미널 재시작
4. `java -version` 확인

### "npm을 찾을 수 없습니다"

1. Node.js 설치: https://nodejs.org/ (LTS 버전)
2. 터미널 재시작
3. `node -v` 및 `npm -v` 확인

### 프론트엔드 연결 오류 (CORS, Network Error)

- 백엔드가 실행 중인지 확인: http://localhost:8020
- 백엔드를 먼저 실행한 후 프론트엔드 실행
- 브라우저 캐시 삭제 후 새로고침

---

## 📚 추가 문서

- **전체 가이드**: [README.md](README.md)
- **상세 시작 가이드**: [START.md](START.md)
- **프로젝트 컨텍스트**: [CONTEXT.md](CONTEXT.md)
- **백엔드 개발**: [backend/CLAUDE.md](backend/CLAUDE.md)
- **프론트엔드 개발**: [frontend/CLAUDE.md](frontend/CLAUDE.md)

---

## 💡 개발 팁

### IDE 없이 백엔드 실행하기

`backend/run-backend.bat` 더블클릭하면 도움말 표시

### 동시 실행 (Gradle 설치 시)

```bash
# 루트 디렉토리에서
npm run dev
```

백엔드와 프론트엔드가 동시에 실행됩니다!

### API 테스트

**Postman, Thunder Client, 또는 curl 사용**

회원가입:
```bash
curl -X POST http://localhost:8020/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

로그인:
```bash
curl -X POST http://localhost:8020/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

---

**문제가 계속되면** [CONTEXT.md](CONTEXT.md)의 "트러블슈팅" 섹션을 참고하세요! 🔍
