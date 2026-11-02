# Domino's Renewal — Design System
> 기준: `domino/`의 실제 HTML/CSS (2026-11-02). 메인페이지 디자인 변경 없이 서브페이지 제작 시 적용. CSS 선언이 충돌하면 **나중에 로드된 규칙 및 같은 파일의 뒤쪽 규칙**을 기준으로 확인한다.

## 1. Project Overview
- 도미노피자 웹사이트 리뉴얼 포트폴리오. 주요 흐름은 프로모션 확인 → 주문 방식 선택 → 인기 메뉴 탐색 → 브랜드 경험 → 뉴스/이벤트 확인.
- 구현: HTML/CSS/JavaScript, Swiper. 기존 파일을 수정하지 않고 서브페이지에서 공통 스타일을 재사용한다.
- 참고: `index.html`, `menu.html`, `css/main.css`, `css/mega-menu.css`, `css/mobile-header.css`, `css/footer.css`, `css/menu.css`.

## 2. Brand Identity
- 강한 블루·레드와 화이트, 블랙의 대비. 식품 이미지와 큰 영문 타이포그래피로 활기 있고 명료한 브랜드 경험.
- 직선과 대각선으로 절단한 주문 CTA, 둥근 히어로 및 뉴스 카드, 두꺼운 영문 헤드라인, 움직이는 브랜드 워드마크가 반복되는 시각 언어.
- 공식 도미노피자 브랜드 전체의 가이드가 아니라 **이 리뉴얼 프로젝트에 구현된 규칙**이다.

## 3. Design Principles
1. 주문·탐색을 우선한다: 첫 화면 프로모션 아래 배달/포장/퀵오더 CTA, 이어서 BEST MENU.
2. 명확한 대비: 밝은 제품 섹션과 어두운 브랜드 영상·뉴스·푸터를 구분한다.
3. 브랜드 강조와 정보 가독성을 분리한다: 영문 대제목에는 TT Commons Pro Mono, 설명·가격·내비게이션에는 Pretendard Variable.
4. 동일한 컴포넌트는 구조·상태·반응형 규칙을 함께 재사용한다. 단순한 수치 복사보다 사용 맥락을 먼저 확인한다.
5. 실제 작동하지 않는 기능은 외부 공식 사이트로 임시 연결하지 않는다.

## 4. Color System
`css/main.css :root`의 **Primitives**:

| 변수 | 실제 HEX |
|---|---|
| `--blue-primary` | `#0193E8` |
| `--blue-dark` | `#0079C2` |
| `--red-primary` | `#FE0000` |
| `--neutral-white` | `#FFFFFF` |
| `--neutral-cream` | `#FFFBF5` |
| `--neutral-900` | `#242424` |
| `--neutral-600` | `#666666` |
| `--neutral-200` | `#E5E5E5` |
| `--brown-primary` | `#663605` |
| `--black` | `#000000` |
| `--neutral-cream2` | `#FBF1E7` |
| `--neutral-deep-cream` | `#D2B391` |
| `--neutral-deep-cream-2` | `#C7A389` |

**Semantic aliases** (실제 CSS 변수 연결):

| 사용 상황 | Semantic → Primitive |
|---|---|
| 주요 액션 / Hover | `--action-primary → --blue-primary`; `--action-hover → --blue-dark` |
| 강한 CTA / 보조 CTA | `--action-cta → --red-primary`; `--action-cta-2 → --brown-primary` |
| 배경 | `--background-default → --neutral-cream`; `--background-white → --neutral-white`; `--background-black → --black`; `--background-subtle → --neutral-cream2` |
| 표면 | `--surface-default → --neutral-white`; `--surface-subtle → --neutral-cream` |
| 텍스트 | `--text-primary → --neutral-900`; `--text-secondary → --neutral-600`; `--text-secondary2 → --neutral-deep-cream`; `--text-secondary3 → --neutral-deep-cream-2`; `--text-inverse → --neutral-white` |
| 경계선 | `--border-default → --neutral-white` (**회색 구분선에는 직접 `--neutral-200` 사용 중**) |
| 강조 | `--accent-brand → --blue-primary`; `--accent-promotion → --red-primary` |

