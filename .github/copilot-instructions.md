## 빠른 참조

```bash
yarn install          # 의존성 설치 (45초) - 모든 작업 전 필수
yarn dev              # 개발 서버 (HMR, SSR, 포트 5173)
yarn build            # 프로덕션 빌드
yarn build && yarn preview  # 프로덕션 미리보기
yarn commit           # 대화형 커밋 (commitizen)
```

## 프로젝트 셋업

### 기술 스택

| 분류     | 라이브러리        | 버전 |
| -------- | ----------------- | ---- |
| UI       | React             | ^19  |
| 언어     | TypeScript        | ~5.9 |
| 번들러   | Vite              | ^7   |
| 서버     | Express           | ^5   |
| 라우터   | React Router DOM  | ^7   |
| 스타일   | Tailwind CSS      | ^4   |
| 스타일   | styled-components | ^6   |
| 상태관리 | Zustand           | ^5   |

### 프로젝트 구조

```
src/
├── entry-client.tsx   # 클라이언트 엔트리 (hydrateRoot)
├── entry-server.tsx   # 서버 엔트리 (renderToPipeableStream)
├── assets/            # 정적 자산
├── components/        # 공통 컴포넌트
├── lib/               # 공유 라이브러리 (기존 구현 우선 사용)
├── pages/             # 페이지 컴포넌트
│   ├── Router.tsx     # 라우트 정의
│   ├── Home.tsx
│   ├── Driver.tsx
│   ├── Passenger.tsx
│   └── NotFound.tsx
└── utils/             # 범용 유틸리티
```

### 라우트 구조

| 경로         | 컴포넌트    |
| ------------ | ----------- |
| `/`          | `Home`      |
| `/driver`    | `Driver`    |
| `/passenger` | `Passenger` |
| `*`          | `NotFound`  |

### SSR 아키텍처

- **서버**: `server.js` (Express) → `entry-server.tsx`의 `render()` 호출 → `renderToPipeableStream` + `StaticRouter`
- **클라이언트**: `entry-client.tsx` → `hydrateRoot` + `BrowserRouter`
- 브라우저 전용 API는 반드시 `typeof window !== "undefined"` 검사 필수

### TypeScript 설정

- `strict: true` — 엄격 모드 활성화
- `noUnusedLocals` / `noUnusedParameters: true` — 미사용 변수/파라미터 오류
- Path alias: `@/` → `src/` (절대 경로 import 사용)

### 개발 환경

- GitHub Codespaces 환경: HMR WebSocket은 HTTPS 포트(443)를 통해 통신
- 포트: 5173 (고정)

## 코드 규칙

### 길이 규칙

코드 길이는 150줄을 넘을 수 없다.

### Export 규칙

- **중첩 re-export 금지**: 코드 유지보수를 어렵게 하므로 다른 모듈에서 가져온 것을 다시 내보내지 않는다.
- 예시:

  ```typescript
  // ❌ 금지: 중첩 re-export
  // calculator.ts
  export { getDistance } from "./distanceUtils";

  // ✅ 권장: 원본 모듈에서 직접 import
  // index.ts
  export { getDistance } from "./controlStage/distanceUtils";
  ```

### 명명 규칙

변수명은 일반적으로 가장 많이 사용되는 명칭을 써야함.

| 대상        | 규칙       | 예시                    |
| ----------- | ---------- | ----------------------- |
| 변수        | camelCase  | `isLoading`, `hasError` |
| 상수        | UPPER_CASE | `MAX_RETRY_COUNT`       |
| 함수/클래스 | PascalCase | `GetWeatherData`        |
| 파일 (.ts)  | camelCase  | `weatherApi.ts`         |
| 파일 (.tsx) | PascalCase | `WeatherOverlay.tsx`    |

### 타입 규칙

- `any` 사용 금지 → 구체적 타입 또는 `unknown` 사용
- 객체 형태: `interface` / union, primitive: `type`
- 도메인별 타입은 해당 모듈 내 정의 (예: `src/shared/weather/weatherTypes.ts`)

### src/utils 규칙

- **범용성 필수**: 도메인 특화 로직은 `shared/{domain}/`에 위치
- 날씨 관련 → `shared/weather/`, 지역 관련 → `shared/area/`

### 라이브러리 사용 규칙

- **기존 라이브러리 우선 사용**: `src/lib`에 이미 구현된 기능은 직접 구현하지 않고 기존 라이브러리를 사용한다.

  ```typescript
  // ❌ 금지: 이미 있는 기능 직접 구현
  function calculateDistance(pos1: LatLng, pos2: LatLng): number {
    // 직접 구현...
  }

  // ✅ 권장: 기존 라이브러리 사용
  import { getDistance } from "@/shared/lib";
  ```

### 코드 일관성 규칙

- **동일 기능 동일 로직 사용**: 같은 기능을 수행하는 코드는 반드시 동일한 로직을 사용해야 한다. 서로 다른 로직으로 구현된 중복 코드는 허용되지 않는다.

  ```typescript
  // ❌ 금지: 같은 기능을 다른 로직으로 구현
  // fileA.ts
  function getDistance(pos1, pos2) {
    /* 로직 A */
  }
  // fileB.ts
  function calculateDist(p1, p2) {
    /* 로직 B */
  }

  // ✅ 권장: 하나의 공유 함수 사용
  // shared/lib/latlng/latlngMath.ts
  export function getDistance(pos1, pos2) {
    /* 단일 로직 */
  }
  // 다른 파일에서 import하여 사용
  import { getDistance } from "@/shared/lib";
  ```

### SSR 호환성

```typescript
// 브라우저 API 사용 시 필수 검사
if (typeof window !== "undefined") {
  // 브라우저 전용 코드
}
```

## 커밋 규칙

**형식:** `type(scope): subject`
**타입:** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

## 주의사항

1. **빌드 검증**: 변경 후 `yarn build` 실행하여 오류 검증 필수
2. **런타임 검증 필수**: 빌드 성공만으로는 모든 오류를 확인할 수 없음. `yarn dev`로 개발 서버를 실행하여 런타임 오류 검증
3. \*_하드코딩 금지_
4. **순환 의존성 금지**: 레이어 간 단방향 의존성 유지
5. **JSDoc 작성**: 함수/메서드에 JSDoc 형식 주석
