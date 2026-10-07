# AI_CODING_GUIDE.md

# Burgerking UI Coding Guide

이 문서는 `anjiyun952/firstclass` 저장소의 **현재 Burgerking 로그인 UI 코드**를 기준으로 작성한 AI 코딩 가이드입니다.

목적은 새로운 브랜드의 로그인 화면을 만들 때 기존 버거킹 UI의 **HTML 작성 방식, CSS 작성 방식, 파일 구조, 네이밍 스타일, 반응형 기준**을 유지하면서 브랜드에 필요한 부분만 변경하도록 하는 것입니다.

> 기준 파일
> - `Burgerking/Login.html`
> - `CSS/default.css`
> - `Font/CSS/BKBulPro-Bold.css`
> - `Font/CSS/SDG.css`
> - `Font/CSS/pretendardvariable.css`

---

## 1. 가장 중요한 원칙

새 화면을 만들 때 기존 코드를 전부 다른 방식으로 다시 작성하지 않는다.

우선 다음 순서로 작업한다.

1. 기존 Burgerking 코드에서 재사용할 구조를 찾는다.
2. 기존 클래스명과 CSS 작성 방식을 최대한 유지한다.
3. 새 브랜드에서 달라지는 부분만 변경한다.
4. 변경이 필요한 경우에도 현재 학생이 이해할 수 있는 HTML/CSS 기본 문법을 우선 사용한다.
5. 새로운 라이브러리나 복잡한 구조를 임의로 추가하지 않는다.
6. 기존 코드보다 더 복잡한 방법을 사용하는 경우에는 반드시 이유를 설명한다.
7. 사용자가 작성한 코드가 있다면 전체 코드를 새로 작성하기 전에 기존 코드의 문제부터 확인한다.

---

# 2. 현재 프로젝트의 파일 구조

현재 저장소의 기본 구조는 다음과 같다.

```text
firstclass
├─ Burgerking
│  ├─ Images
│  └─ Login.html
├─ CSS
│  └─ default.css
├─ Font
│  └─ CSS
│     ├─ BKBulPro-Bold.css
│     ├─ SDG.css
│     └─ pretendardvariable.css
└─ index.html
```

새 브랜드 화면을 추가할 때도 기존 구조를 우선 따른다.

예:

```text
NewBrand
├─ Images
└─ Login.html
```

공통 reset은 `CSS/default.css`를 사용하고, 브랜드별 이미지와 화면 스타일은 해당 브랜드 폴더에서 관리하는 것을 기본으로 한다.

---

# 3. HTML 기본 구조

현재 Burgerking 로그인 화면은 다음과 같은 큰 구조를 사용한다.

```html
<body>
    <div id="wrap">

        <header>
            <h1>로그인</h1>
            <button class="prev_btn">
                <span class="sr-only">이전버튼</span>
            </button>
        </header>

        <main>

            <h2 class="title">
                <span>안녕하세요:)</span>
                <span>버거킹입니다.</span>
            </h2>

            <form action="">
                <fieldset>
                    ...
                </fieldset>
            </form>

            <div class="login_link">
                ...
            </div>

            <div class="sns_login">
                <p>SNS으로 간편하게 로그인</p>

                <div class="sns_list">
                    ...
                </div>
            </div>

        </main>

    </div>
</body>
```

새 브랜드 로그인 UI에서도 기본적으로 이 흐름을 유지한다.

### 구조의 의미

| 요소 | 현재 역할 |
|---|---|
| `#wrap` | 전체 화면의 최대 너비와 배경을 담당 |
| `header` | 상단 페이지 제목과 이전 버튼 |
| `h1` | 현재 페이지 제목인 로그인 |
| `main` | 로그인 화면의 핵심 콘텐츠 |
| `.title` | 브랜드 인사말/로그인 안내 문구 |
| `form` | 로그인 입력 및 제출 영역 |
| `fieldset` | 로그인 입력 요소 그룹 |
| `.login_link` | 아이디 찾기, 비밀번호 재설정, 회원가입 |
| `.sns_login` | SNS 간편 로그인 영역 |
| `.sns_list` | SNS 로그인 버튼 목록 |

---

# 4. Semantic HTML을 우선한다

기존 Burgerking 코드를 기준으로 작업하되, HTML 요소는 단순히 디자인 모양이 아니라 **콘텐츠의 의미**를 기준으로 선택한다.

