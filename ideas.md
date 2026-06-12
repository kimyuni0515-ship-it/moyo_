# MOYO 디자인 아이디어

## 세 가지 방향성

### 1. Academic Crimson
**테마:** 고려대학교 전통과 현대 디지털 감성의 결합
**소개:** 크림슨 레드를 중심으로 깔끔한 화이트 배경 위에 학교 정체성을 담은 신뢰감 있는 UI. 애플 캘린더의 정밀함과 노션의 미니멀함을 결합.
**확률:** 0.08

### 2. Campus Minimal
**테마:** 대학 캠퍼스 노트 감성의 미니멀 인터페이스
**소개:** 크림 화이트 배경에 크림슨 포인트, 손글씨 느낌의 타이포그래피와 격자 패턴으로 학생 감성을 표현.
**확률:** 0.04

### 3. Modern Scheduler
**테마:** 생산성 앱 스타일의 현대적 스케줄러
**소개:** 다크 네이비와 크림슨의 대비로 강렬한 인상, 그라디언트와 카드 기반 레이아웃으로 프리미엄 스케줄러 느낌.
**확률:** 0.02

---

## 선택된 방향: Academic Crimson

### Design Movement
**Korean University Digital Minimalism** — 한국 대학 문화의 정체성을 현대적 디지털 인터페이스로 재해석. 고려대학교의 크림슨 레드를 핵심 아이덴티티로 삼되, 과하지 않게 포인트로만 사용.

### Core Principles
1. **Crimson as Identity** — 크림슨 레드(#DC143C)는 버튼, 선택 상태, 강조 요소에만 사용. 배경은 순백으로 유지.
2. **Structured Clarity** — 캘린더와 그리드 기반의 명확한 정보 구조. 노션처럼 여백을 적극 활용.
3. **Mobile-First Precision** — 모바일에서 엄지 손가락으로 쉽게 조작 가능한 터치 타겟 크기와 레이아웃.
4. **Progressive Disclosure** — 단계별로 정보를 보여주어 인지 부하를 최소화.

### Color Philosophy
- **Primary (Crimson):** `#DC143C` / OKLCH `oklch(0.48 0.22 18)` — 고려대 상징색, 행동 유도 요소
- **Background:** `oklch(1 0 0)` 순백 — 캘린더처럼 깨끗한 배경
- **Foreground:** `oklch(0.15 0.01 0)` 거의 검정 — 높은 가독성
- **Muted:** `oklch(0.96 0.005 0)` 연한 회색 — 비활성 요소, 구분선
- **Accent (Crimson Light):** `oklch(0.95 0.04 18)` 연한 크림슨 — 선택된 시간 하이라이트

### Layout Paradigm
모바일 우선의 단일 컬럼 레이아웃. 각 페이지는 명확한 헤더 + 콘텐츠 + 고정 하단 버튼 구조. 캘린더 뷰는 날짜를 가로로, 시간을 세로로 배치하는 그리드 형식.

### Signature Elements
1. **Crimson Dot Indicator** — 선택된 시간 슬롯의 크림슨 원형 표시
2. **Thin Border Grid** — 캘린더 그리드의 얇은 1px 선으로 구조감 표현
3. **Floating Action Card** — 하단 고정 카드 형태의 주요 액션 버튼

### Interaction Philosophy
즉각적인 피드백. 시간 선택 시 즉시 크림슨으로 변경. 드래그로 여러 시간 한번에 선택 가능. 모든 전환은 150-200ms의 빠른 애니메이션.

### Animation
- 페이지 전환: `opacity 0→1`, `translateY 8px→0`, 200ms ease-out
- 시간 슬롯 선택: `background-color` 100ms ease-out (즉각적 피드백)
- 버튼 클릭: `scale(0.97)` 160ms ease-out
- 결과 막대: `width 0→100%` 400ms ease-out, 50ms 스태거

### Typography System
- **Display:** `Pretendard` (한글 최적화) — 헤딩, 강조 텍스트
- **Body:** `Pretendard` — 본문, 레이블
- **Mono:** `JetBrains Mono` — 그룹 코드 표시
- 크기 계층: 24px(h1) / 18px(h2) / 15px(body) / 13px(label) / 11px(caption)

### Brand Essence
**"모여" — 고려대생의 약속을 가장 빠르게 잡아주는 일정 조율 도구**
- 직관적 (Intuitive)
- 신뢰감 있는 (Trustworthy)  
- 대학생스러운 (Collegiate)

### Brand Voice
- 헤드라인: "여럿이 모일 때 가장 빠른 일정 조율"
- CTA: "지금 바로 시작하기" / "그룹 만들기"
- 금지어: "Welcome", "Get started", "플랫폼"

### Wordmark & Logo
**MOYO** — 원형 안에 'M' 자를 크림슨으로 굵게 표현. 한글 "모여"를 작게 아래에 배치. 심플하고 앱 아이콘으로도 사용 가능한 형태.

### Signature Brand Color
`#DC143C` Crimson — 고려대학교의 정체성이자 MOYO의 핵심 아이덴티티 컬러.
