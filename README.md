# Taskboard-Front

프로젝트 관리 시스템의 프론트엔드 애플리케이션입니다. React 19, TypeScript, Vite를 바탕으로 이루어져 있으며, 백엔드와 연동하여 프로젝트, 회의, 사용자, 알림 관리 기능을 제공합니다.

## 주요 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 정적 타입 시스템
- **Vite** - 빌드 도구 및 개발 서버
- **React Router v7** - 페이지 라우팅
- **Zustand** - 상태 관리 (auth, project, notification 등 도메인별 스토어)
- **Redux Toolkit** - 전역 상태 관리
- **Tailwind CSS** - 스타일링
- **Axios** - HTTP 클라이언트
- **Zod** - 스키마 검증

## 프로젝트 구조

```
src/
├── app/              # 라우팅 설정
│   └── AppRouters.tsx
├── features/         # 기능별 모듈 (Feature-based architecture)
│   ├── admin/       # 관리자 기능 (제품군/단계/상태/사용자 관리)
│   ├── auth/        # 인증 기능
│   ├── main/        # 메인 대시보드, 회의, 히스토리
│   ├── notification/ # 알림 (모달, 알림 스토어)
│   ├── project/     # 프로젝트 상세 페이지, 생성/수정 모달, 긴급 프로젝트 카드
│   └── user/        # 사용자 기능 (마이페이지, 사용자 검색)
├── shared/          # 공유 자원
│   ├── components/  # 재사용 가능한 컴포넌트 (버튼, 아이콘, 입력 등)
│   ├── hooks/       # 커스텀 리액트 훅
│   ├── layout/      # 레이아웃 컴포넌트 (user/admin 레이아웃 분리)
│   ├── lib/         # 유틸리티 함수 및 API 설정 (도메인별 api 클라이언트)
│   └── types/       # 공유 타입 정의
├── assets/          # 정적 자산 (이미지, 폰트 등)
├── index.css        # 전역 스타일
└── main.tsx         # 애플리케이션 진입점
```

## 라우팅 구조

### 공개 경로
- `/` - 로그인 페이지

### 보호된 경로 (인증 필요)
- `/dashboard` - 메인 대시보드
- `/meeting` - 회의 페이지
- `/history` - 히스토리 페이지
- `/project/:id` - 프로젝트 상세 페이지
- `/project/:id/history` - 프로젝트 히스토리
- `/admin` - 관리자 페이지

모든 보호된 경로는 `ProtectedLayout` 컴포넌트로 감싸져 있으며, 인증되지 않은 사용자는 자동으로 로그인 페이지로 리다이렉트됩니다.

> 알림(Notification)은 별도 페이지/라우트 없이 헤더의 종 아이콘(`BellIcon`)을 눌러 `NotificationModal`로 조회하는 방식으로 구현되어 있습니다.

## 상태 관리

### Zustand
도메인별로 스토어가 분리되어 있습니다.

```typescript
// 인증 상태
const user = useAuthStore((state) => state.user);

// 알림 목록
const items = useNotificationStore((state) => state.items);
useNotificationStore((state) => state.fetch)(); // 내 알림 목록 조회
```

주요 스토어: `auth.store`, `project.store`, `projectStage.store`, `productGroup.store`, `stage.store`, `state.store`, `user.store`, `notifications.store`, `projectHistory.store`

### Redux Toolkit
전역 상태 관리에 사용 (상세 슬라이스는 코드 참조).

## 주요 기능

- **인증 시스템** - 로그인 및 세션 관리
- **프로젝트 관리** - 프로젝트 목록 조회 및 상세 관리, 단계별 진행 상태 표시
- **회의 기록** - 회의 정보 및 히스토리 추적
- **사용자 관리** - 사용자 프로필 및 정보 관리
- **관리자 패널** - 제품군/단계/상태/사용자 관리
- **알림** - 내 알림 목록 조회 (`NotificationModal`, `useNotificationStore`)

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 환경 설정

`.env` 파일에서 다음 환경 변수를 설정합니다:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_LOG_MODE=true   # true 설정 시 API 요청/응답 로그(shared/lib/log.ts) 출력
```

## 백엔드 연동

Axios를 통해 FastAPI 백엔드와 통신합니다. 기본 API 설정은 `shared/lib/api.ts` 및 `shared/lib/api/client.ts`에서 관리되며, 도메인별 API 함수는 `shared/lib/api/*.ts`(auth, project, projectStage, stage, state, productGroup, user, projectHistory, notifiaction 등)에 분리되어 있습니다.

## 빌드 및 배포

Vercel을 통한 자동 배포가 설정되어 있습니다 (`vercel.json` 참조).


**최종 수정**: 2026-11-09
