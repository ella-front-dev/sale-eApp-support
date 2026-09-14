# 공통 코드 시스템 사용 가이드

## 🎯 개요

API에서 제공하는 공통 코드 데이터를 React 컴포넌트에서 사용하기 쉽게 변환하고 관리하는 시스템입니다.

### API 형태 → 사용 형태 변환

```javascript
// API에서 받는 형태
[
  {
    codeid: 1,
    codeList: [
      { CodeValue: "", Codelabel: "선택하세요" },
      { CodeValue: "Y", Codelabel: "예" },
      { CodeValue: "N", Codelabel: "아니오" }
    ],
    defaultValue: { value: "", label: "선택하세요" }
  }
]

// 변환된 사용 형태
[
  {
    id: 1,
    codes: [
      { value: "", label: "선택하세요" },
      { value: "Y", label: "예" },
      { value: "N", label: "아니오" }
    ],
    defaultValue: { value: "", label: "선택하세요" }
  }
]
```

## 🔧 주요 구성 요소

### 1. codeUtils - 변환 유틸 함수 모음
- 데이터 변환 및 조회 함수들 (`formatCodeData`, `getCodesById`, `getSelectOptions` 등)
- 여러 번 조회할 때는 `createCodeUtils(formattedData)` 로 묶어서 쓴다
- 위치: `/src/lib/codeUtils.ts`

### 2. CommonCodeService & useCommonCodes Hook  
- React Hook과 캐싱 시스템
- 위치: `/src/lib/commonCodeService.ts`

### 3. API 연동
- 실제 API 호출 서비스
- 위치: `/src/lib/api/formService.ts`

## 📚 사용법

### 1. 기본 사용법 (React Hook)

```typescript
import { useCommonCodes } from '@/lib/commonCodeService';

function MyComponent() {
  const { 
    getSelectOptions, 
    getRadioOptions, 
    getDefaultValue, 
    loading, 
    error, 
    isReady 
  } = useCommonCodes();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  
  return (
    <div>
      {/* Select 컴포넌트 */}
      <Select value={value} onChange={handleChange}>
        {getSelectOptions(1, true).map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {/* Radio 컴포넌트 */}
      <RadioGroup value={value} onChange={handleChange}>
        {getRadioOptions(2).map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
```

### 2. 유틸 함수 직접 사용법

```typescript
import { formatCodeData, createCodeUtils } from '@/lib/codeUtils';

// API 데이터를 받은 후 내부 형식으로 변환
const apiData = await api.get('/common-codes');
const formattedData = formatCodeData(apiData);

// 조회가 여러 번이면 createCodeUtils 로 묶어서 사용
const codeUtils = createCodeUtils(formattedData);

// 특정 그룹의 코드들 가져오기
const codes = codeUtils.getCodes(1);

// Select 옵션 형태로 가져오기 (기본값 포함)
const selectOptions = codeUtils.getSelectOptions(1, true);

// Radio 옵션 형태로 가져오기
const radioOptions = codeUtils.getRadioOptions(1);

// 그룹의 첫 번째 코드 가져오기
const firstCode = codeUtils.getFirstCode(1);
```

### 3. Mock 데이터 사용

```typescript
// Mock 데이터 사용 (개발/테스트 시)
const { ... } = useCommonCodes('test', true);  // 두 번째 파라미터 true

// 실제 API 사용 (운영 시)
const { ... } = useCommonCodes('prod', false); // 두 번째 파라미터 false
```

## 🎨 컴포넌트 예시

### Select 컴포넌트

```typescript
<FormControl fullWidth>
  <InputLabel>카테고리</InputLabel>
  <Select
    value={formData.category}
    label="카테고리"
    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
  >
    {getSelectOptions(1, true).map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

### Radio 컴포넌트

```typescript
<FormControl>
  <Typography variant="subtitle2" gutterBottom>
    우선순위
  </Typography>
  <RadioGroup
    value={formData.priority}
    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
    row
  >
    {getRadioOptions(2).map((option) => (
      <FormControlLabel
        key={option.value}
        value={option.value}
        control={<Radio />}
        label={option.label}
      />
    ))}
  </RadioGroup>
</FormControl>
```

## ⚙️ 고급 기능

### 1. 동적 기본값 변경

```typescript
const { formatter } = useCommonCodes();

