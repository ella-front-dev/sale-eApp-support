"use client";

import { NodeItem } from "./types";

// API 응답 구조에 맞는 Mock 데이터
const MOCK_FORM_DATA: Record<string, { eapfCode: string; eapfNm: string; description: string; nodes: NodeItem[] }> = {
  "1": {
    eapfCode: "A0010",
    eapfNm: "청약서",
    description: "보험 청약을 위한 서식",
    nodes: [
      // GROUP 1: 사용자미입력데이터
      {
        id: "grp_001",
        parentId: null,
        title: "사용자미입력데이터",
        type: "GROUP" as const,
        code: "A0010_DOC_GRP_INDT_001",
        order: 16,
        processLinkYn: "Y",
        status: "ACTIVE" as const,
      },
      // ANSWER: 작성일자
      {
        id: "ans_001_001",
        parentId: "grp_001",
        title: "작성일자",
        type: "ANSWER" as const,
        code: "A0010_ANSR_059",
        eacpTypeCode: "FP",
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

      // GROUP 2: 성명/서명
      {
        id: "grp_002",
        parentId: null,
        title: "성명/서명",
        type: "GROUP" as const,
        code: "A0010_DOC_GRP_NMSN_001",
        order: 15,
        processLinkYn: "N",
        status: "ACTIVE" as const,
      },
      // ANSWER: 계약자서명
      {
        id: "ans_002_001",
        parentId: "grp_002",
        title: "계약자서명",
        type: "ANSWER" as const,
        code: "A0010_ANSR_052",
        eacpTypeCode: "11",
        userInptDatYn: "Y",
        formatCode: "IMGS",
        dplcAnsrPssbYn: "N",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_002_001_001",
        parentId: "ans_002_001",
        title: "계약자서명",
        type: "ANSWER_DETAIL" as const,
        sqno: 1,
        controlId: "A0010_mysg_sign",
        controlValue: "",
        order: 1,
        status: "ACTIVE" as const,
      },
      // ANSWER: 계약자성명
      {
        id: "ans_002_002",
        parentId: "grp_002",
        title: "계약자성명",
        type: "ANSWER" as const,
        code: "A0010_ANSR_045",
        eacpTypeCode: "11",
        userInptDatYn: "Y",
        formatCode: "IMGN",
        dplcAnsrPssbYn: "N",
        order: 2,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_002_002_001",
        parentId: "ans_002_002",
        title: "계약자성명",
        type: "ANSWER_DETAIL" as const,
        sqno: 1,
        controlId: "A0010_mynm_sg",
        controlValue: "",
        order: 1,
        status: "ACTIVE" as const,
      },

      // GROUP 3: 완전판매 실천 여부
      {
        id: "grp_003",
        parentId: null,
        title: "완전판매 실천 여부",
        type: "GROUP" as const,
        code: "A0010_DOC_GRP_OTHR_001",
        order: 1,
        processLinkYn: "N",
        status: "ACTIVE" as const,
      },
      // ANSWER: 질문1
      {
        id: "ans_003_001",
        parentId: "grp_003",
        title: "완전판매 질문 1",
        type: "ANSWER" as const,
        code: "A0010_ANSR_001",
        eacpTypeCode: "FP",
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
        controlId: "A0010_que1_rdg",
        controlValue: "1",
        remark: "[장표수정] 없음 -> A0010_que1_rdg",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_003_001_002",
        parentId: "ans_003_001",
        title: "아니오",
        type: "ANSWER_DETAIL" as const,
        sqno: 2,
        controlId: "A0010_que1_rdg",
        controlValue: "2",
        remark: "[장표수정] 없음 -> A0010_que1_rdg",
        order: 2,
        status: "ACTIVE" as const,
      },

      // GROUP 4: 모니터링 방법
      {
        id: "grp_004",
        parentId: null,
        title: "모니터링 방법",
        type: "GROUP" as const,
        code: "A0010_DOC_GRP_OTHR_002",
        order: 2,
        processLinkYn: "N",
        status: "ACTIVE" as const,
      },
      {
        id: "ans_004_001",
        parentId: "grp_004",
        title: "모니터링 방법 선택",
        type: "ANSWER" as const,
        code: "A0010_ANSR_004",
        eacpTypeCode: "FP",
        userInptDatYn: "Y",
        formatCode: "RADI",
        dplcAnsrPssbYn: "N",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_004_001_001",
        parentId: "ans_004_001",
        title: "보이는 ARS",
        type: "ANSWER_DETAIL" as const,
        sqno: 1,
        controlId: "A0010_monitor_grp",
        controlValue: "1",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_004_001_002",
        parentId: "ans_004_001",
        title: "전화(콜센터)",
        type: "ANSWER_DETAIL" as const,
        sqno: 2,
        controlId: "A0010_monitor_grp",
        controlValue: "2",
        order: 2,
        status: "ACTIVE" as const,
      },
      // SUB_ANSWER: 전화 선택 시 하위 항목
      {
        id: "sub_004_001_002_001",
        parentId: "dtl_004_001_002",
        title: "계약자 통화 요청일자",
        type: "SUB_ANSWER" as const,
        code: "A0010_ANSR_005",
        formatCode: "DATE",
        controlId: "A0010_11_call_date",
        controlValue: "",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "sub_004_001_002_002",
        parentId: "dtl_004_001_002",
        title: "계약자 통화 요청시간",
        type: "SUB_ANSWER" as const,
        code: "A0010_ANSR_006",
        formatCode: "DTTM",
        controlId: "A0010_11_call_time",
        controlValue: "",
        order: 2,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_004_001_003",
        parentId: "ans_004_001",
        title: "홈페이지",
        type: "ANSWER_DETAIL" as const,
        sqno: 3,
        controlId: "A0010_monitor_grp",
        controlValue: "3",
        order: 3,
        status: "ACTIVE" as const,
      },

      // GROUP 5: 보험모집자와 계약자 관계
      {
        id: "grp_005",
        parentId: null,
        title: "보험모집자와 계약자 관계",
        type: "GROUP" as const,
        code: "A0010_DOC_GRP_OTHR_003",
        order: 3,
        processLinkYn: "N",
        status: "ACTIVE" as const,
      },
      {
        id: "ans_005_001",
        parentId: "grp_005",
        title: "관계 선택",
        type: "ANSWER" as const,
        code: "A0010_ANSR_011",
        eacpTypeCode: "FP",
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
        controlId: "Group2",
        controlValue: "3",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_005_001_002",
        parentId: "ans_005_001",
        title: "지인",
        type: "ANSWER_DETAIL" as const,
        sqno: 2,
        controlId: "Group2",
        controlValue: "4",
        order: 2,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_005_001_003",
        parentId: "ans_005_001",
        title: "소개",
        type: "ANSWER_DETAIL" as const,
        sqno: 3,
        controlId: "Group2",
        controlValue: "5",
        order: 3,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_005_001_004",
        parentId: "ans_005_001",
        title: "개척",
        type: "ANSWER_DETAIL" as const,
        sqno: 4,
        controlId: "Group2",
        controlValue: "6",
        order: 4,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_005_001_005",
        parentId: "ans_005_001",
        title: "기타",
        type: "ANSWER_DETAIL" as const,
        sqno: 5,
        controlId: "Group2",
        controlValue: "7",
        order: 5,
        status: "ACTIVE" as const,
      },

      // GROUP 6: 직업정보 확인
      {
        id: "grp_006",
        parentId: null,
        title: "직업정보 확인",
        type: "GROUP" as const,
        code: "A0010_DOC_GRP_OTHR_013",
        order: 13,
        processLinkYn: "N",
        status: "ACTIVE" as const,
      },
      {
        id: "ans_006_001",
        parentId: "grp_006",
        title: "직업 구분",
        type: "ANSWER" as const,
        code: "A0010_ANSR_039",
        eacpTypeCode: "11",
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
        title: "직장명",
        type: "SUB_ANSWER" as const,
        code: "A0010_ANSR_040",
        formatCode: "TEXT",
        controlId: "",
        controlValue: "",
        order: 1,
        status: "ACTIVE" as const,
      },
      {
        id: "dtl_006_001_002",
        parentId: "ans_006_001",
        title: "개인사업자(자영업)",
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
        title: "사업장명",
        type: "SUB_ANSWER" as const,
        code: "A0010_ANSR_041",
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
        controlValue: "5",
        order: 3,
        status: "ACTIVE" as const,
      },
    ],
  },
};

export function getFormMockData(formId: string) {
  const data = MOCK_FORM_DATA[formId as keyof typeof MOCK_FORM_DATA];
  if (!data) return null;
  
  return {
    name: data.eapfNm,
    description: data.description,
    nodes: data.nodes,
  };
}

// Sidebar용 트리 구조 API Mock (계층만 포함)
export function getTreeStructure(formId: string): NodeItem[] {
  const data = MOCK_FORM_DATA[formId as keyof typeof MOCK_FORM_DATA];
  if (!data) return [];
  
  // GROUP과 ANSWER까지만 반환 (트리 구조용)
  return data.nodes.filter(node => 
    node.type === "GROUP" || node.type === "ANSWER"
  );
}

// 특정 노드의 상세 정보 API Mock
export function getNodeDetail(formId: string, nodeId: string): NodeItem | null {
  const data = MOCK_FORM_DATA[formId as keyof typeof MOCK_FORM_DATA];
  if (!data) return null;
  
  return data.nodes.find(node => node.id === nodeId) || null;
}

// 특정 노드의 하위 항목 리스트 API Mock
export function getNodeChildren(formId: string, nodeId: string): NodeItem[] {
  const data = MOCK_FORM_DATA[formId as keyof typeof MOCK_FORM_DATA];
  if (!data) return [];
  
  return data.nodes.filter(node => node.parentId === nodeId);
}