## 기본 기준

- 페이지 상단 → `header`
- 주요 콘텐츠 → `main`
- 주요 제목 → `h1`
- 하위 콘텐츠 제목 → `h2`, `h3`
- 사용자 입력 → `form`
- 입력 요소의 그룹 → `fieldset`
- 입력 설명 → `label`
- 링크 → `a`
- 버튼 동작 → `button`
- 반복되는 동일 종류 콘텐츠 → 필요하면 `ul > li`
- 단순 레이아웃 묶음 → `div`

### 중요한 기준

`div`를 무조건 많이 사용하는 것이 목표가 아니다.

다른 의미 있는 HTML 요소가 있다면 해당 요소를 우선 검토한다.

반대로 의미가 없는 단순 레이아웃 박스라면 `div`를 사용한다.

---

# 5. 제목 작성 기준

현재 Burgerking 코드는 다음과 같은 제목 구조를 사용한다.

```html
<h1>로그인</h1>

<h2 class="title">
    <span>안녕하세요:)</span>
    <span>버거킹입니다.</span>
</h2>
```

새 화면에서도 제목의 크기를 기준으로 `h1`, `h2`를 선택하지 않는다.

### 판단 기준

- `h1` → 해당 페이지를 대표하는 제목
- `h2` → 페이지 안의 주요 콘텐츠 제목
- `h3` → `h2` 안의 하위 콘텐츠 제목

글자가 크다고 반드시 `h1`을 사용하는 것은 아니다.

현재 Burgerking의 `.title`은 실제 화면에서 브랜드 인사말 역할을 한다. 새 브랜드에서도 비슷한 역할의 문구라면 기존 구조를 유지하되, 해당 문구의 의미가 제목인지 단순 안내 문구인지 먼저 판단한다.

---

# 6. 로그인 Form 구조

현재 로그인 입력 구조는 다음 패턴을 기준으로 한다.

```html
<form action="">
    <fieldset>

        <label for="email" class="email">이메일 로그인</label>

        <div class="input_box rela">
            <input
                type="email"
                id="email"
                name="email"
                placeholder="아이디(이메일)을 입력해 주세요"
            >
        </div>

        <div class="input_box rela">
            <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력해 주세요."
            >

            <button type="button" class="pw_btn">
                <span class="sr-only">비밀번호 보기</span>
            </button>
        </div>

        <div class="login-option">
            ...
        </div>

        <button type="submit" class="login-btn">
            <span>로그인</span>
        </button>

    </fieldset>
</form>
```

새 브랜드에서도 다음 순서를 우선 유지한다.

1. 로그인 안내
2. 이메일/아이디 입력
3. 비밀번호 입력
4. 비밀번호 보기 버튼
5. 로그인 옵션
6. 로그인 버튼

단, Figma 화면에서 실제 정보 구조가 달라진다면 화면의 의미를 우선한다.

---

# 7. Input 작성 규칙

현재 코드에서는 이메일과 비밀번호 입력에 다음 CSS 패턴을 사용한다.

```css
input[type="email"],
input[type="password"] {
    width: 100%;
    max-width: 1024px;
    min-width: 350px;
    height: 44px;
    padding: 20px;
    border-radius: 10px;
}
```

새 브랜드에서도 기존 UI와 비슷한 로그인 입력창이라면 이 패턴을 기본으로 사용한다.

브랜드에 따라 다음 값만 변경할 수 있다.

- 배경색
- 테두리 색
- 글자색
- placeholder 색
- border-radius
- 높이
- 간격

그러나 단순히 새로운 CSS 방식을 만드는 것보다 기존 선택자 구조를 먼저 활용한다.

---

# 8. 비밀번호 보기 버튼

현재 비밀번호 보기 버튼은 입력창을 감싸는 박스에 `position: relative`를 적용하고 버튼을 `position: absolute`로 배치한다.

```css
.input_box.rela {
    position: relative;
}

.pw_btn {
    position: absolute;
    right: 20px;
    bottom: 10px;
    width: 26px;
    height: 26px;
    background: url(Images/eye_icon.svg)
        no-repeat center / 26px 26px;
}
```

새 화면에서도 아이콘을 입력창 안쪽에 배치해야 한다면 이 방식을 우선 사용한다.

### 구조

```html
<div class="input_box rela">
    <input type="password">
    <button type="button" class="pw_btn">
        <span class="sr-only">비밀번호 보기</span>
    </button>
</div>
```

