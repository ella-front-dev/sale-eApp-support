"use client";

import { NodeItem } from "./types";

// ⚠️ 데모용 임시(Mock) 데이터입니다. 실제 서비스 데이터가 아닙니다.
// Template Editor 화면 동작 확인을 위해 만든 샘플 구조이며, 코드값/문구는 모두 예시입니다.
const MOCK_FORM_DATA: Record<string, { formCode: string; formName: string; description: string; nodes: NodeItem[] }> = {
  "1": {
    formCode: "DEMO-0001",
    formName: "샘플 서식 템플릿 (Demo)",
    description: "Template Editor 데모용 임시 데이터입니다. 실제 서식이 아닌 예시 구조입니다.",
    nodes: [
      // GROUP 1: 샘플 그룹 - 미입력 항목
      {
        id: "grp_001",
        parentId: null,
        title: "[예시] 샘플 그룹 1 - 미입력 항목",
        type: "GROUP" as const,
        code: "DEMO_DOC_GRP_001",
        order: 16,
        processLinkYn: "Y",
        status: "ACTIVE" as const,
      },
      // ANSWER: 작성일자
      {
        id: "ans_001_001",
        parentId: "grp_001",
        title: "작성일자 (샘플)",
        type: "ANSWER" as const,
        code: "DEMO_ANSR_001",
        eacpTypeCode: "SAMPLE",
        userInptDatYn: "N",
        formatCode: "TEXT",
        dplcAnsrPssbYn: "N",
        order: 1,
        status: "ACTIVE" as const,
      },
      // ANSWER_DETAIL
      {
        id: "dtl_001_001_001",
        parentId: "ans_001_001",
        title: "작성일자",
        type: "ANSWER_DETAIL" as const,
        sqno: 1,
        controlId: "Date",
        controlValue: "",
        order: 1,
        status: "ACTIVE" as const,
      },

      // GROUP 2: 샘플 그룹 - 성명/서명
      {
        id: "grp_002",
        parentId: null,
        title: "[예시] 샘플 그룹 2 - 성명/서명",
        type: "GROUP" as const,
        code: "DEMO_DOC_GRP_002",
        order: 15,
        processLinkYn: "N",
        status: "ACTIVE" as const,
      },
      // ANSWER: 신청자서명
      {
        id: "ans_002_001",
        parentId: "grp_002",
        title: "신청자서명 (샘플)",
        type: "ANSWER" as const,
        code: "DEMO_ANSR_002",
        eacpTypeCode: "SAMPLE",
        userInptDatYn: "Y",
        formatCode: "IMGS",
        dplcAnsrPssbYn: "N",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_002_001_001",
        parentId: "ans_002_001",
        title: "신청자서명",
        type: "ANSWER_DETAIL" as const,
        sqno: 1,
        controlId: "demo_sign_input",
        controlValue: "",
        order: 1,
        status: "ACTIVE" as const,
      },
      // ANSWER: 신청자성명
      {
        id: "ans_002_002",
        parentId: "grp_002",
        title: "신청자성명 (샘플)",
        type: "ANSWER" as const,
        code: "DEMO_ANSR_003",
        eacpTypeCode: "SAMPLE",
        userInptDatYn: "Y",
        formatCode: "IMGN",
        dplcAnsrPssbYn: "N",
        order: 2,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_002_002_001",
        parentId: "ans_002_002",
        title: "신청자성명",
        type: "ANSWER_DETAIL" as const,
        sqno: 1,
        controlId: "demo_name_input",
        controlValue: "",
        order: 1,
        status: "ACTIVE" as const,
      },

      // GROUP 3: 샘플 그룹 - 안내사항 확인
      {
        id: "grp_003",
        parentId: null,
        title: "[예시] 샘플 그룹 3 - 안내사항 확인",
        type: "GROUP" as const,
        code: "DEMO_DOC_GRP_003",
        order: 1,
        processLinkYn: "N",
        status: "ACTIVE" as const,
      },
      // ANSWER: 질문1
      {
        id: "ans_003_001",
        parentId: "grp_003",
        title: "샘플 확인 질문 1",
        type: "ANSWER" as const,
        code: "DEMO_ANSR_004",
        eacpTypeCode: "SAMPLE",
        userInptDatYn: "Y",
        formatCode: "RADI",
        dplcAnsrPssbYn: "N",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_003_001_001",
        parentId: "ans_003_001",
        title: "예",
        type: "ANSWER_DETAIL" as const,
        sqno: 1,
        controlId: "demo_que1_radio",
        controlValue: "1",
        remark: "(예시) 데모 데이터입니다",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_003_001_002",
        parentId: "ans_003_001",
        title: "아니오",
        type: "ANSWER_DETAIL" as const,
        sqno: 2,
        controlId: "demo_que1_radio",
        controlValue: "2",
        remark: "(예시) 데모 데이터입니다",
        order: 2,
        status: "ACTIVE" as const,
      },

      // GROUP 4: 샘플 그룹 - 연락 방법 선택
      {
        id: "grp_004",
        parentId: null,
        title: "[예시] 샘플 그룹 4 - 연락 방법 선택",
        type: "GROUP" as const,
        code: "DEMO_DOC_GRP_004",
        order: 2,
        processLinkYn: "N",
        status: "ACTIVE" as const,
      },
      {
        id: "ans_004_001",
        parentId: "grp_004",
        title: "연락 방법 선택 (샘플)",
        type: "ANSWER" as const,
        code: "DEMO_ANSR_005",
        eacpTypeCode: "SAMPLE",
        userInptDatYn: "Y",
        formatCode: "RADI",
        dplcAnsrPssbYn: "N",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_004_001_001",
        parentId: "ans_004_001",
        title: "이메일",
        type: "ANSWER_DETAIL" as const,
        sqno: 1,
        controlId: "demo_contact_grp",
        controlValue: "1",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_004_001_002",
        parentId: "ans_004_001",
        title: "전화",
        type: "ANSWER_DETAIL" as const,
        sqno: 2,
        controlId: "demo_contact_grp",
        controlValue: "2",
        order: 2,
        status: "ACTIVE" as const,
      },
      // SUB_ANSWER: 전화 선택 시 하위 항목
      {
        id: "sub_004_001_002_001",
        parentId: "dtl_004_001_002",
        title: "통화 희망일자 (샘플)",
        type: "SUB_ANSWER" as const,
        code: "DEMO_ANSR_006",
        formatCode: "DATE",
        controlId: "demo_call_date",
        controlValue: "",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "sub_004_001_002_002",
        parentId: "dtl_004_001_002",
        title: "통화 희망시간 (샘플)",
        type: "SUB_ANSWER" as const,
        code: "DEMO_ANSR_007",
        formatCode: "DTTM",
        controlId: "demo_call_time",
        controlValue: "",
        order: 2,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_004_001_003",
        parentId: "ans_004_001",
        title: "문자메시지",
        type: "ANSWER_DETAIL" as const,
        sqno: 3,
        controlId: "demo_contact_grp",
        controlValue: "3",
        order: 3,
        status: "ACTIVE" as const,
      },

      // GROUP 5: 샘플 그룹 - 관계 선택
      {
        id: "grp_005",
        parentId: null,
        title: "[예시] 샘플 그룹 5 - 관계 선택",
        type: "GROUP" as const,
        code: "DEMO_DOC_GRP_005",
        order: 3,
        processLinkYn: "N",
        status: "ACTIVE" as const,
      },
      {
        id: "ans_005_001",
        parentId: "grp_005",
        title: "관계 선택 (샘플)",
        type: "ANSWER" as const,
        code: "DEMO_ANSR_008",
        eacpTypeCode: "SAMPLE",
        userInptDatYn: "Y",
        formatCode: "RADI",
        dplcAnsrPssbYn: "N",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_005_001_001",
        parentId: "ans_005_001",
        title: "가족",
        type: "ANSWER_DETAIL" as const,
        sqno: 1,
        controlId: "demo_relation_grp",
        controlValue: "1",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_005_001_002",
        parentId: "ans_005_001",
        title: "지인",
        type: "ANSWER_DETAIL" as const,
        sqno: 2,
        controlId: "demo_relation_grp",
        controlValue: "2",
        order: 2,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_005_001_003",
        parentId: "ans_005_001",
        title: "소개",
        type: "ANSWER_DETAIL" as const,
        sqno: 3,
        controlId: "demo_relation_grp",
        controlValue: "3",
        order: 3,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_005_001_004",
        parentId: "ans_005_001",
        title: "기타",
        type: "ANSWER_DETAIL" as const,
        sqno: 4,
        controlId: "demo_relation_grp",
        controlValue: "4",
        order: 4,
        status: "ACTIVE" as const,
      },

      // GROUP 6: 샘플 그룹 - 직업 정보 확인
      {
        id: "grp_006",
        parentId: null,
        title: "[예시] 샘플 그룹 6 - 직업 정보 확인",
        type: "GROUP" as const,
        code: "DEMO_DOC_GRP_006",
        order: 13,
        processLinkYn: "N",
        status: "ACTIVE" as const,
      },
      {
        id: "ans_006_001",
        parentId: "grp_006",
        title: "직업 구분 (샘플)",
        type: "ANSWER" as const,
        code: "DEMO_ANSR_009",
        eacpTypeCode: "SAMPLE",
        userInptDatYn: "Y",
        formatCode: "RADI",
        dplcAnsrPssbYn: "N",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_006_001_001",
        parentId: "ans_006_001",
        title: "직장인",
        type: "ANSWER_DETAIL" as const,
        sqno: 1,
        controlId: "",
        controlValue: "1",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "sub_006_001_001_001",
        parentId: "dtl_006_001_001",
        title: "직장명 (샘플)",
        type: "SUB_ANSWER" as const,
        code: "DEMO_ANSR_010",
        formatCode: "TEXT",
        controlId: "",
        controlValue: "",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_006_001_002",
        parentId: "ans_006_001",
        title: "자영업",
        type: "ANSWER_DETAIL" as const,
        sqno: 2,
        controlId: "",
        controlValue: "2",
        order: 2,
        status: "ACTIVE" as const,
      },
      {
        id: "sub_006_001_002_001",
        parentId: "dtl_006_001_002",
        title: "사업장명 (샘플)",
        type: "SUB_ANSWER" as const,
        code: "DEMO_ANSR_011",
        formatCode: "TEXT",
        controlId: "",
        controlValue: "",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_006_001_003",
        parentId: "ans_006_001",
        title: "무직",
        type: "ANSWER_DETAIL" as const,
        sqno: 3,
        controlId: "",
        controlValue: "3",
        order: 3,
        status: "ACTIVE" as const,
      },
    ],
  },
};

