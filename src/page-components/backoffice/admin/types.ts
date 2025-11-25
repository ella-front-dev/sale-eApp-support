"use client";

// API 구조: FORM > GROUP > ANSWER > ANSWER_DETAIL > SUB_ANSWER
export type NodeType = "FORM" | "GROUP" | "ANSWER" | "ANSWER_DETAIL" | "SUB_ANSWER";

export interface NodeItem {
  id: string;
  parentId: string | null;
  title: string; // eapfComnItmNm, eapfComnItmAnsrNm 등
  type: NodeType;
  code?: string; // eapfComnItmCode, eapfComnItmAnsrCode 등
  
  // 공통 필드
  description?: string;
  order?: number; // indaOrdr
  status?: "ACTIVE" | "INACTIVE";
  updatedAt?: string;
  
  // GROUP 관련
  processLinkYn?: string; // "Y" | "N"
  
  // ANSWER 관련
  eacpTypeCode?: string; // "FP", "11", "21" 등
  userInptDatYn?: string; // "Y" | "N"
  formatCode?: string; // eapfComnItmAnsrFrmtCode: "TEXT", "RADI", "CHBX", "DATE" 등
  dplcAnsrPssbYn?: string; // "Y" | "N"
  
  // ANSWER_DETAIL 관련
  controlId?: string; // eapfComnItmAnsrCntlId
  controlValue?: string; // eapfComnItmAnsrCntlVal
  remark?: string; // rmrkCntn
  sqno?: number; // eapfComnItmAnsrSqno
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