---

# 9. Checkbox 구조

현재 자동 로그인/아이디 저장은 실제 checkbox input을 숨기고 CSS의 `::before`를 이용하여 디자인된 checkbox 이미지를 보여준다.

```html
<label>
    <input type="checkbox" class="check sr-only" checked>
    <span>자동 로그인</span>
</label>
```

CSS:

```css
.login-option .check + span::before {
    content: "";
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url(Images/state=Chackbox_Disabled.svg)
        no-repeat center / contain;
}

.login-option .check:checked + span::before {
    content: "";
    background-image: url(Images/state=Chackbox_Active.svg);
}
```

새 브랜드에서 checkbox 디자인이 필요하다면 이 패턴을 우선 재사용한다.

브랜드에 맞게 변경할 수 있는 것은 주로 checkbox 이미지, 크기, 간격이다.

---

# 10. 버튼 작성 기준

현재 로그인 버튼은 다음과 같은 기본 구조를 사용한다.

```html
<button type="submit" class="login-btn">
    <span>로그인</span>
</button>
```

CSS:

```css
.login-btn {
    width: 100%;
    max-width: 1024px;
    min-width: 350px;
    height: 44px;
    border-radius: 22px;
    font-family: inherit;
    font-size: inherit;
    color: var(--placeholder-color);
    background-color: var(--primary-color);
    border: none;
    opacity: 0.2;
}
```

새 브랜드에서도 로그인 제출 버튼은 `button type="submit"`을 기본으로 한다.

단순히 링크로 이동하는 행동이면 `a`를 사용하고, 현재 화면에서 기능을 실행하는 행동이면 `button`을 사용한다.

---

# 11. 계정 관련 링크

현재 구조:

```html
<div class="login_link">
    <a href="#">아이디 찾기</a>
    <a href="#">비밀번호 재설정</a>
    <a href="#">회원가입</a>
</div>
```

CSS에서는 각 링크 사이에 `::after`를 이용해 구분선을 만든다.

```css
.login_link a::after {
    content: "";
    display: inline-block;
    width: 1px;
    height: 12px;
    background-color: var(--primary-color);
    opacity: 0.5;
}

.login_link a:last-child::after {
    content: "";
    display: none;
}
```

새 브랜드에서도 같은 형태라면 기존 구조와 CSS를 우선 유지한다.

단, 링크가 여러 개 반복되는 콘텐츠이고 정보 구조상 목록의 의미가 더 적절하다면 `ul > li > a` 구조를 검토할 수 있다.

---

# 12. SNS 로그인 영역

현재 구조:

```html
<div class="sns_login">
    <p>SNS으로 간편하게 로그인</p>

    <div class="sns_list">
        <a href="#">
            <span class="sr-only">카카오 로그인</span>
        </a>
        <a href="#">
            <span class="sr-only">네이버 로그인</span>
        </a>
        <a href="#">
            <span class="sr-only">애플 로그인</span>
        </a>
        <a href="#">
            <span class="sr-only">삼성카드로그인</span>
        </a>
    </div>
</div>
```

아이콘은 CSS의 `background-image`로 적용한다.

```css
.sns_list > a:first-child {
    background-image: url(Images/kakao_logo_icon.svg);
}

.sns_list > a:nth-child(2) {
    background-image: url(Images/naver_logo_icon.svg);
}

.sns_list > a:nth-child(3) {
    background-image: url(Images/apple_logo_icon.svg);
}

.sns_list > a:nth-child(4) {
    background-image: url(Images/samsung_logo_icon.svg);
}
```

새 브랜드에서 SNS 종류가 달라지면 이미지 파일과 해당 선택자만 변경한다.

반복되는 SNS 버튼이 많아질 경우에는 `ul > li > a` 구조도 검토할 수 있다.

---

# 13. Font 사용 방식

현재 Burgerking 코드에서는 다음 폰트를 연결한다.

```html
<link rel="stylesheet" href="../Font/CSS/BKBulPro-Bold.css">
<link rel="stylesheet" href="../Font/CSS/SDG.css">
<link rel="stylesheet" href="../Font/CSS/pretendardvariable.css">
```

CSS 변수:

```css
:root {
    --font-SDG: "SDG", sans-serif;
    --font-Pretendard: "Pretendard Variable", sans-serif;
    --font-BKR: 'BKR', sans-serif;
}
```

