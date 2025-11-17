# Frontend Development Guide

## 기술 스택

- React 19
- TypeScript
- Vite
- React Router DOM v6
- Axios
- Tailwind CSS

## 프로젝트 구조

```
frontend/
├── src/
│   ├── api/                    # API 클라이언트
│   │   ├── axios.ts           # Axios 인스턴스 설정
│   │   ├── auth.ts            # 인증 API
│   │   └── board.ts           # 게시판 API
│   ├── components/            # 재사용 컴포넌트
│   │   └── Navbar.tsx         # 네비게이션 바
│   ├── context/               # Context API
│   │   └── AuthContext.tsx    # 인증 컨텍스트
│   ├── pages/                 # 페이지 컴포넌트
│   │   ├── Login.tsx          # 로그인 페이지
│   │   ├── Register.tsx       # 회원가입 페이지
│   │   ├── BoardList.tsx      # 게시글 목록
│   │   ├── BoardDetail.tsx    # 게시글 상세
│   │   └── BoardForm.tsx      # 게시글 작성/수정
│   ├── types/                 # TypeScript 타입 정의
│   │   └── index.ts
│   ├── App.tsx                # 메인 앱 컴포넌트
│   ├── main.tsx               # 진입점
│   └── index.css              # 전역 스타일
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 주요 기능

### 인증 관리

- AuthContext를 통한 전역 인증 상태 관리
- localStorage에 토큰 및 사용자 정보 저장
- 자동 로그인 (토큰 유효 시 페이지 새로고침 후에도 로그인 유지)
- 401 에러 시 자동 로그아웃 및 로그인 페이지 리다이렉트

### API 통신

- Axios 인터셉터를 통한 토큰 자동 포함
- 에러 핸들링 및 자동 로그아웃
- Proxy 설정으로 개발 환경에서 CORS 문제 해결

### 라우팅

- React Router v6 사용
- 인증이 필요한 페이지는 로그인 체크

### 스타일링

- Tailwind CSS 사용
- 반응형 디자인
- 일관된 색상 스킴 (파란색 primary)

## 개발 가이드라인

### 컴포넌트 작성

- 함수형 컴포넌트 사용
- React Hooks 활용
- Props 타입은 TypeScript 인터페이스로 정의

### 상태 관리

- useState: 컴포넌트 로컬 상태
- useContext: 전역 상태 (인증)
- useEffect: 사이드 이펙트 처리

### API 호출

- async/await 패턴 사용
- try-catch로 에러 핸들링
- 로딩 상태 관리

### 타입 안정성

- any 타입 사용 최소화
- API 응답에 대한 타입 정의
- 컴파일 타임 에러 체크

## 실행 방법

### 개발 서버 실행

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:3020` 접속

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 프리뷰

```bash
npm run preview
```

## API 프록시 설정

`vite.config.ts`에서 백엔드 API 프록시 설정:

```typescript
server: {
  port: 3020,
  proxy: {
    '/api': {
      target: 'http://localhost:8020',
      changeOrigin: true,
    }
  }
}
```

## 환경 변수

`.env.local` 파일에서 환경별 설정 가능:

```
VITE_API_BASE_URL=http://localhost:8020
```

## 코딩 컨벤션

### 파일 명명

- 컴포넌트: PascalCase (예: `BoardList.tsx`)
- 유틸리티: camelCase (예: `axios.ts`)
- 타입: PascalCase (예: `User`, `Board`)

### 컴포넌트 구조

```typescript
import { useState, useEffect } from 'react';

export default function ComponentName() {
  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // Side effects
  }, []);

  // Handlers
  const handleAction = () => {
    // Handle action
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Tailwind CSS 사용

- 유틸리티 클래스 우선 사용
- 반복되는 스타일은 컴포넌트로 추출
- 반응형 디자인: `sm:`, `md:`, `lg:` 접두사 활용

## 보안 고려사항

### XSS 방지

- React의 기본 XSS 방어 활용
- dangerouslySetInnerHTML 사용 금지
- 사용자 입력 검증

### 인증 토큰 관리

- localStorage에 JWT 토큰 저장
- API 요청 시 Authorization 헤더에 자동 포함
- 토큰 만료 시 자동 로그아웃

### 환경 변수

- 민감한 정보는 환경 변수로 관리
- 클라이언트 번들에 시크릿 포함 금지
- VITE_ 접두사로 노출 제어

## 성능 최적화

### 번들 크기 최적화

- 코드 스플리팅 (React.lazy)
- Tree shaking 활용
- 이미지 최적화

### 렌더링 최적화

- useMemo, useCallback 활용
- 불필요한 리렌더링 방지
- 가상 스크롤 (긴 목록의 경우)

### 네트워크 최적화

- API 응답 캐싱
- 페이지네이션
- 지연 로딩

## 테스트

- Vitest 또는 Jest 사용 권장
- 컴포넌트 단위 테스트
- 통합 테스트
- E2E 테스트 (Playwright 또는 Cypress)

## 주의사항

- 프로덕션 빌드 전 린트 체크 필수
- TypeScript strict 모드 사용 권장
- 접근성(a11y) 고려
- 브라우저 호환성 확인