실사용 예: NEW 라벨은 `--action-cta`, BEST는 `--action-primary`, SIGNATURE는 `--text-primary`, LIMITED는 `--background-subtle` / `--text-secondary3`. 뉴스는 크림·레드·블루 카드가 검정 배경 위에 놓인다. 일부 파일에 `#000`, `#fff`, `rgba(...)` 직접 선언이 존재하며, 기존 코드를 변경하지 않고 새 컴포넌트에서는 의미별 변수를 우선 사용한다.

## 5. Typography
- 한글·본문: `Pretendard Variable`, `../../Font/PretendardVariable.woff2`, `@font-face font-weight:100 900`. `body` 기본 글꼴.
- 영문 강조: `TT Commons Pro Mono`, bold 700; `../Font/CSS/TT_Commons_Pro_Mono_Trial_Bold.css`에서 로드. `.eng-title`에 적용.
- **데스크톱 예시**: 헤더 GNB 18px/600/line-height 1, 사용자 링크 16px/600/1; BEST/NEWS 보조 문구 28px/600/1; 영문 섹션 제목 64px/700/1, letter-spacing -0.03em; BEST 상품명 26px/600/1.1; 설명 18px/500/1.2; 가격 18px/600; 뉴스 이벤트 제목 26px/600/1.3.
- **모바일 예시**: BEST 섹션 제목 42px (620px 이하), 상품명은 최종 767px 규칙에서 `clamp(16.8px,4.32vw,20.4px)`; 설명 `clamp(13.2px,3.48vw,15.6px)`; 뉴스 영문 제목 `clamp(28px,7vw,44px)`.
- 메뉴 서브페이지 제목 `.menu-page-title`: 128px/700/1, 자간 -0.03em; 960px 이하 `clamp(64px,9vw,112px)`, 767px 이하 `clamp(56px,13vw,88px)`.
- 텍스트의 역할에 따라 크기를 고른다. 64px은 모든 제목의 공통값이 아닌 **메인 섹션 영문 제목**의 구현값이다.

## 6. Layout & Spacing
- Header / Hero / Footer의 기준 최대 너비: **1720px**. `.header-inner`: `width:calc(100% - 40px);max-width:1720px;margin:auto`; 1100px 이하 `calc(100% - 24px)`, 모바일 헤더에서는 `calc(100% - 32px)`.
- Hero: `max-width:1720px`, 데스크톱 비율 `1720/628`, 모서리 `clamp(24px,5.814vw,100px)`; 1024px 이하 이미지 자체 높이를 사용한다.
- BEST MENU: 섹션 상하 160px/좌우 20px; 그리드 `max-width:1226px`, 데스크톱 3열 `repeat(3,minmax(0,294px))`, 가로 32px/세로 80px. 960px 이하 2열, **최종 767px 이하 규칙도 2열**(`max-width:520px`, 열 간격 24px). 620px 이하의 1열 선언보다 뒤의 767px 선언이 우선한다.
- NEWS: 데스크톱 `1068px` 폭, 카드 258×258px / 와이드 508×258px, 간격 22px, 모서리 80px. 모바일 2열 그리드와 와이드 카드 전체 폭.
- Footer: 최대 1720px; 데스크톱 `padding:100px max(24px,calc((100% - 1720px)/2)) 170px`.
- GNB는 flex의 `justify-content:space-evenly`, 헤더 전체는 `space-between`. 메뉴 카드에는 grid, 연락처·정책·SNS는 flex. 고정 gap이 아닌 유연한 정렬이 필요한 곳에서 임의의 숫자 간격을 추가하지 않는다.

