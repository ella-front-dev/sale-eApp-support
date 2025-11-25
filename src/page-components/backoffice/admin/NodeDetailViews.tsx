"use client";

import * as React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { NodeItem } from "./types";

// 공통 필드 컴포넌트
interface CommonFieldsProps {
  node: NodeItem;
}

function CommonFields({ node }: CommonFieldsProps) {
  return (
    <>
      <Typography variant="body2">
        <strong>상태:</strong> {node.status || 'ACTIVE'}
      </Typography>
      {node.order !== undefined && (
        <Typography variant="body2">
          <strong>순서:</strong> {node.order}
        </Typography>
      )}
    </>
  );
}

// GROUP 타입 상세 정보
export function GroupDetailView({ node }: { node: NodeItem }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <CommonFields node={node} />
      {node.code && (
        <Typography variant="body2">
          <strong>그룹 코드:</strong> {node.code}
        </Typography>
      )}
      {node.processLinkYn && (
        <Typography variant="body2">
          <strong>프로세스 연계:</strong> {node.processLinkYn === 'Y' ? '예' : '아니오'}
        </Typography>
      )}
    </Box>
  );
}

// ANSWER 타입 상세 정보
export function AnswerDetailView({ node }: { node: NodeItem }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <CommonFields node={node} />
      {node.code && (
        <Typography variant="body2">
          <strong>응답 코드:</strong> {node.code}
        </Typography>
      )}
      {node.eacpTypeCode && (
        <Typography variant="body2">
          <strong>타입 코드:</strong> {node.eacpTypeCode}
        </Typography>
      )}
      {node.formatCode && (
        <Typography variant="body2">
          <strong>포맷:</strong> <Chip label={node.formatCode} size="small" sx={{ ml: 0.5 }} />
        </Typography>
      )}
      {node.userInptDatYn && (
        <Typography variant="body2">
          <strong>사용자 입력:</strong> {node.userInptDatYn === 'Y' ? '예' : '아니오'}
        </Typography>
      )}
      {node.dplcAnsrPssbYn && (
        <Typography variant="body2">
          <strong>중복 가능:</strong> {node.dplcAnsrPssbYn === 'Y' ? '예' : '아니오'}
        </Typography>
      )}
    </Box>
  );
}

// ANSWER_DETAIL 타입 상세 정보
export function AnswerDetailItemView({ node }: { node: NodeItem }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <CommonFields node={node} />
      {node.sqno !== undefined && (
        <Typography variant="body2">
          <strong>시퀀스:</strong> <Chip label={node.sqno} size="small" color="info" sx={{ ml: 0.5 }} />
        </Typography>
      )}
      {node.controlId && (
        <Typography variant="body2">
          <strong>Control ID:</strong> <code style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '2px 6px', 
            borderRadius: '4px',
            fontSize: '0.85em'
          }}>{node.controlId}</code>
        </Typography>
      )}
      {node.controlValue !== undefined && (
        <Typography variant="body2">
          <strong>Control Value:</strong> <Chip label={node.controlValue || '(empty)'} size="small" variant="outlined" sx={{ ml: 0.5 }} />
        </Typography>
      )}
      {node.remark && (
        <Typography variant="body2" sx={{ width: '100%', mt: 1, p: 1, bgcolor: '#f9f9f9', borderRadius: 1 }}>
          <strong>비고:</strong> {node.remark}
        </Typography>
      )}
    </Box>
  );
}

// SUB_ANSWER 타입 상세 정보
export function SubAnswerDetailView({ node }: { node: NodeItem }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <CommonFields node={node} />
      {node.code && (
        <Typography variant="body2">
          <strong>하위응답 코드:</strong> {node.code}
        </Typography>
      )}
      {node.formatCode && (
        <Typography variant="body2">
          <strong>입력 형식:</strong> <Chip label={node.formatCode} size="small" color="secondary" sx={{ ml: 0.5 }} />
        </Typography>
      )}
      {node.controlId && (
        <Typography variant="body2">
          <strong>Control ID:</strong> <code style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '2px 6px', 
            borderRadius: '4px',
            fontSize: '0.85em'
          }}>{node.controlId}</code>
        </Typography>
      )}
      {node.controlValue !== undefined && (
        <Typography variant="body2">
          <strong>기본값:</strong> {node.controlValue || '(없음)'}
        </Typography>
      )}
    </Box>
  );
}

// FORM 타입 상세 정보 (혹시 모를 경우 대비)
export function FormDetailView({ node }: { node: NodeItem }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <CommonFields node={node} />
      {node.code && (
        <Typography variant="body2">
          <strong>서식 코드:</strong> {node.code}
        </Typography>
      )}
    </Box>
  );
}