현재 역할은 대략 다음과 같다.

- `SDG` → 기본 본문/페이지 UI 글꼴
- `Pretendard Variable` → 링크 및 일부 UI 텍스트
- `BKR` → Burgerking 브랜드 제목

새 브랜드에서는 Burgerking 전용 폰트를 무조건 그대로 사용하는 것이 아니라, **새 브랜드에 필요한 폰트 파일이 있다면 동일한 연결 방식으로 교체**한다.

예:

```css
:root {
    --font-main: "새 브랜드 기본 폰트", sans-serif;
    --font-brand: "새 브랜드 전용 폰트", sans-serif;
}
```

---

# 14. CSS 변수 사용 방식

현재 Burgerking은 브랜드 색상을 `:root`에서 변수로 관리한다.

```css
:root {
    --primary-color: #512314;
    --Focus-color: #D62302;
    --baseborder-color: #D9CFC6;
    --inputbg-color: #FFFCF9;
    --error-primary-color: #C54734;
    --button-color: #E9DDCD;
    --placeholder-color: #EBE6E2;
    --text-color: #766053;
    --bg-color: #F4EBDC;
}
```

새 브랜드를 만들 때도 이 방식을 유지한다.

### 기본 원칙

브랜드 색상을 CSS 여러 곳에 직접 반복해서 입력하기보다 `:root` 변수로 먼저 정리한다.

예:

```css
:root {
    --primary-color: #브랜드주요색;
    --bg-color: #배경색;
    --text-color: #본문색;
    --placeholder-color: #placeholder색;
    --baseborder-color: #테두리색;
}
```

이후:

```css
body {
    color: var(--primary-color);
}

#wrap {
    background-color: var(--bg-color);
}
```

---

# 15. 전체 화면 구조와 반응형 기준

현재 Burgerking 화면의 기본 화면 영역은 다음과 같다.

```css
#wrap {
    max-width: 1024px;
    min-width: 360px;
    min-height: 100dvb;
    width: 100%;
    margin: 0 auto;
}
```

따라서 새 화면도 기본적으로:

- 화면 전체 너비를 사용
- 최대 너비를 제한
- 최소 화면 너비를 고려
- 콘텐츠를 가운데 배치
- 모바일 화면에서도 깨지지 않도록 작성

하는 방향을 유지한다.

`100dvb`는 화면의 실제 표시 영역을 기준으로 하는 단위이다.

---

# 16. Header 작성 방식

현재 header는 다음과 같다.

```css
header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
}
```

뒤로가기 버튼은 absolute로 배치한다.

```css
.prev_btn {
    width: 48px;
    left: 0;
    height: 48px;
    position: absolute;
}
```

이 구조는 가운데의 페이지 제목과 왼쪽 버튼을 독립적으로 배치하기 위한 것이다.

새 화면에서도 동일한 형태의 상단 UI라면 이 구조를 우선 사용한다.

---

# 17. Spacing 작성 방식

현재 CSS는 `margin`, `padding`, `gap`, `column-gap`을 사용하여 요소 사이의 간격을 조절한다.

예:

```css
main {
    padding: 48px 20px 90px;
}

.title {
    gap: 16px;
    margin-bottom: 50px;
}

input[type="email"] {
    margin-top: 8px;
}

.login-option {
    margin-top: 12px;
}

.sns_login {
    margin-top: 96px;
}
```

새 화면에서도 임의의 위치값을 계속 추가하기보다:

- 부모와 자식 사이 → `padding`
- 형제 요소 사이 → `margin`, `gap`
- flex 요소 사이 → `gap`, `column-gap`

을 우선 검토한다.

---

# 18. 이미지 경로 규칙

Burgerking의 이미지 파일은 다음처럼 브랜드 폴더 내부의 `Images` 폴더에 둔다.

```text
Burgerking/
└─ Images/
   ├─ back_icon.svg
   ├─ eye_icon.svg
   ├─ kakao_logo_icon.svg
   └─ ...
```

`Burgerking/Login.html`에서 이미지 경로는:

```css
background: url(Images/back_icon.svg);
```

처럼 현재 HTML 파일을 기준으로 작성한다.

새 브랜드에서도 브랜드 폴더 안에 `Images`를 만들고 해당 HTML에서 상대경로를 사용한다.

