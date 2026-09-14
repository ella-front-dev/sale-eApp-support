"use client";

// API 구조: FORM > GROUP > ANSWER > ANSWER_DETAIL > SUB_ANSWER
export type NodeType = "FORM" | "GROUP" | "ANSWER" | "ANSWER_DETAIL" | "SUB_ANSWER";

export interface NodeItem {
  id: string;
  parentId: string | null;
  title: string;
  type: NodeType;
  code?: string;

  // 공통 필드
  description?: string;
  order?: number;
  status?: "ACTIVE" | "INACTIVE";
  updatedAt?: string;

  // GROUP 관련
  processLinkYn?: string; // "Y" | "N"

  // ANSWER 관련
  eacpTypeCode?: string; // 샘플 타입 코드 (예시)
  userInptDatYn?: string; // "Y" | "N"
  formatCode?: string; // "TEXT", "RADI", "CHBX", "DATE" 등
  dplcAnsrPssbYn?: string; // "Y" | "N"

  // ANSWER_DETAIL 관련
  controlId?: string;
  controlValue?: string;
  remark?: string;
  sqno?: number;
}

export interface NodeEditForm {
  title: string;
  type: NodeType;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
  order?: number;
  code?: string;
  formatCode?: string;
  controlId?: string;
  controlValue?: string;
  remark?: string;
}
