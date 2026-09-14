'use client';

import { Box, Divider } from '@mui/material';

import CommonCodeDemo from '@/components/demo/CommonCodeDemo';
import ValueToLabelDemo from '@/components/demo/ValueToLabelDemo';

export default function CommonCodeDemoPage() {
  return (
    <Box>
      <CommonCodeDemo />
      <Divider sx={{ my: 4 }} />
      <ValueToLabelDemo />
    </Box>
  );
}