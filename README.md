# TodoApp

사용자 로그인 기반의 날짜별 투두리스트를 작성하고, 캘린더 UI와 함께 할 일을 관리할 수 있는 싱글 페이지 앱입니다.  
상태 관리는 Zustand, 인증은 NextAuth.js를 사용하였고, 전체 구조는 Next.js(App Router)를 기반으로 구성되었습니다.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Auth**: NextAuth
- **State Management**: Context API (user), Zustand (todos)
- **Database**: Supabase (with Prisma ORM)
- **Style**: Tailwind CSS
- **Etc**: Vercel (배포), ESLint, Prettier

---

## Features

- 로그인 및 회원가입 기능 (NextAuth + Custom API)
- 선택한 날짜에 따라 할 일 자동 필터링
- 게스트 유저의 todo는 로컬 스토리지로 분리 관리
- 커스텀 캘린더 UI (FullCalendar)와 연동
- 모달 기반의 인증 흐름 (페이지 이동 없음)

---

## 렌더링 전략 및 기술 선택 과정

Next.js의 SSR / SSG / CSR 렌더링 전략을 직접 실험하고 이해하고자 App Router 기반으로 프로젝트를 구성했습니다.  
하지만 기능 구현 과정에서 다음과 같은 판단을 통해 전체를 **CSR 중심 구조**로 유지했습니다.

### 초기 목적
- 최신 Next.js 기능(App Router, 서버 컴포넌트 등)과 사전 렌더링 전략을 직접 학습하고 비교하기 위함

### 최종 판단
- 클라이언트 상태 관리(Zustand), 로그인 컨텍스트, 외부 라이브러리(react-modal, FullCalendar) 중심의 구조로 인해 전체를 CSR로 구성하는 것이 더 적절하다고 판단

### 서버 컴포넌트 적용이 어려웠던 이유
- 로그인 여부에 따라 렌더링 결과가 달라지므로 SSG나 SSR 적용에 한계가 있음
- Zustand는 클라이언트 전용 훅 기반 라이브러리로 서버 컴포넌트에서 사용 불가
- 주요 라이브러리(react-modal, FullCalendar)는 브라우저 환경 전용
- 정적으로 보여도 대부분 상태 기반이므로 서버 컴포넌트로 분리해도 실익이 없음

### 낙관적 UI
- 할 일 추가 시 상태먼저 변경후 db에 저장하는 방식으로 수정

### tailwindcss 4.x 버전에서 3.4버전으로 다운그레이드
- vercel 배포 중 @tailwindcss/postcss 라이브러리 충돌 및 불안정으로 인함

### 로그인 방식 선택 (모달 방식)
- 페이지 이동 없이 인증을 처리할 수 있는 UX를 고려해 모달 기반 인증을 채택
- 라우팅 기반 인증 구조로 구성했다면 서버 컴포넌트 적용은 가능했겠지만, 사용자 흐름 측면에서 더 나은 구조는 아니라고 판단

### 회고
- 결과적으로 이 앱은 CSR에 최적화된 구조라는 점을 체감
- Next.js가 모든 프로젝트에 적합한 프레임워크는 아님을 실험을 통해 깨달음
- 기능 확장 계획이 없는 범위 내에서는 컴포넌트 분리 및 추상화를 최소화해 실용적인 구조로 유지

---

### 할일 완료 기능 추가
- 완료 시 할일 흐려짐, 줄긋기
- 캘린더 반영