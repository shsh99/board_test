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

---

# Java/Spring Boot Development Standards

## Technology Stack
- Java 17 LTS with modern language features adopted across the codebase.
- Spring Boot 3.2 orchestrated through Gradle Kotlin DSL builds.
- H2 database for development, PostgreSQL for production, Spring Data JPA/Hibernate for persistence.

## Modern Java Guardrails
- Favor recent platform capabilities (var, records, streams, Optionals, text blocks, switch expressions, pattern matching) whenever they clarify intent and reduce boilerplate.
- Restrict var to local variables with obvious types; never use it for fields, parameters, or values whose type is unclear.
- Use records for immutable DTOs and lightweight value objects; keep classic classes when validation annotations, inheritance, or mutability are required.
- Prefer immutable collection factory methods (List.of, Map.of, Set.of) and only fall back to mutable constructors when necessary.
- Keep stream pipelines side-effect free, end them with clear terminal operations, and avoid collecting into structures that are immediately copied.
- Wrap nullable results in Optional, forbid null returns from public APIs, and centralize optional-handling helpers for consistency.
- Use text blocks for multi-line literals, switch expressions for concise branching, pattern matching for instanceof checks, and modern exception types that preserve stack traces.
- Modern Java checklist: rely on immutable data structures, document any legacy API usage, enforce new-language lint rules, and keep IDE/shared formatter settings aligned.

## Project Structure & Layer Responsibilities
- **Controllers** stay thin: expose REST endpoints, trigger validation, convert requests to service commands, and map service responses to DTOs without business logic or persistence code.
- **Services** own transactional boundaries, orchestrate repositories, enforce business rules, convert between entities and DTOs, and ensure pagination conversions happen while the transaction is active.
- **Repositories** declare descriptive query methods per aggregate, encapsulate pagination and sorting defaults, and prefer derived queries or targeted JPQL instead of ad-hoc implementations.
- **Entities** contain persistence-only concerns with auditing timestamps, lazy relationships by default, explicit ownership of associations, and value objects for complex fields.
- **DTOs** are separated for requests and responses, include their own validation metadata, and provide mapper helpers so that entities never leak past the service layer.

## Naming, Validation, and Error Handling
- Apply consistent suffixes (Controller, Service, Repository, Request, Response) with PascalCase class names; command methods use verbs while read methods use prefixes like find, get, list, or count.
- Validate every inbound payload with Bean Validation annotations, activate validation at controller boundaries, and surface localized error messages through the response body.
- Global exception handling maps domain-specific errors to HTTP status codes, logs each failure exactly once, and strips internal details from client-visible responses.
- Custom exceptions communicate intent (ResourceNotFound, DuplicateResource, ValidationFailure, ForbiddenAction, etc.) and always include contextual identifiers for easier support.

## Configuration & Profile Management
- Configuration classes stay scoped to a single concern: WebMvcConfig (CORS, formatters, interceptors), RestClientConfig (HTTP client defaults, timeouts, codecs), OpenApiConfig (documentation metadata), JacksonConfig (serialization policies), AsyncConfig (executors and thread pools), JpaConfig (auditing and converters).
- Favor constructor injection, final fields, and minimal bean exposure; document any manual overrides of Spring Boot auto-configuration.
- Profiles dev, test, and prod each load dedicated property files that can be overridden via command-line arguments or environment variables at deploy time.
- Logging, connection pools, and JPA tuning parameters are centralized: structured logs with correlation IDs, HikariCP sizing per environment, batching/bulk hints enabled when safe, and SQL logging scoped to troubleshooting only.

## Testing Standards
- Unit tests isolate business logic with mocks, cover happy paths and edge cases, and run quickly without Spring context startup.
- Integration tests load the Spring container, hit REST endpoints via MockMvc or WebTestClient, and back persistence with testcontainers for deterministic data access.
- Repository tests verify custom queries, pagination ordering, and fetch strategies while resetting database state between runs.

## Best Practices & Database Guidance
- Apply SOLID principles so controllers remain slim, services cohesive, and repositories minimal.
- Follow Spring Boot idioms: constructor injection, configuration properties, no field injection, minimal manual bean wiring, and avoidance of static state.
- Manage database schema through migration tooling, index join columns and search filters, prevent N+1 queries with fetch joins or entity graphs, and paginate every read endpoint.
- **Critical pagination rule**: repositories should return entities, services must convert them to DTOs inside a transactional method, and controllers may only work with the DTO page; converting after the transaction closes triggers lazy-loading failures.
- **Transaction checklist**: mark read-only queries accordingly, resolve required lazy relationships before returning, keep fetch strategies consistent, and ensure service methods clearly express their transactional intent.

## Security & Performance
- Enforce authentication and authorization policies, validate every input, guard against injection, enable CSRF protection, and avoid leaking internal details in error payloads.
- Secure outbound HTTP calls with timeouts, retries, and circuit breakers; manage secrets outside source control and inject them via configuration properties.
- Meet performance targets through caching hot queries, batching writes, leveraging asynchronous execution for long-running work, and instrumenting metrics plus tracing for observability.

## Code Review Checklist
- Layering, naming, and package structure follow the conventions above.
- Error handling, validation, logging, and configuration updates align with standards.
- Tests accompany new behavior, pass locally, and maintain coverage expectations.
- Transaction boundaries, pagination handling, and security implications are explicitly verified.
- Documentation or comments are refreshed when behavior changes, and no hardcoded secrets remain.
