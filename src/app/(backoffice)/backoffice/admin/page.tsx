"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
} from "@mui/material";

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  nodeCount: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

// ⚠️ 데모용 임시(Mock) 데이터입니다. 실제 서식이 아닌 예시 항목입니다.
const mockForms: FormTemplate[] = [
  {
    id: "1",
    name: "[예시] 샘플 서식 템플릿 1",
    description: "Template Editor 데모용 기본 정보 수집 예시 서식입니다",
    nodeCount: 15,
    status: "ACTIVE",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-15",
  },
  {
    id: "2",
    name: "[예시] 샘플 서식 템플릿 2",
    description: "다단계 입력 항목을 포함한 예시 서식입니다",
    nodeCount: 28,
    status: "ACTIVE",
    createdAt: "2025-01-08",
    updatedAt: "2025-01-12",
  },
  {
    id: "3",
    name: "[예시] 샘플 서식 템플릿 3",
    description: "설문형 입력 항목을 포함한 예시 서식입니다",
    nodeCount: 12,
    status: "INACTIVE",
    createdAt: "2024-12-20",
    updatedAt: "2024-12-25",
  },
];

export default function FormsListPage() {
  const router = useRouter();
  const [forms, setForms] = React.useState<FormTemplate[]>(mockForms);

  const handleDelete = (id: string) => {
    if (confirm("정말 이 서식 폼을 삭제하시겠습니까?")) {
      setForms((prev) => prev.filter((t) => t.id !== id));
      // TODO: API 호출
      // await deleteForm(id);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">📋 서식 폼 관리</Typography>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell width="40%"><strong>서식 폼 이름</strong></TableCell>
              <TableCell width="30%"><strong>설명</strong></TableCell>
              <TableCell width="10%" align="center"><strong>항목 수</strong></TableCell>
              <TableCell width="10%" align="center"><strong>상태</strong></TableCell>
              <TableCell width="10%" align="center"><strong>수정일</strong></TableCell>
              <TableCell width="10%" align="center"><strong>작업</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id} hover>
                <TableCell>
                  <Typography variant="body1" fontWeight="500">
                    {form.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                    {form.description}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">{form.nodeCount}개</Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={form.status === "ACTIVE" ? "활성" : "비활성"}
                    color={form.status === "ACTIVE" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" color="text.secondary">
                    {form.updatedAt}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(form.id)}
                      title="삭제"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {forms.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            등록된 서식 폼이 없습니다
          </Typography>
        </Box>
      )}
    </Container>
  );
}
