"use client";

import * as React from "react";
import { Box, List, ListItem, ListItemButton, ListItemText, Collapse, Typography } from "@mui/material";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { NodeItem } from "./types";
import { getChildren, getRootNodes } from "./mock";

export function SidebarTree({
  nodes,
  selectedNodeId,
  onSelect,
}: {
  nodes: NodeItem[];
  selectedNodeId?: string | null;
  onSelect: (id: string) => void;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const roots = React.useMemo(() => getRootNodes(nodes), [nodes]);

  React.useEffect(() => {
    setMounted(true);
    // 루트 노드 자동 펼침
    if (roots.length > 0) {
      setExpanded(new Set(roots.map(r => r.id)));
    }
  }, [roots]);

  // 디버그: 노드 수 출력
  React.useEffect(() => {
    console.log('[SidebarTree] mounted:', mounted, 'nodes.length:', nodes.length, '루트:', roots.length);
    if (nodes.length === 0) {
      console.warn('[SidebarTree] ⚠️ nodes 비어있음');
    } else {
      console.log('[SidebarTree] ✓ 총 노드:', nodes.length, '루트:', roots.length);
      console.log('[SidebarTree] 루트 노드들:', roots.map(r => `${r.title} (${r.type})`));
    }
  }, [mounted, nodes, roots]);

  if (!mounted) {
    console.log('[SidebarTree] 아직 마운트 안됨');
    return null;
  }

  if (nodes.length === 0) {
    console.log('[SidebarTree] nodes가 비어있어서 렌더링 안함');
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          등록된 항목이 없습니다
        </Typography>
        <Typography variant="caption" color="text.secondary">
          상단의 &quot;그룹 추가&quot; 버튼으로
          <br />
          첫 항목을 만들어보세요
        </Typography>
      </Box>
    );
  }

  const toggleExpand = (nodeId: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderNode = (node: NodeItem, level: number = 0) => {
    const children = getChildren(nodes, node.id);
    const hasChildren = children.length > 0;
    const isExpanded = expanded.has(node.id);
    const isSelected = selectedNodeId === node.id;

    return (
      <React.Fragment key={node.id}>
        <ListItem 
          disablePadding 
          sx={{ pl: level * 2 }}
        >
          <ListItemButton
            selected={isSelected}
            onClick={() => onSelect(node.id)}
            sx={{ py: 0.5 }}
          >
            {hasChildren && (
              <Box
                component="span"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                sx={{ 
                  display: 'inline-flex', 
                  mr: 0.5,
                  cursor: 'pointer',
                  '& svg': { fontSize: 16 }
                }}
              >
                {isExpanded ? <ExpandMore /> : <ChevronRight />}
              </Box>
            )}
            {!hasChildren && <Box sx={{ width: 20, mr: 0.5 }} />}
            <ListItemText 
              primary={`${node.title}`}
              secondary={node.type}
              primaryTypographyProps={{ variant: 'body2', fontSize: '0.875rem' }}
              secondaryTypographyProps={{ variant: 'caption', fontSize: '0.75rem' }}
            />
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {children.map((child) => renderNode(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  console.log('[SidebarTree] 렌더링 시작, roots:', roots.length);

  return (
    <Box sx={{ height: "100%", overflow: "auto" }}>
      <List component="nav" disablePadding>
        {roots.map((r) => renderNode(r, 0))}
      </List>
    </Box>
  );
}

export default SidebarTree;
