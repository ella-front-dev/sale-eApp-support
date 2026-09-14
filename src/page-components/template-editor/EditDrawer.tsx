"use client";

import * as React from "react";

import {
  Box,
  Button,
  Drawer,
  Stack,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";

import { NodeEditForm, NodeItem } from "./types";

export interface EditDrawerProps {
  open: boolean;
  item: NodeItem | null;
  mode: 'create' | 'edit';
  parentId?: string | null;
  onClose: () => void;
  onSave: () => void; // 저장 완료 후 콜백 (데이터 새로고침용)
}

export function EditDrawer({ open, item, mode, parentId, onClose, onSave }: EditDrawerProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NodeEditForm>({
    defaultValues: {
      title: "",
      type: "ANSWER_DETAIL",
      description: "",
      status: "ACTIVE",
      order: 1,
      code: "",
      formatCode: "",
      controlId: "",
      controlValue: "",
      remark: "",
    },
  });

  React.useEffect(() => {
    if (open && item) {
      reset({
        title: item.title ?? "",
        type: item.type,
        description: item.description ?? "",
        status: item.status ?? "ACTIVE",
        order: item.order ?? 1,
        code: item.code ?? "",
        formatCode: item.formatCode ?? "",
        controlId: item.controlId ?? "",
        controlValue: item.controlValue ?? "",
        remark: item.remark ?? "",
      });
    }
  }, [open, item, reset]);

  const submit = handleSubmit(async (values) => {
    setIsSaving(true);
    setError(null);

    try {
      const payload: Partial<NodeItem> = {
        title: values.title,
        type: values.type,
        description: values.description || undefined,
        status: values.status,
        order: values.order,
        code: values.code || undefined,
        formatCode: values.formatCode || undefined,
        controlId: values.controlId || undefined,
        controlValue: values.controlValue || undefined,
        remark: values.remark || undefined,
      };

      if (mode === 'create') {
        // 새 항목 생성
        payload.parentId = parentId ?? null;
        
        // TODO: API 호출
        // await fetch('/api/nodes', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload),
        // });
        
        // 임시: 로컬 저장 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // 기존 항목 수정
        if (!item?.id) {
throw new Error('수정할 항목의 ID가 없습니다');
}
        
        // TODO: API 호출
        // await fetch(`/api/nodes/${item.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload),
        // });
        
        // 임시: 로컬 저장 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      onSave(); // 저장 완료 알림
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다');
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <Drawer anchor="right" open={open} onClose={onClose} keepMounted>
      <Box component="form" onSubmit={submit} sx={{ width: { xs: 360, sm: 420 }, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {mode === 'create' ? '새 항목 등록' : '상세 수정'}
        </Typography>
        {error && (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}
        <Stack spacing={2}>
        <TextField
          label="제목"
          {...register("title", {
            required: "제목은 필수입니다",
            minLength: { value: 1, message: "최소 1자 이상 입력하세요" },
            maxLength: { value: 100, message: "최대 100자까지 입력 가능합니다" },
            validate: (value) => value.trim().length > 0 || "공백만 입력할 수 없습니다",
          })}
          error={!!errors.title}
          helperText={errors.title?.message}
          fullWidth
        />

          <TextField select label="유형" {...register("type")} fullWidth>
            <MenuItem value="GROUP">📁 그룹 (GROUP)</MenuItem>
            <MenuItem value="ANSWER">💬 응답 (ANSWER)</MenuItem>
            <MenuItem value="ANSWER_DETAIL">📝 응답 상세 (ANSWER_DETAIL)</MenuItem>
            <MenuItem value="SUB_ANSWER">↳ 하위응답 (SUB_ANSWER)</MenuItem>
          </TextField>

        <TextField
          label="코드"
          {...register("code")}
          placeholder="예: A0010_ANSR_001"
          fullWidth
        />

        <TextField
          label="포맷 코드"
          {...register("formatCode")}
          placeholder="예: TEXT, RADI, CHBX, DATE"
          fullWidth
        />

        <TextField
          label="Control ID"
          {...register("controlId")}
          placeholder="예: A0010_que1_rdg"
          fullWidth
        />

        <TextField
          label="Control Value"
          {...register("controlValue")}
          placeholder="예: 1, 2"
          fullWidth
        />

        <TextField
          label="비고"
          {...register("remark")}
          placeholder="비고 사항"
          multiline
          minRows={2}
          fullWidth
        />

        <TextField
          label="설명"
          {...register("description", {
            maxLength: { value: 500, message: "설명은 500자 이하여야 합니다" },
          })}
          error={!!errors.description}
          helperText={errors.description?.message}
          multiline
          minRows={2}
          fullWidth
        />

          <TextField select label="상태" {...register("status")} fullWidth>
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
          </TextField>

        <TextField
          label="순서"
          type="number"
          inputProps={{ inputMode: "numeric" }}
          {...register("order", { 
            valueAsNumber: true,
            min: { value: 0, message: "0 이상이어야 합니다" },
            max: { value: 9999, message: "9999 이하여야 합니다" },
            validate: (value) => {
              if (value === undefined || value === null) {
return true;
}

              return Number.isInteger(value) || "정수만 허용됩니다";
            },
          })}
          error={!!errors.order}
          helperText={errors.order?.message}
          fullWidth
        />

          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button onClick={onClose} color="inherit" variant="outlined" disabled={isSaving}>취소</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting || isSaving}>
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}

export default EditDrawer;