## 7. Components
### Header / GNB / Mega menu
- `.site-header` 데스크톱 높이 100px, 로고 207px 기준, 메뉴 MENU/EVENT/BRAND/STORE/COUPON/가맹점, 오른쪽 고객센터/로그인.
- `.franchise-link`는 레드 배경의 비대칭 잘린 형태; 다른 일반 메뉴 항목과 시각적 우선순위를 구분한다.
- `.mega-menu`는 헤더 바로 아래 300px 높이, 흰색 배경과 `--neutral-200` 상단 경계선. `.is-open` 상태로 표시; **STORE처럼 하위 메뉴가 없는 항목에는 펼침 메뉴를 붙이지 않는다**.
- 767px 이하 데스크톱 내비게이션 숨김, 64px 헤더, 44×44px 햄버거, 오른쪽에서 열리는 `.mobile-menu` (폭 80%, 최대 420px). 메뉴 그룹은 버튼/서브메뉴, 단독 이동은 링크로 구분.

### Hero CTA
- `.hero-cta-link` 세 가지 주문 액션: 배달=레드, 포장=블루, 퀵오더=브라운. 각 `clip-path`로 대각선 절단, 양끝 pill 형태. 데스크톱 배너 위 겹침, 1024px 이하 배너 아래 배치. 링크 뒤 화살표는 `::after`로 표시.

### Product card / Labels
- `.best-menu-card` = 정사각형 상품 이미지 + 라벨 + 상품명 + 짧은 설명 + L/M 가격. 이미지는 `object-fit:contain`; 상품 정보를 이미지에 합성하지 않는다.
- `.pizza-label--new`, `--best`, `--signature`, `--limited` 4종. 콘텐츠 의미에 맞는 라벨만 사용.
- `.best-menu-more`: 2px `--neutral-200` 테두리, `border-radius:999px`, 20px/500, 내부 화살표.
- 서브페이지 `.menu-primary`는 상위 탭, `.menu-secondary`는 pill형 하위 탭; 선택 상태는 `.is-active`와 `.menu-tab-indicator`. `.menu-product-grid`에서 기존 상품 카드 스타일 재사용.

### News / Brand / Footer
- NEWS 카드 `.domino-news-card`는 큰 둥근 모서리와 컬러 블록, 이미지 reveal을 사용. 이벤트 카드는 실제 이동 가능한 링크.
- 브랜드 영상 `.domino-video-sec`: sticky 영상 + 스크롤 진행에 맞춘 자막. 띠지 `.domino-marquee-track`은 반대 방향 반복 이동.
- `.site-footer`: 메인페이지 검정 배경, 로고/SNS → 구분선 → 정책 → 연락처 → 회사 정보 → 앱 관련 정보. 서브페이지에는 기존 CSS에 **`.footer--light` 변형이 정의되어 있음**. 페이지 목적에 맞게 선택하되 메인 푸터는 변경하지 않는다.

## 8. Interaction
| 요소 | 실제 구현 상태/규칙 |
|---|---|
| GNB | hover / focus-visible 시 `--action-primary`로 색상 변경, 0.2s |
| Mega menu | `.is-open`일 때 translateY(-100%) → 0, 0.18s; opacity 페이드는 사용하지 않음 |
| Hero CTA | hover / focus-visible 시 Y -5px, 화살표 X +5px, 0.24s; focus outline 3px `--blue-dark` |
| BEST 이미지 | hover 시 `scale(1.045)`, 0.45s |
| 더보기 링크 | hover 시 테두리 블루/글자 다크 블루; focus-visible 3px outline |
| NEWS | hover / focus-within 또는 `.is-auto`에서 reveal opacity 0→1, 0.5s; 이벤트 화살표 X +8px |
| 모바일 메뉴 | overlay opacity, 패널 translateX(100%)→0, 0.25s; 아코디언 `aria-expanded`와 `hidden` |
| 메뉴 탭 | `.is-active` 색상 변경, indicator 위치·너비 0.35s |
| 푸터 이메일 표시 | 아이콘 hover 시 X +8px, 0.3s; 현재 HTML은 `span`이므로 실제 링크로 동작하지 않음 |