export function getFormMockData(formId: string) {
  const data = MOCK_FORM_DATA[formId as keyof typeof MOCK_FORM_DATA];
  if (!data) {
return null;
}

  return {
    name: data.formName,
    description: data.description,
    nodes: data.nodes,
  };
}

// Sidebar용 트리 구조 API Mock (계층만 포함)
export function getTreeStructure(formId: string): NodeItem[] {
  const data = MOCK_FORM_DATA[formId as keyof typeof MOCK_FORM_DATA];
  if (!data) {
return [];
}

  // GROUP과 ANSWER까지만 반환 (트리 구조용)
  return data.nodes.filter(node =>
    node.type === "GROUP" || node.type === "ANSWER"
  );
}

// 특정 노드의 상세 정보 API Mock
export function getNodeDetail(formId: string, nodeId: string): NodeItem | null {
  const data = MOCK_FORM_DATA[formId as keyof typeof MOCK_FORM_DATA];
  if (!data) {
return null;
}

  return data.nodes.find(node => node.id === nodeId) || null;
}

// 특정 노드의 하위 항목 리스트 API Mock
export function getNodeChildren(formId: string, nodeId: string): NodeItem[] {
  const data = MOCK_FORM_DATA[formId as keyof typeof MOCK_FORM_DATA];
  if (!data) {
return [];
}

  return data.nodes.filter(node => node.parentId === nodeId);
}
