'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  IconButton,
  InputAdornment,
  Checkbox,
  Card,
  CardHeader,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  ArrowForward as ArrowRightIcon,
  ArrowBack as ArrowLeftIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';
import { api, BusinessError } from '@/lib/axios';
import { v4 as uuidv4 } from 'uuid';

interface SearchPopupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (items: any[]) => void;
}

interface ListItem {
  id: string;
  title: string;
  code: string;
  category: string;
  disabled?: boolean;
}

// 전체 항목 데이터 (검색으로 추가할 수 있는 모든 데이터)
const allItemsData: ListItem[] = [
  // 기존 선택된 항목들 (처음 3개)
  {
    id: uuidv4(),
    title: '대면설명 확인 > 상품설명서 전달',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_002'
  },
  {
    id: uuidv4(),
    title: '대면설명 확인 > 상품설명서 작성 내용에 대한 동의 여부',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_003'
  },
  {
    id: uuidv4(),
    title: '대면설명 확인 > 대면설명 세부 정보',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_004'
  },
  // 추가 가능한 항목들
  {
    id: uuidv4(),
    title: '청약서 > 보험료 자동이체 납입 신청',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_005'
  },
  {
    id: uuidv4(),
    title: '청약서 > 보험가입 질문',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_006'
  },
  {
    id: uuidv4(),
    title: '보험계약 비교안내 확인 > 계약자가 보유중인 보/치/상 계약 확인',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_007'
  },
  {
    id: uuidv4(),
    title: '계약전정보제공확인(공고의무상품 3년경과 가입) > 계약제한 이용을 위한 계약제한 고지의무',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_008'
  },
  {
    id: uuidv4(),
    title: '개인정보 수집 이용 동의서',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_009'
  },
  {
    id: uuidv4(),
    title: '마케팅 정보 수신 동의',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_010'
  },
  {
    id: uuidv4(),
    title: '보험료 납입 안내',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_011'
  },
  {
    id: uuidv4(),
    title: '계약 체결 전 알릴 의무',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_012'
  },
  {
    id: uuidv4(),
    title: '보험금 청구 절차 안내',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_013'
  },
  {
    id: uuidv4(),
    title: '약관 및 청약서 교부 확인',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_014'
  },
  {
    id: uuidv4(),
    title: '보험료 계산서 및 영수증',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_015'
  },
  {
    id: uuidv4(),
    title: '특약 가입 동의서',
    category: '그룹명',
    code: 'ADVTC_DOC_CRP_OTHM_016'
  }
];