// 기본값 동적 변경
formatter?.setDefaultValue(1, 'Y', '예');
```

### 2. 캐싱 시스템
- 10분간 자동 캐싱
- 동일한 API 호출 방지
- 메모리 효율적 관리

### 3. 에러 처리
- BusinessError 자동 토스트 표시
- API 실패 시 fallback 처리
- 로딩 상태 자동 관리

## 🔍 API 엔드포인트 설정

### formService.ts에서 API 엔드포인트 변경

```typescript
// 공통코드 API 서비스
export const commonCodeService = {
  // 전체 공통코드 목록
  async getCommonCodes(): Promise<CommonCodeApiResponse[]> {
    return api.get('/api/common-codes'); // 실제 엔드포인트로 변경
  },
  
  // 특정 그룹만
  async getCommonCodeGroup(codeId: number): Promise<CommonCodeApiResponse> {
    return api.get(`/api/common-codes/${codeId}`); // 실제 엔드포인트로 변경
  }
};
```

## 🧪 테스트 & 디버깅

### 1. 데모 페이지 확인
- 경로: `/backoffice/demo`
- Mock 데이터로 모든 기능 테스트 가능

### 2. 콘솔 디버깅

```typescript
const { formatter, getAllGroups } = useCommonCodes();

// 모든 데이터 확인
console.log('모든 그룹:', getAllGroups());

// 특정 그룹 확인
console.log('그룹 1:', getCodes(1));

// 기본값 확인
console.log('그룹 1 기본값:', getDefaultValue(1));
```

### 3. 에러 모니터링
- 네트워크 탭에서 API 호출 확인
- React DevTools에서 Hook 상태 확인
- 토스트 메시지로 에러 자동 표시

## 📦 설치된 패키지

```json
{
  "react-hot-toast": "^2.4.1",  // 토스트 알림
  "uuid": "^9.0.0"               // 고유 ID 생성
}
```

## 🚀 운영 환경 배포 준비사항

1. **환경변수 설정**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-api.com
   NEXT_PUBLIC_AUTH_API_URL=https://auth-api.com
   NEXT_PUBLIC_FILE_API_URL=https://file-api.com
   ```

2. **API 엔드포인트 확인**
   - `/api/common-codes` 엔드포인트 구현 필요
   - API 응답 형태가 정의된 타입과 일치하는지 확인

3. **타입 안전성**
   - TypeScript로 모든 타입 정의됨
   - 컴파일 타임 에러 방지

## � Value → Label 치환 기능

API에서 받은 리스트 데이터의 코드 값을 사용자가 읽기 쉬운 라벨로 치환하는 기능입니다.

### 1. 단일 값 치환

```typescript
const { getCodeLabel } = useCommonCodes();

// 'Y' → '예'로 치환
const label = getCodeLabel(1, 'Y');
console.log(label); // "예"

// 테이블에서 사용
<TableCell>{getCodeLabel(1, item.status)}</TableCell>
```

### 2. 여러 값 한번에 치환

```typescript
const { getCodeLabels } = useCommonCodes();

// ['1', '3', '5'] → ['매우 불만족', '보통', '매우 만족']
const labels = getCodeLabels(2, ['1', '3', '5']);
console.log(labels); // ["매우 불만족", "보통", "매우 만족"]
```

### 3. 객체에 라벨 필드 자동 추가

```typescript
const { addCodeLabel } = useCommonCodes();

const user = { name: '홍길동', status: 'Y' };
const userWithLabel = addCodeLabel(1, user, 'status');
console.log(userWithLabel); 
// { name: '홍길동', status: 'Y', statusLabel: '예' }
```

### 4. 실제 사용 예시

```typescript
// API에서 받은 리스트 데이터
const apiData = [
  { id: 1, name: '홍길동', status: 'Y', satisfaction: '5' },
  { id: 2, name: '김철수', status: 'N', satisfaction: '3' }
];

// 테이블에서 라벨로 표시
{apiData.map(item => (
  <TableRow key={item.id}>
    <TableCell>{item.name}</TableCell>
    <TableCell>{getCodeLabel(1, item.status)}</TableCell>
    <TableCell>{getCodeLabel(2, item.satisfaction)}</TableCell>
  </TableRow>
))}
```

## �💡 사용 팁

1. **기본값 활용**: `getSelectOptions(id, true)`로 기본값 포함
2. **캐싱 활용**: 동일한 cacheKey로 여러 컴포넌트에서 공유
3. **에러 처리**: BusinessError는 자동으로 토스트 표시됨
4. **Mock 데이터**: 개발 시 Mock 데이터로 빠른 개발 가능
5. **성능 최적화**: useCallback, useMemo로 리렌더링 최적화됨
6. **Value → Label**: API 리스트 데이터의 코드 값을 쉽게 라벨로 치환

## 🎯 데모 페이지

- **기본 사용법**: `/backoffice/demo` - 공통코드 기본 기능 데모
- **Value → Label**: `/backoffice/value-to-label` - 코드 값 치환 데모

이제 모든 Select, Radio 컴포넌트에서 공통 코드를 쉽게 사용할 수 있습니다! 🎉