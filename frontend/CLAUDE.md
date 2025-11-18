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

---

# React/TypeScript Development Standards

## Technology Stack

- React 19 with function components and hooks everywhere.
- TypeScript 5.3+, Vite 5 build tooling, Tailwind CSS 3.4 for styling, Fetch or Axios for HTTP.
- State managed with React context plus custom hooks; no external state library unless justified.

## Design Reference

- Consult frontend/DESIGN.md before altering visuals, animations, colors, or interaction patterns.
- Reuse the documented motion tokens, CSS variables, and helper utilities (page-transition, modal-overlay, panel-slide, dropdown-panel, etc.).
- Honor prefers-reduced-motion by relying on the shared hooks (useModalAnimation, usePresenceTransition, usePrefersReducedMotion) and providing graceful fallbacks.

## Project Structure

- **components**: reusable UI split into common, board, card, and other feature folders; colocate tests and stories with implementation files and provide barrel exports for each folder.
- **pages**: route-level components that orchestrate data fetching and layout composition only.
- **hooks, contexts, services, types, utils**: each folder houses a single responsibility layer; avoid circular imports.
- **public/index assets**: stay static; configuration files (Vite, Tailwind, TSConfig) remain in the project root.

## Coding Standards

### Components

- Always export named components in PascalCase and keep prop interfaces near the component definition.
- Destructure props in the signature, provide sensible defaults, and avoid spreading arbitrary objects onto DOM nodes.
- Compose small building blocks instead of large monolith components; lift state only when multiple children truly share it.
- Keep conditional UI logic declarative and store derived values in memoized helpers when they are expensive to compute.

### Custom Hooks

- Prefix every hook with `use`, encapsulate a single concern, and surface a predictable API (state, actions, metadata such as loading/error flags).
- Handle async side effects with abort controllers or guards to avoid state updates on unmounted components.
- Return stable references (useCallback/useMemo) when hooks expose functions that consumers pass down further.

### Service Layer

- Centralize HTTP calls inside services, one file per resource, and keep base URLs plus interceptors in a shared client module.
- Each service method returns typed data (DTOs defined in types/) and throws domain-specific errors that components can handle.
- Apply consistent error mapping, retry rules, and pagination helpers, and ensure all requests route through the same auth/header configuration.

### Type Definitions

- Store API contracts, DTOs, and shared interfaces inside types/ and import them everywhere instead of redefining shapes.
- Prefer exact property names that mirror backend responses; use utility types for partials or derived data, and avoid the `any` type entirely.

### Context & State Management

- Use React context only for state that truly spans distant branches (auth, theme, realtime presence, etc.); everything else should live in hooks or local component state.
- Memoize provider values, split context responsibilities to prevent re-renders, and expose accompanying hooks (useAuth, useTheme) for ergonomics.

### Styling with Tailwind

- Compose Tailwind utility classes and shared component primitives instead of custom CSS whenever possible.
- Define tokens and design decisions in src/index.css or DESIGN.md first, then reference them through CSS variables or Tailwind config extensions.
- Keep responsive breakpoints, dark-mode rules, and motion preferences consistent with the design reference.

### Error Handling

- Normalize API errors in the service layer, surface user-friendly messages, and log detailed context through a single telemetry helper.
- Provide error boundaries for route-level components and render recovery UI where appropriate.

### Testing Standards

- Use React Testing Library for component tests, covering rendering, interaction, accessibility attributes, and critical state transitions.
- Mock network calls with MSW or lightweight fetch mocks, keep snapshots minimal, and focus on behavioral assertions.
- Include tests for hooks with React Testing Library utilities, and ensure form logic, error states, and accessibility features are exercised.

## Best Practices

### Performance

- Memoize expensive calculations, use useMemo/useCallback sparingly but consistently, and split bundles by route or feature to keep the initial payload small.
- Defer non-critical data fetching, virtualize large lists, and prefer streaming or suspense patterns when available.

### Accessibility

- Use semantic HTML elements, ARIA roles/labels where required, logical tab order, and keyboard-accessible controls.
- Manage focus on modal/dialog open and close, trap focus where necessary, and announce dynamic updates to assistive tech when they impact the UI.

### Code Organization

- Keep files focused on a single concern, enforce a predictable folder hierarchy, and use index.ts files for re-exporting modules.
- Maintain clean import ordering (React, third-party, absolute aliases, relative paths) and delete unused utilities promptly.

### Environment Variables

- Prefix every client-side environment variable with `VITE_`, document them in README, and type them in vite-env declarations.
- Store private values only in .env.local or platform secrets; never commit sensitive strings.

## Code Review Checklist

- Components follow naming, structure, and typing conventions.
- Hooks manage loading/error states and clean up side effects.
- Services centralize network logic and apply consistent error handling.
- Accessibility, responsiveness, and performance considerations are addressed.
- Tests cover new behavior, and no stray console logs or unused dependencies remain.

## Development Workflow

- Install dependencies, run the Vite dev server, execute tests, lint, and build through the npm scripts declared in package.json.
- Preview production builds locally before merging and ensure Tailwind/Vite caches are cleared if styles or config files change.

## Git Workflow

- Branch from develop, keep changes scoped, follow conventional commits, and include updated tests plus documentation before opening a pull request.
- Request review, address comments promptly, and squash or rebase only when the team agrees.

## Troubleshooting

- Missing modules typically indicate incorrect alias paths or forgotten installs; verify tsconfig and vite config entries.
- Tailwind classes that do not apply usually mean the file path is absent from the content array; restart the dev server after edits.
- TypeScript complaints often track back to outdated type definitions or mismatched versions; re-run type checking after dependency updates.

## Debug Tips

- Use React DevTools, browser Network panels, and Vite's built-in overlay for runtime issues.
- Enable strict mode and source maps to catch regressions early, and rely on MSW plus Storybook (when available) for isolated debugging of components.
