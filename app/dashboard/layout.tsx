'use client';

import { ReactNode } from 'react';
import { Box, CssBaseline } from '@mui/material';
import DashboardSidebar from './DashboardSidebar';

// Dashboard layout wrapper component
function DashboardLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <DashboardSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: { xs: 8, sm: 9 } }}>
        {children}
      </Box>
    </Box>
  );
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  // No authentication check, allow all access
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
} 