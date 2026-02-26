"use client";

import * as React from "react";
import { Box, Button, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { NodeItem } from "./types";

export function ContentDataGrid({
  rows,
  onEdit,
  onAdd,
  addButtonLabel = '+ 항목 추가',
  height = 600,
}: {
  rows: NodeItem[];
  onEdit: (row: NodeItem) => void;
  onAdd?: () => void;
  addButtonLabel?: string;
  height?: number | string;
}) {
  const columns = React.useMemo<GridColDef<NodeItem>[]>(
    () => [
      { field: "title", headerName: "제목", flex: 1, minWidth: 180 },
      { field: "type", headerName: "유형", width: 140 },
      { field: "code", headerName: "코드", width: 160, valueGetter: (value, row) => row?.code ?? "-" },
      { field: "formatCode", headerName: "포맷", width: 100, valueGetter: (value, row) => row?.formatCode ?? "-" },
      { field: "controlId", headerName: "Control ID", width: 160, valueGetter: (value, row) => row?.controlId ?? "-" },
      {
        field: "status",
        headerName: "상태",
        width: 100,
        renderCell: (p) => (
          <Chip size="small" label={p.value ?? "-"} color={p.value === "ACTIVE" ? "success" : "default"} />
        ),
      },
      { field: "order", headerName: "순서", width: 80, type: "number" },
      {
        field: "actions",
        headerName: "작업",
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (p) => (
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              if (p?.row) onEdit(p.row);
            }}
          >
            수정
          </Button>
        ),
      },
    ],
    [onEdit]
  );

  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  return (
    <Box sx={{ height, width: "100%" }}>
      {onAdd && (
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" size="small" onClick={onAdd}>
            {addButtonLabel}
          </Button>
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[25, 50, 100]}
        disableRowSelectionOnClick
        onRowDoubleClick={(params) => {
          if (params?.row) onEdit(params.row);
        }}
      />
    </Box>
  );
}

export default ContentDataGrid;
