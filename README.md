# sale-eApp-support

영업지원 백오피스 실무에서 마주친 UI 문제를 본 작업에 들어가기 전에 먼저 만들어보고 검증하는 개인 실험 저장소다. 정리된 제품이 아니라, 각 문제를 붙잡고 시도했던 방법과 그 결과(성공/실패)를 남겨둔 코드 모음이다.

## 실험 목록

| 주제 | 무엇을 확인하려 했는지 | 경로 |
|---|---|---|
| Back Office (초기 실험) | 그룹→구성→답변→하위답변 4단 중첩 구조를 하나의 폼에 통째로 묶었을 때 대량 데이터에서 어디까지 버티는지 | `src/app/(backoffice)/backoffice/page.tsx` |
| Large Form (후속 실험) | 가상화 없이 React Hook Form의 uncontrolled 방식만으로 800개 이상 입력 필드를 버틸 수 있는지 | `src/app/(backoffice)/backoffice/large-form` |
| 서식 템플릿 에디터 구조 | 사이드 트리의 선택 상태와 우측 그리드 데이터를 구조적으로 동기화할 수 있는지 | `src/app/(backoffice)/backoffice/template-editor` |
| 공통 코드 → 라벨 변환 | 서버 코드값을 화면 라벨로 바꾸는 공통 로직이 hydration 문제 없이 동작하는지 ([사용 가이드](./COMMON_CODE_GUIDE.md)) | `src/app/(backoffice)/backoffice/demo`, `value-to-label` |
| 검색 팝업 + 엑셀 다운로드 | 검색 조건 팝업과 API/클라이언트 두 방식의 엑셀 다운로드가 각각 어떤 상황에 맞는지 | `src/app/(backoffice)/backoffice/search` |
| 서식 템플릿 목록 | 목록 화면에서 상태 표시, 삭제 같은 기본 흐름이 성립하는지 | `src/app/(backoffice)/backoffice/admin` |

## 대표 실험: 대용량 중첩 폼 렌더링 (Back Office)

**문제**
서식 수정 화면 진입 시 그룹 20개 × 구성 200개 규모 데이터에서 전체 렌더링에 약 19초가 걸린다.

**시도한 방법**
`memo`/`useMemo`로 리렌더링만 줄였을 때는 부족했고, 구성을 10개씩 무한 스크롤로 나눴더니 구성 200개 이상인 그룹에서 브라우저가 멈췄다. 그룹·구성 양쪽에 `react-virtuoso`를 중첩 적용했더니 높이 계산이 깨져 화이트 스크린이 떴고, 아코디언(그룹)+무한 스크롤(구성) 조합은 누적 로딩 때문에 오히려 더 느려졌다.

**알게 된 것**
가상화는 중첩하면 높이 계산이 깨지므로 한 레벨에만 적용해야 안정적이다. 다만 근본 원인은 렌더링 방식이 아니라 **4단 중첩 전체를 하나의 `useForm`에 등록하는 구조** 쪽이라고 판단했다. "작동한다"와 "유지보수 가능하다"는 별개 문제라서, 가상화로 증상을 덮기보다 구조를 다시 짜는 쪽을 택했다 — 그 결과물이 위 template-editor 실험이다.

**이 저장소에 남아있는 상태**
위 판단에 따라 가상화는 걷어냈다. 현재 Back Office 코드에 반영된 것은 `React.memo` + 그룹 단위 아코디언까지이고, `react-virtuoso` 의존성도 제거했다. 가상화 없이 어디까지 버티는지 따로 확인한 것이 Large Form 실험이다.

> 앱을 띄운 뒤 **`/backoffice/about`** 에 개발 과정을 정리해둔 페이지가 있다.
> 실험별 진행 내용을 훑어볼 수 있고, `Critical Performance Issues` 항목에
> 위 문제에 대해 시도한 5가지 방법을 각각 무엇을 적용했고 어디서 막혔는지로 정리해뒀다.

## 디렉토리 구조

```
src/
├─ app/              Next.js 라우트. 껍데기만 두고 실제 화면은 page-components 에서 가져온다
├─ page-components/  특정 화면 전용 컴포넌트 (라우트와 1:1)
├─ components/
│   ├─ ui/           디자인 시스템 위에 얹은 입력 계열 프리미티브
│   ├─ layout/       앱 채널 공통 레이아웃
│   ├─ demo/         실험 결과를 보여주기 위한 데모 전용 화면
│   ├─ dev/          개발 환경에서만 쓰는 도구 (MSW 초기화 등)
│   └─ context/      전역 Provider
├─ api/              기능별 API 레이어 (dto · service · use-query · mock)
├─ lib/              화면과 무관한 재사용 로직 (axios, 엑셀 변환, 공통코드)
├─ hooks/  types/  constants/  assets/  style/
```

**네이밍 규칙**
- 디렉토리는 `kebab-case` (`biz-navi`, `template-editor`)
- React 컴포넌트 파일은 `PascalCase` (`SidebarTree.tsx`)
- 그 외 파일은 `camelCase` (`excelDemoData.ts`, `mockFormData.ts`)
- 예외: `components/ui`, `components/dev`, `components/layout` 은 디자인 시스템 쪽 관례를 따라 파일명도 `kebab-case` 를 쓴다

**`components/` 와 `page-components/` 를 나눈 기준**
한 화면에서만 쓰면 `page-components/`, 여러 화면에서 쓰거나 쓸 수 있으면 `components/` 에 둔다.
`components/demo/` 는 재사용 목적이 아니라 "실험 결과를 눈으로 확인하는 화면"이라 따로 분리했다.

## 실행 방법

```bash
pnpm install
pnpm dev
```

`http://localhost:3000/backoffice`, `/backoffice/large-form`, `/backoffice/template-editor` 로 접속해서 확인.