- `prefers-reduced-motion:reduce`에서 주요 전환/애니메이션을 중단한다. 새 서브페이지에서도 이 설정을 존중한다.
- CSS에서 `:active` 공통 스타일은 확인되지 않는다. 선택 상태는 주로 `.is-active`; 새로운 눌림 스타일을 임의의 브랜드 표준으로 선언하지 않는다.

## 9. Responsive Rules
- **1024px**: Hero 데스크톱 비율 해제, 모바일용 `picture source` 이미지, CTA 아래 배치.
- **1100px**: 헤더 텍스트·간격 압축; **1120px**: 뉴스 카드 유동 비율.
- **960px**: BEST 2열 및 메뉴 페이지 축소; **900px**: 푸터 여백 조정.
- **767px**: 모바일 헤더/햄버거, BEST 최종 2열, 뉴스 모바일 그리드, 주요 컴포넌트 모바일 값. 이 지점을 대표 모바일 기준으로 사용.
- **620px**: 추가 타이포/푸터/영상 조정. 같은 선택자가 767px 블록 뒤에 다시 선언된 경우 최종 우선순위를 반드시 확인.
- 특정 디바이스 이름보다 실제 CSS 미디어쿼리와 콘텐츠가 깨지는 지점을 기준으로 테스트한다. 1920, 1024, 767, 620px 및 더 좁은 화면을 확인한다.

## 10. Do & Don't
| Do | Don't |
|---|---|
| `var(--text-primary)`, `var(--action-primary)` 등 기존 의미별 변수를 우선 사용 | 근거 없이 새로운 색상·그리드 수치·폰트를 '브랜드 표준'으로 추가 |
| 메인 `.site-header`, `.site-footer`, 메뉴 카드의 구조와 상태를 재사용 | 서브페이지마다 헤더/푸터를 다른 디자인으로 재제작 |
| 링크는 `index.html`, `menu.html`, 내부 섹션 ID 등 **리뉴얼 프로젝트 내부 경로**로 연결 | `dominos.co.kr` 등 기존 브랜드 공식 사이트로 우회 연결 |
| 미구현 페이지는 내부 경로가 준비된 후 연결하고, 임시 `#` 링크는 기능 미구현으로 명시 | `href="#"`만 넣고 실제 이동 가능한 링크라고 설명 |
| `button`은 상태 변경, `a`는 이동에 사용; 키보드 focus 제공 | 마우스 hover만으로 핵심 기능 접근 가능하게 설계 |
| `aria-expanded`, `hidden`, `inert` 등 모바일 메뉴의 접근성 상태 유지 | 보이기만 하는 클릭 불가 텍스트를 버튼처럼 표시 |
| 반응형 규칙의 **최종 cascade**를 검토 | 중간 선언만 보고 모바일 열 수·글꼴 크기를 단정 |
| 기존 이미지·SVG·폰트 경로를 재사용 | 아이콘을 유사하게 새로 만들거나 자산 경로를 추측 |
| 필요 시 서브페이지 전용 클래스에 스타일을 한정 | 메인페이지 공통 CSS를 광범위하게 덮어써 디자인을 변경 |

### 링크 점검 메모
현재 `index.html`에는 `#event`, `#store`, `#coupon`, `#delivery` 등 임시 내부 앵커와 Instagram/Facebook/YouTube/X 외부 SNS 링크가 존재한다. 이 문서는 **기존 메인페이지 파일을 수정하지 않는다**. 향후 서브페이지에서 브랜드 공식 사이트로 연결하지 말라는 원칙을 적용할 때, SNS 등 외부 링크도 목적에 맞게 별도로 점검한다.

### Source of truth
실제 구현 파일의 선언이 이 문서보다 우선한다. 새 서브페이지 작성 시 먼저 `css/main.css`의 변수·공통 컴포넌트를 확인하고, `css/mega-menu.css`, `css/mobile-header.css`, `css/footer.css`, 해당 페이지 CSS 및 JS를 함께 검토한다.
