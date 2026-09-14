'use client';

import { Box, Divider } from '@mui/material';

import CommonCodeDemo from '@/components/CommonCodeDemo';
import ValueToLabelDemo from '@/components/ValueToLabelDemo';

export default function CommonCodeDemoPage() {
  return (
    <Box>
      <CommonCodeDemo />
      <Divider sx={{ my: 4 }} />
      <ValueToLabelDemo />
    </Box>
  );
}