'use client';

import { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Skeleton,
  useMediaQuery,
  useTheme,
  Alert,
  Link
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  EventNote as EventNoteIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import NextLink from 'next/link';

// Interface for dashboard stats
interface DashboardStats {
  totalTeams: number;
  totalEvents: number;
  eventsList: Array<{
    _id: string;
    title: string;
    teamCount: number;
  }>;
  recentRegistrations: Array<{
    _id: string;
    name: string;
    createdAt: string;
    eventId: string | null;
    eventName: string | null;
  }>;
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

// Loading skeleton for dashboard sections
function ListSkeleton() {
  return (
    <Box>
      <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
      <Divider sx={{ mb: 2 }} />
      {[1, 2, 3, 4].map((item) => (
        <Box key={item} sx={{ mb: 2 }}>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
      ))}
    </Box>
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

// Format date for display
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
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
      <Box sx={{ px: 1 }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Dashboard
        </Typography>
        <DashboardSkeleton />
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Events Overview" />
              <CardContent>
                <ListSkeleton />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Recent Registrations" />
              <CardContent>
                <ListSkeleton />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ px: 1 }}>
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
      <Box sx={{ px: 1 }}>
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
    <Box sx={{ px: 1 }}>
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
      
      {/* Events and Recent Registrations */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Events List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Events Overview" 
              avatar={<EventNoteIcon color="primary" />}
              titleTypographyProps={{ variant: isMobile ? 'h6' : 'h5' }}
            />
            <Divider />
            <CardContent sx={{ p: 0, maxHeight: 360, overflow: 'auto' }}>
              <List>
                {stats.eventsList && stats.eventsList.length > 0 ? (
                  stats.eventsList.map((event) => (
                    <ListItem key={event._id} divider>
                      <ListItemText
                        primary={
                          <NextLink href={`/dashboard/teams?event=${event._id}`} passHref legacyBehavior>
                            <Link color="inherit" underline="hover">
                              {event.title}
                            </Link>
                          </NextLink>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <PeopleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {event.teamCount} {event.teamCount === 1 ? 'team' : 'teams'} registered
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip 
                        label={`${event.teamCount}`} 
                        color="primary" 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No events available" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Registrations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Recent Registrations" 
              avatar={<TimerIcon color="secondary" />}
              titleTypographyProps={{ variant: isMobile ? 'h6' : 'h5' }}
            />
            <Divider />
            <CardContent sx={{ p: 0, maxHeight: 360, overflow: 'auto' }}>
              <List>
                {stats.recentRegistrations && stats.recentRegistrations.length > 0 ? (
                  stats.recentRegistrations.map((registration) => (
                    <ListItem key={registration._id} divider>
                      <ListItemText
                        primary={
                          <NextLink href={`/dashboard/teams`} passHref legacyBehavior>
                            <Link color="inherit" underline="hover">
                              {registration.name}
                            </Link>
                          </NextLink>
                        }
                        secondary={
                          <Box>
                            {registration.eventName && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {registration.eventName}
                                </Typography>
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <CalendarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(registration.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No recent registrations" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 