이미지 파일명을 임의로 만들지 말고 실제 파일명과 대소문자를 확인한다.

---

# 19. Accessibility 작성 방식

현재 프로젝트에서는 `.sr-only`를 사용하여 화면에는 보이지 않지만 스크린리더가 읽을 수 있는 텍스트를 제공한다.

예:

```html
<button class="prev_btn">
    <span class="sr-only">이전버튼</span>
</button>
```

아이콘만 있는 버튼이나 링크를 만들 때도 사용자의 행동을 설명하는 텍스트를 제공한다.

예:

```html
<button type="button" class="pw_btn">
    <span class="sr-only">비밀번호 보기</span>
</button>
```

새 화면에서도 이 원칙을 유지한다.

---

# 20. 새 브랜드 화면을 만들 때 바꿔야 하는 것

기본적으로 다음 항목만 브랜드에 맞게 변경한다.

### 반드시 검토

- 브랜드명
- 페이지 제목
- 인사말/안내 문구
- 브랜드 색상
- 브랜드 폰트
- 로고 및 아이콘
- SNS 로그인 종류
- 이미지 파일
- placeholder 문구
- 실제 링크 경로
- 필요한 로그인 옵션

### 기존 구조를 우선 유지

- `#wrap`
- `header`
- `main`
- `form`
- `fieldset`
- `.input_box.rela`
- `.login-option`
- `.login-btn`
- `.login_link`
- `.sns_login`
- `.sns_list`
- `.sr-only`

단, Figma의 실제 정보 구조가 달라서 기존 구조가 맞지 않는 경우에는 **왜 변경하는지 설명한 후** 변경한다.

---

# 21. 새 브랜드 작업 순서

AI는 새 화면을 만들 때 다음 순서로 작업한다.

## STEP 1. Figma 확인

먼저 확인한다.

- 화면 크기
- 전체 배경
- header 구조
- 페이지 제목
- 입력창 개수
- 버튼
- 링크
- SNS 로그인
- 간격
- 색상
- 폰트
- 아이콘

## STEP 2. 기존 Burgerking 구조와 비교

다음처럼 판단한다.

| 항목 | 기존 코드 재사용 | 변경 |
|---|---|---|
| 전체 화면 | O | 브랜드 배경색 |
| Header | O | 제목/아이콘 |
| 로그인 Form | O | 입력 내용 |
| Input | O | 색상/디자인 |
| Login Button | O | 색상/문구 |
| 계정 링크 | O | 링크 문구 |
| SNS | O | 종류/아이콘 |
| Font | 구조 유지 | 브랜드 폰트 |
| CSS 변수 | 구조 유지 | 색상값 |

## STEP 3. HTML 먼저 작성

HTML 구조와 콘텐츠를 먼저 만든다.

## STEP 4. CSS 작성

기존 CSS 패턴을 기준으로 스타일을 적용한다.

## STEP 5. 실제 화면과 비교

Figma와 브라우저를 비교하여:

- 위치
- 크기
- 간격
- 색상
- 폰트
- 이미지
- 반응형

순서로 확인한다.

---

# 22. AI가 하지 말아야 할 것

새 화면을 만들 때 다음 행동은 피한다.

### 1. 기존 코드를 전부 다른 구조로 변경

예:

```text
기존 form 구조
↓
갑자기 새로운 컴포넌트 구조
↓
새로운 CSS 시스템
```

이렇게 하지 않는다.

### 2. 필요하지 않은 라이브러리 사용

React, Bootstrap, Tailwind 등의 별도 기술을 임의로 추가하지 않는다.

현재 프로젝트는 기본 HTML/CSS/JavaScript 학습을 우선한다.

### 3. 클래스명을 지나치게 변경

기존 `.login-btn`을 갑자기 `.auth-submit-button` 등으로 바꾸지 않는다.

새 구조가 필요한 경우에만 변경한다.

### 4. CSS를 지나치게 복잡하게 작성

현재 프로젝트에서 이해하지 못할 정도로 복잡한 selector, 변수 시스템, mixin 등의 방법을 사용하지 않는다.

### 5. Figma와 관계없이 임의로 디자인 변경

AI가 보기 좋다고 생각한다는 이유만으로 Figma의 디자인을 변경하지 않는다.

---

# 23. 현재 코드에서 발견된 주의사항

이 문서는 현재 코드를 **기준으로 삼기 위한 문서**이므로 아래 항목은 기존 코드를 몰래 수정하지 않고 별도로 기록한다.

