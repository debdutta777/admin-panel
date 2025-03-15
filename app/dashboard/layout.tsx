'use client';

import { ReactNode } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import DashboardSidebar from './DashboardSidebar';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
          color: '#fff',
        },
      },
    },
  },
});

// Dashboard layout wrapper component
function DashboardLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <DashboardSidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 2 },
            width: { md: `calc(100% - 240px)` },
            ml: { md: '240px' },
            mt: { xs: 7, md: 0 }
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  // No authentication check, allow all access
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
} 