export default function SearchPopup({ open, onClose, onSelect }: SearchPopupProps) {
  // 폼 상태
  const [deviceType, setDeviceType] = useState('PC');
  const [categoryType, setCategoryType] = useState('FP');
  
  // 리스트 상태
  const [leftItems, setLeftItems] = useState<ListItem[]>([]); // 선택된 항목들
  const [rightItems, setRightItems] = useState<ListItem[]>([]); // 전체 항목들
  const [filteredRightItems, setFilteredRightItems] = useState<ListItem[]>([]); // 필터된 오른쪽 항목들
  
  // 검색 및 선택 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRightItems, setSelectedRightItems] = useState<string[]>([]);
  const [selectedLeftItems, setSelectedLeftItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // 에러 상태
  const [errors, setErrors] = useState({
    deviceType: false,
    categoryType: false,
    date: false // 날짜 필드 추가시 사용
  });

  // 유효성 검증 함수
  const validateForm = () => {
    const newErrors = {
      deviceType: !deviceType,
      categoryType: !categoryType,
      date: false // 날짜 필드가 추가되면 여기에 날짜 검증 로직 추가
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // API에서 선택된 데이터 가져오기 (조회 버튼)
  const fetchSelectedItems = async () => {
    setLoading(true);
    try {
      // 실제로는 선택된 항목들을 API에서 가져옴
      // const selectedData = await api.get('/selected-items', { 
      //   params: { deviceType, categoryType } 
      // });
      
      // 임시로 기존에 선택된 항목들 시뮬레이션 (처음 3개 항목이 이미 선택되어 있다고 가정)
      await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
      
      const selectedItems = allItemsData.slice(0, 3); // 처음 3개 항목을 선택된 것으로 가정
      setLeftItems(selectedItems);
      
      // 오른쪽 리스트는 전체 데이터에서 선택된 것들은 disabled 처리
      const allItems = allItemsData.map(item => ({
        ...item,
        disabled: selectedItems.some(selected => selected.id === item.id)
      }));
      
      setRightItems(allItems);
      setFilteredRightItems(allItems);
      
    } catch (error) {
      console.error('선택된 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 검색어 변경 시 실시간 필터링
  useEffect(() => {
    if (searchKeyword) {
      const filtered = rightItems.filter(item =>
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.code.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredRightItems(filtered);
    } else {
      setFilteredRightItems(rightItems);
    }
  }, [searchKeyword, rightItems]);

  // 왼쪽(추가 가능한) → 오른쪽(현재 구성) 이동
  const moveToLeft = () => {
    const itemsToMove = rightItems.filter(item => selectedRightItems.includes(item.id));
    
    // 오른쪽(현재 구성)에 추가
    setLeftItems(prev => [...prev, ...itemsToMove]);
    
    // 왼쪽(추가 가능한)에서 disabled 처리
    setRightItems(prev => prev.map(item => 
      selectedRightItems.includes(item.id) ? { ...item, disabled: true } : item
    ));
    
    setFilteredRightItems(prev => prev.map(item => 
      selectedRightItems.includes(item.id) ? { ...item, disabled: true } : item
    ));
    
    setSelectedRightItems([]);
  };

  // 오른쪽(현재 구성) → 왼쪽(추가 가능한) 이동 (복원)
  const moveToRight = () => {
    const idsToRemove = selectedLeftItems;
    
    // 오른쪽(현재 구성)에서 제거
    setLeftItems(prev => prev.filter(item => !idsToRemove.includes(item.id)));
    
    // 왼쪽(추가 가능한)에서 disabled 해제
    setRightItems(prev => prev.map(item => 
      idsToRemove.includes(item.id) ? { ...item, disabled: false } : item
    ));
    
    setFilteredRightItems(prev => prev.map(item => 
      idsToRemove.includes(item.id) ? { ...item, disabled: false } : item
    ));
    
    setSelectedLeftItems([]);
  };

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const dragIndex = leftItems.findIndex(item => item.id === draggedItem);
    if (dragIndex === -1) return;

    // 배열 재정렬
    const newItems = [...leftItems];
    const [draggedItemData] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItemData);

    setLeftItems(newItems);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  // 체크박스 핸들러
  const handleRightItemCheck = (itemId: string) => {
    setSelectedRightItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleLeftItemCheck = (itemId: string) => {
    setSelectedLeftItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // hover 배경색 결정 함수
  const getHoverBackgroundColor = (item: ListItem) => {
    if (item.disabled) {
      return 'transparent';
    }
    if (selectedRightItems.includes(item.id)) {
      return 'action.selected';
    }
    return 'action.hover';
  };

  const handleConfirm = () => {
    if (!validateForm()) {
      return;
    }
    
    if (leftItems.length === 0) {
      alert('구성 항목을 최소 1개 이상 선택해주세요.');
      return;
    }
    
    onSelect(leftItems);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '85vh',
          maxHeight: '95vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" component="div">
          구성항목 수정
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* 검색 조건 */}
        <Box sx={{ mb: 3 }}>
          {/* 디바이스 선택 */}
          <FormControl 
            component="fieldset" 
            sx={{ mb: 2 }}
            error={errors.deviceType}
          >
            <FormLabel 
              component="legend" 
              required
              sx={{
                '& .MuiFormLabel-asterisk': {
                  color: 'error.main'
                }
              }}
            >
              디바이스 *
            </FormLabel>
            <RadioGroup
              row
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
            >
              <FormControlLabel value="PC" control={<Radio />} label="PC" />
              <FormControlLabel value="태블릿" control={<Radio />} label="태블릿" />
              <FormControlLabel value="스마트폰" control={<Radio />} label="스마트폰" />
            </RadioGroup>
            {errors.deviceType && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                디바이스를 선택해주세요.
              </Typography>
            )}
          </FormControl>

          {/* 항목 검색 */}
          <FormControl 
            component="fieldset" 
            sx={{ mb: 2 }}
            error={errors.categoryType}
          >
            <FormLabel 
              component="legend" 
              required
              sx={{
                '& .MuiFormLabel-asterisk': {
                  color: 'error.main'
                }
              }}
            >
              항목 검색 *
            </FormLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <RadioGroup
                row
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value)}
              >
                <FormControlLabel value="FP" control={<Radio />} label="FP" />
                <FormControlLabel value="주간보험자" control={<Radio />} label="주간보험자" />
                <FormControlLabel value="계약자" control={<Radio />} label="계약자" />
                <FormControlLabel value="진단자1" control={<Radio />} label="진단자1" />
                <FormControlLabel value="진단자2" control={<Radio />} label="진단자2" />
              </RadioGroup>
              <Button 
                variant="contained" 
                onClick={fetchSelectedItems}
                disabled={!deviceType || !categoryType}
                sx={{ ml: 2 }}
              >
                조회
              </Button>
            </Box>
            {errors.categoryType && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                항목 검색 유형을 선택해주세요.
              </Typography>
            )}
          </FormControl>
        </Box>

        {/* 리스트 영역 */}
        <Box sx={{ display: 'flex', gap: 2, minHeight: 500 }}>
          {/* 왼쪽: 추가 가능한 항목들 */}
          <Card sx={{ flex: 1 }}>
            <CardHeader 
              title="추가 가능한 항목들" 
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ pb: 1 }}
              action={
                <TextField
                  size="small"
                  placeholder="검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                  sx={{ width: 200 }}
                />
              }
            />
            <CardContent sx={{ pt: 0, maxHeight: 400, overflow: 'auto' }}>
              {loading ? (
                <Typography variant="body2" sx={{ textAlign: 'center', py: 4 }}>
                  로딩 중...
                </Typography>
              ) : (
                <List dense>
                  {filteredRightItems.map((item) => (
                    <ListItem 
                      key={item.id}
                      component="div"
                      sx={{ 
                        px: 0,
                        opacity: item.disabled ? 0.5 : 1,
                        cursor: item.disabled ? 'default' : 'pointer',
                        bgcolor: selectedRightItems.includes(item.id) ? 'action.selected' : 'transparent',
                        '&:hover': {
                          bgcolor: getHoverBackgroundColor(item)
                        },
                        borderRadius: 1,
                        mb: 0.5
                      }}
                      onClick={() => !item.disabled && handleRightItemCheck(item.id)}
                    >
                      <ListItemText
                        primary={item.title}
                        secondary={`${item.category} : ${item.code}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                        sx={{ 
                          '& .MuiListItemText-primary': {
                            fontWeight: selectedRightItems.includes(item.id) ? 'bold' : 'normal'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                  {filteredRightItems.length === 0 && !loading && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      {rightItems.length === 0 ? '조회 후 추가할 항목들을 검색해보세요.' : '검색 결과가 없습니다.'}
                    </Typography>
                  )}
                </List>
              )}
            </CardContent>
          </Card>

          {/* 중간: 이동 버튼들 */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            gap: 2,
            minWidth: 100
          }}>
            <Button
              variant="contained"
              onClick={moveToLeft}
              disabled={selectedRightItems.length === 0}
              startIcon={<ArrowRightIcon />}
              sx={{ minWidth: 80 }}
            >
              추가
            </Button>
            <Button
              variant="outlined"
              onClick={moveToRight}
              disabled={selectedLeftItems.length === 0}
              startIcon={<ArrowLeftIcon />}
              sx={{ minWidth: 80 }}
            >
              제거
            </Button>
          </Box>

          {/* 오른쪽: 현재 조회된 항목들 */}
          <Card sx={{ flex: 1 }}>
            <CardHeader 
              title="현재 구성 항목들" 
              titleTypographyProps={{ variant: 'h6' }}
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0, maxHeight: 400, overflow: 'auto' }}>
              <List dense>
                {leftItems.map((item, index) => (
                  <ListItem 
                    key={item.id} 
                    sx={{ 
                      px: 0,
                      bgcolor: dragOverIndex === index ? 'action.hover' : 'transparent',
                      borderTop: dragOverIndex === index ? '2px solid' : 'none',
                      borderTopColor: 'primary.main',
                      cursor: 'move'
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      minWidth: 30,
                      mr: 1 
                    }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          mr: 1
                        }}
                      >
                        {index + 1}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        cursor: 'grab',
                        '&:active': { cursor: 'grabbing' },
                        mr: 1,
                        color: 'text.secondary'
                      }}
                    >
                      <DragIndicatorIcon fontSize="small" />
                    </IconButton>
                    <Checkbox
                      checked={selectedLeftItems.includes(item.id)}
                      onChange={() => handleLeftItemCheck(item.id)}
                      size="small"
                    />
                    <ListItemText
                      primary={item.title}
                      secondary={`${item.category} : ${item.code}`}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
                {leftItems.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    조회 버튼을 클릭하여 현재 구성 항목들을 불러오세요.
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleCancel} variant="outlined">
          취소
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}