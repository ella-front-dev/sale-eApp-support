# sale-eApp-support

영업지원 백오피스 실무에서 마주친 UI 문제를 본 작업에 들어가기 전에 먼저 만들어보고 검증하는 개인 실험 저장소다. 정리된 제품이 아니라, 각 문제를 붙잡고 시도했던 방법과 그 결과(성공/실패)를 남겨둔 코드 모음이다.

## 실험 목록

| 주제 | 무엇을 확인하려 했는지 | 경로 |
|---|---|---|
| Back Office (초기 실험) | 그룹→구성→답변→하위답변 4단 중첩 구조에 `react-virtuoso` 가상화를 적용하면 대량 데이터에서도 버티는지 | `src/app/(backoffice)/backoffice/page.tsx` |
| Large Form (후속 실험) | 가상화 없이 React Hook Form의 uncontrolled 방식만으로 800개 이상 입력 필드를 버틸 수 있는지 | `src/app/(backoffice)/backoffice/large-form` |
| 서식 템플릿 에디터 구조 | 사이드 트리의 선택 상태와 우측 그리드 데이터를 구조적으로 동기화할 수 있는지 | `src/app/(backoffice)/backoffice/template-editor` |
| 공통 코드 → 라벨 변환 | 서버 코드값을 화면 라벨로 바꾸는 공통 로직이 hydration 문제 없이 동작하는지 | `src/app/(backoffice)/backoffice/demo`, `value-to-label` |
| 검색 팝업 + 엑셀 다운로드 | 검색 조건 팝업과 API/클라이언트 두 방식의 엑셀 다운로드가 각각 어떤 상황에 맞는지 | `src/app/(backoffice)/backoffice/search` |
| 서식 템플릿 목록 | 목록 화면에서 상태 표시, 삭제 같은 기본 흐름이 성립하는지 | `src/app/(backoffice)/backoffice/admin` |

## 대표 실험: 대용량 중첩 폼 렌더링 (Back Office)

**문제**
서식 수정 화면 진입 시 그룹 20개 × 구성 200개 규모 데이터에서 전체 렌더링에 약 19초가 걸린다.

**시도한 방법**
`memo`/`useMemo`로 리렌더링만 줄였을 때는 부족했고, 구성을 10개씩 무한 스크롤로 나눴더니 구성 200개 이상인 그룹에서 브라우저가 멈췄다. 그룹·구성 양쪽에 `react-virtuoso`를 중첩 적용했더니 높이 계산이 깨져 화이트 스크린이 떴고, 아코디언(그룹)+무한 스크롤(구성) 조합은 누적 로딩 때문에 오히려 더 느려졌다. 최종적으로 그룹은 아코디언으로, 구성만 가상화하는 조합으로 체감할 만한 수준으로 개선됐다.

**알게 된 것**
가상화는 중첩하면 높이 계산이 깨지므로 한 레벨에만 적용해야 안정적이다. 성능은 해결됐지만 구조 자체를 다시 짜기로 했는데, "작동한다"와 "유지보수 가능하다"는 별개 문제라 판단해서였다 — 그 결과물이 위 template-editor 실험이다. Large Form 실험은 이 문제와 별개로, 애초에 가상화가 항상 필요한 건 아니라는 걸 확인하려고 이후에 따로 만든 것이다.

## 실행 방법

```bash
pnpm install
pnpm dev
```

`http://localhost:3000/backoffice`, `/backoffice/large-form`, `/backoffice/template-editor` 로 접속해서 확인.
