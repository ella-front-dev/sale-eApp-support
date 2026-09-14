"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Chip, Container, Paper, Stack, TextField, Typography, Divider } from "@mui/material";

import { ContentDataGrid } from "./ContentDataGrid";
import { EditDrawer } from "./EditDrawer";
import { findNodeById, getChildren, getRootNodes } from "./mock";
import { getFormMockData } from "./mockFormData";
import { 
  GroupDetailView, 
  AnswerDetailView, 
  AnswerDetailItemView, 
  SubAnswerDetailView,
  FormDetailView 
} from "./NodeDetailViews";
import { SidebarTree } from "./SidebarTree";
import { NodeItem } from "./types";

interface TemplateEditorProps {
  mode: "create" | "edit";
  templateId?: string;
}

export default function TemplateEditor({ mode, templateId }: TemplateEditorProps) {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  // 서식 폼 기본 정보
  const [formName, setFormName] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");

  // 노드 데이터
  const [treeNodes, setTreeNodes] = React.useState<NodeItem[]>([]); // 계층 구조
  const [detailRows, setDetailRows] = React.useState<NodeItem[]>([]); // 선택된 노드의 상세 리스트
  const [selectedNodeDetail, setSelectedNodeDetail] = React.useState<NodeItem | null>(null); // 선택된 노드 상세 정보
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false);

  // Drawer state
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<NodeItem | null>(null);
  const [drawerMode, setDrawerMode] = React.useState<"create" | "edit">("edit");

  React.useEffect(() => {
    setMounted(true);
    // edit 모드일 경우 기존 데이터 로드
    if (mode === "edit" && templateId) {
      // Mock 데이터 로드
      const mockData = getFormMockData(templateId);
      if (mockData) {
        setFormName(mockData.name);
        setFormDescription(mockData.description);
        setTreeNodes(mockData.nodes);
      }
      // TODO: 실제로는 API 호출
      // const response = await fetch(`/api/forms/${templateId}`);
      // const data = await response.json();
      // setFormName(data.name);
      // setFormDescription(data.description);
      // setTreeNodes(data.nodes);
    }
  }, [mode, templateId]);

  // 노드 선택 시 상세 정보 및 하위 리스트 로드
  const fetchNodeDetail = React.useCallback(async (nodeId: string) => {
    setIsLoadingDetail(true);
    try {

      // 임시: Mock 데이터에서 찾기
      await new Promise(resolve => setTimeout(resolve, 200));
      const selectedNode = findNodeById(treeNodes, nodeId);
      const children = getChildren(treeNodes, nodeId);
      
      setSelectedNodeDetail(selectedNode || null);
      setDetailRows(children);
      
    } catch {
      setSelectedNodeDetail(null);
      setDetailRows([]);
    } finally {
      setIsLoadingDetail(false);
    }
  }, [treeNodes]);

  // 노드 선택 변경 시 상세 정보 로드
  React.useEffect(() => {
    if (selectedNodeId) {
      fetchNodeDetail(selectedNodeId);
    } else {
      setSelectedNodeDetail(null);
      setDetailRows([]);
    }
  }, [selectedNodeId, fetchNodeDetail]);

  React.useEffect(() => {
    if (!selectedNodeId && treeNodes.length > 0) {
      const firstRoot = getRootNodes(treeNodes)[0]?.id ?? null;
      setSelectedNodeId(firstRoot);
    }
  }, [treeNodes, selectedNodeId]);

  // 선택된 노드 타입에 따른 추가 버튼 레이블
  const getAddButtonLabel = () => {
    if (!selectedNodeDetail) {
return "항목 추가";
}
    switch (selectedNodeDetail.type) {
      case "GROUP":
        return "💬 응답 추가";
      case "ANSWER":
        return "📝 응답상세 추가";
      case "ANSWER_DETAIL":
        return "↳ 하위응답 추가";
      default:
        return "항목 추가";
    }
  };

  const handleEdit = (row: NodeItem) => {
    setEditingItem(row);
    setDrawerMode("edit");
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    if (!selectedNodeId || !selectedNodeDetail) {
return;
}
    const parent = selectedNodeDetail;

    // 부모 타입에 따라 자식 타입 결정
    let childType: NodeItem["type"] = "ANSWER";
    if (parent.type === "GROUP") {
childType = "ANSWER";
} else if (parent.type === "ANSWER") {
childType = "ANSWER_DETAIL";
} else if (parent.type === "ANSWER_DETAIL") {
childType = "SUB_ANSWER";
}

    // 새 항목 템플릿
    const newItem: NodeItem = {
      id: `temp_${Date.now()}`,
      parentId: selectedNodeId,
      title: `새 ${childType}`,
      type: childType,
      status: "ACTIVE",
      order: detailRows.length + 1,
    };

    setEditingItem(newItem);
    setDrawerMode("create");
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    
    try {
      // TODO: API에서 계층 구조 다시 가져오기
      if (mode === "edit" && templateId) {
        // const response = await fetch(`/api/forms/${templateId}`);
        // const data = await response.json();
        // setTreeNodes(data.nodes);
        
        // 임시: Mock 데이터 재로드
        const mockData = getFormMockData(templateId);
        if (mockData) {
          setTreeNodes(mockData.nodes);
        }
        
        // 현재 선택된 노드의 상세 정보 재로드
        if (selectedNodeId) {
          await fetchNodeDetail(selectedNodeId);
        }
      }
    } catch {
      // 새로고침 실패는 조용히 무시
    }
  };

  const handleAddRootGroup = () => {
    const newGroup: NodeItem = {
      id: `temp_${Date.now()}`,
      parentId: null,
      title: "새 그룹",
      type: "GROUP",
      status: "ACTIVE",
      order: getRootNodes(treeNodes).length + 1,
    };
    setEditingItem(newGroup);
    setDrawerMode("create");
    setDrawerOpen(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) {
      alert("서식 폼 이름을 입력해주세요.");

      return;
    }

    if (treeNodes.length === 0) {
      alert("최소 1개 이상의 서식 항목을 추가해주세요.");

      return;
    }

    // TODO: API 호출
    // if (mode === 'create') {
    //   await createForm(formData);
    // } else {
    //   await updateForm(templateId, formData);
    // }

    alert(`서식 폼이 ${mode === "create" ? "생성" : "수정"}되었습니다.`);
    router.push("/backoffice/template-editor");
  };

  if (!mounted) {
    return null;
  }

  return (
    <Container maxWidth={false} sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5">
              {mode === "create" ? "📋 새 서식 폼 등록" : "📝 서식 폼 수정"}
            </Typography>
            <Button variant="outlined" onClick={() => router.back()}>
              취소
            </Button>
          </Box>

          <Divider />

          <TextField
            label="서식 폼 이름"
            placeholder="예: 고객 가입 신청서"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="서식 폼 설명"
            placeholder="이 서식의 용도를 설명해주세요"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ height: "calc(100vh - 400px)", minHeight: 600, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" spacing={0} sx={{ flex: 1, overflow: "hidden" }}>
          {/* Left: Tree */}
          <Box sx={{ width: 300, borderRight: 1, borderColor: "divider", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Box sx={{ p: 1, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <Typography variant="subtitle2">구조 설계</Typography>
              <Button size="small" variant="outlined" onClick={handleAddRootGroup}>
                📁 그룹 추가
              </Button>
            </Box>
            <Divider sx={{ flexShrink: 0 }} />
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <SidebarTree nodes={treeNodes} selectedNodeId={selectedNodeId ?? undefined} onSelect={(id) => setSelectedNodeId(id)} />
            </Box>
          </Box>

          {/* Right: Main content with grid */}
          <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* 선택된 노드 상세 정보 */}
            {selectedNodeDetail && (
              <Paper 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    boxShadow: 3,
                  }
                }} 
                elevation={1}
                onClick={() => {
                  setEditingItem(selectedNodeDetail);
                  setDrawerMode('edit');
                  setDrawerOpen(true);
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {selectedNodeDetail.title}
                      <Chip 
                        label={selectedNodeDetail.type} 
                        size="small" 
                        sx={{ ml: 1 }}
                        color="primary"
                        variant="outlined"
                      />
                    </Typography>
                    <Stack spacing={1}>
                      {selectedNodeDetail.description && (
                        <Typography variant="body2" color="text.secondary">
                          {selectedNodeDetail.description}
                        </Typography>
                      )}
                      
                      {/* 타입별 상세 정보 렌더링 */}
                      {selectedNodeDetail.type === 'GROUP' && <GroupDetailView node={selectedNodeDetail} />}
                      {selectedNodeDetail.type === 'ANSWER' && <AnswerDetailView node={selectedNodeDetail} />}
                      {selectedNodeDetail.type === 'ANSWER_DETAIL' && <AnswerDetailItemView node={selectedNodeDetail} />}
                      {selectedNodeDetail.type === 'SUB_ANSWER' && <SubAnswerDetailView node={selectedNodeDetail} />}
                      {selectedNodeDetail.type === 'FORM' && <FormDetailView node={selectedNodeDetail} />}
                    </Stack>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingItem(selectedNodeDetail);
                      setDrawerMode('edit');
                      setDrawerOpen(true);
                    }}
                    sx={{ ml: 2 }}
                  >
                    수정
                  </Button>
                </Box>
              </Paper>
            )}

            {/* 하위 항목 리스트 */}
            <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
              <Typography variant="h6">하위 항목 목록</Typography>
              {selectedNodeDetail && (
                <Typography variant="body2" color="text.secondary">
                  ({detailRows.length}개)
                </Typography>
              )}
            </Box>
            {isLoadingDetail ? (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">로딩 중...</Typography>
              </Box>
            ) : (
              <Box sx={{ flex: 1, overflow: "hidden" }}>
                <ContentDataGrid
                  rows={detailRows}
                  onEdit={handleEdit}
                  onAdd={selectedNodeId ? handleAdd : undefined}
                  addButtonLabel={getAddButtonLabel()}
                  height={"100%"}
                />
              </Box>
            )}
          </Box>

          {/* Right Drawer: Edit */}
          <EditDrawer
            open={isDrawerOpen}
            item={editingItem}
            mode={drawerMode}
            parentId={drawerMode === 'create' ? selectedNodeId : undefined}
            onClose={() => setDrawerOpen(false)}
            onSave={handleSave}
          />
        </Stack>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button variant="outlined" size="large" onClick={() => router.back()}>
          취소
        </Button>
        <Button variant="contained" size="large" onClick={handleSubmit}>
          {mode === "create" ? "서식 폼 생성" : "서식 폼 수정"}
        </Button>
      </Box>
    </Container>
  );
}