## 23-1. CSS 경로 대소문자

현재 `Login.html`에는:

```html
<link rel="stylesheet" href="../css/default.css">
```

가 작성되어 있다.

하지만 저장소 폴더 이름은:

```text
CSS
```

이다.

즉, 실제 폴더 이름과 경로의 대소문자가 다르다.

Windows 환경에서는 문제가 바로 드러나지 않을 수 있지만, 대소문자를 구분하는 환경에서는 문제가 될 수 있으므로 새 파일을 만들 때 실제 폴더명과 동일하게 작성한다.

현재 저장소 기준:

```text
../CSS/default.css
```

## 23-2. `font-size: 500`

현재 다음 코드가 있다.

```css
.login_link,
.sns_login,
.sns_list {
    font-family: var(--font-Pretendard);
    font-size: 500;
}
```

`500`은 일반적으로 글자 굵기 값으로 사용하는 숫자이므로 이 부분은 `font-size`보다 `font-weight`를 의도했을 가능성이 있다.

하지만 AI는 이 부분을 임의로 수정하지 말고, 실제 화면에서 문제가 있는지 확인한 후 사용자에게 알려준다.

## 23-3. `background-color: none`

현재:

```css
main {
    background-color: none;
}
```

이 작성은 일반적인 CSS 색상값으로 적절하지 않다.

배경을 지정하지 않는 목적이라면 해당 선언을 제거하거나 실제 필요한 값으로 수정할 수 있다.

단, 새 화면을 만드는 과정에서 기존 코드 전체를 정리하는 것은 별도 작업으로 취급한다.

## 23-4. `password` input의 label

현재 비밀번호 input에는 별도의 `label` 연결이 없다.

```html
<input type="password" name="password">
```

placeholder는 label을 완전히 대신하는 용도로 사용하면 안 된다.

새 화면을 만들 때 접근성을 고려하여 입력 요소에 적절한 설명을 연결할 필요가 있는지 확인한다.

---

# 24. 코드 수정 시 우선순위

문제가 발생하면 다음 순서로 확인한다.

1. HTML 구조가 맞는가?
2. CSS 선택자가 실제 HTML 클래스와 일치하는가?
3. 파일 경로가 맞는가?
4. 이미지 파일명이 실제 파일명과 같은가?
5. CSS 속성값이 올바른가?
6. 부모 요소의 크기나 위치가 영향을 주고 있는가?
7. 브라우저에서 실제로 적용되는 CSS인지 확인한다.
8. 마지막에 필요하면 구조 자체를 변경한다.

특히 VS Code에서 문제가 생겼다고 바로 코드를 전부 수정하지 않는다.

**코드 문제인지, 파일 경로 문제인지, 저장 문제인지, 브라우저/Live Server 문제인지 먼저 구분한다.**

---

# 25. AI 답변 방식

새 화면 제작을 요청받았을 때 AI는 다음 방식으로 답한다.

### 먼저

현재 Burgerking 코드에서 어떤 구조를 재사용할 것인지 간단하게 설명한다.

### 다음

새 브랜드에서 달라지는 부분을 정리한다.

### 그 다음

HTML → CSS 순서로 작성한다.

### 마지막

중요한 코드만 설명한다.

예:

```text
기존 구조 유지
├─ Header
├─ Login Form
├─ Account Links
└─ SNS Login

브랜드 변경
├─ Color
├─ Font
├─ Logo
└─ Text
```

---

# 26. 최종 기준

새 브랜드 로그인 UI를 만들 때 가장 중요한 것은:

> **Burgerking 코드를 그대로 복사하는 것이 아니라, Burgerking 코드에서 사용한 제작 방식과 구조를 유지하면서 새 브랜드의 디자인과 콘텐츠를 적용하는 것.**

즉,

```text
기존 Burgerking 구조
        ↓
재사용 가능한 구조 확인
        ↓
새 브랜드 Figma 분석
        ↓
필요한 부분만 변경
        ↓
HTML 구조 확인
        ↓
CSS 스타일 적용
        ↓
브라우저 테스트
```

이 과정을 기본 작업 방식으로 사용한다.

AI는 결과물만 만드는 것이 아니라, **어떤 기존 코드를 왜 재사용했고 어떤 부분을 왜 변경했는지 설명할 수 있어야 한다.**
