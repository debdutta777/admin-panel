'use client';

import { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Skeleton,
  useMediaQuery,
  useTheme,
  Alert
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  Event as EventIcon,
} from '@mui/icons-material';

// Interface for dashboard stats
interface DashboardStats {
  totalTeams: number;
  totalEvents: number;
}

// Dashboard card component
function StatCard({ 
  title, 
  value, 
  icon, 
  loading 
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" color="text.secondary">
            {title}
          </Typography>
          <Box sx={{ 
            backgroundColor: 'primary.light', 
            borderRadius: '50%', 
            width: 40, 
            height: 40, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'primary.main'
          }}>
            {icon}
          </Box>
        </Box>
        {loading ? (
          <Skeleton variant="text" width="60%" height={40} />
        ) : (
          <Typography variant="h4" component="div">
            {value.toLocaleString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// Loading skeleton for dashboard
function DashboardSkeleton() {
  return (
    <Grid container spacing={3}>
      {[1, 2].map((item) => (
        <Grid item xs={12} sm={6} key={item}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
              <Skeleton variant="text" width="60%" height={40} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Dashboard
        </Typography>
        <DashboardSkeleton />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Dashboard
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error">{error}</Alert>
        </Paper>
      </Box>
    );
  }
  
  if (!stats) {
    return (
      <Box>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Dashboard
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="info">No dashboard data available.</Alert>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        gutterBottom
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <StatCard 
            title="Total Teams" 
            value={stats.totalTeams} 
            icon={<PeopleIcon />} 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard 
            title="Total Events" 
            value={stats.totalEvents} 
            icon={<EventIcon />} 
            loading={loading}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome to Trajectory Admin
        </Typography>
        <Typography variant="body1">
          This dashboard provides an overview of your teams and events. Use the sidebar navigation to manage your data.
        </Typography>
      </Box>
    </Box>
  );
} 