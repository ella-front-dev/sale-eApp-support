'use client';

import CommonCodeDemo from '@/components/CommonCodeDemo';
import ValueToLabelDemo from '@/components/ValueToLabelDemo';
import { Box, Divider } from '@mui/material';

export default function CommonCodeDemoPage() {
  return (
    <Box>
      <CommonCodeDemo />
      <Divider sx={{ my: 4 }} />
      <ValueToLabelDemo />
    </Box>
  );
}