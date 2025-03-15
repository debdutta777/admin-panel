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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Tooltip,
  Skeleton,
  useMediaQuery,
  useTheme,
  Alert
} from '@mui/material';
import { 
  Event as EventIcon, 
  Group as GroupIcon, 
  Today as TodayIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  PeopleAlt as PeopleIcon,
  School as SchoolIcon,
  Insights as InsightsIcon
} from '@mui/icons-material';

// Interface for dashboard stats
interface DashboardStats {
  totalEvents: number;
  totalTeams: number;
  totalInstitutions: number;
  totalParticipants: number;
  upcomingEvents: {
    _id: string;
    title: string;
    date: Date;
    venue: string;
    type: string;
  }[];
  recentRegistrations: {
    _id: string;
    name: string;
    event?: {
      _id: string;
      title: string;
    };
    leader: {
      name: string;
      email: string;
      phone: string;
    };
    registrationDate: string;
  }[];
}

// Sample upcoming events
const sampleUpcomingEvents = [
  {
    _id: "evt1",
    title: "Annual Tech Conference",
    date: new Date("2025-04-15"),
    venue: "Convention Center",
    type: "Conference"
  },
  {
    _id: "evt2",
    title: "Hackathon 2025",
    date: new Date("2025-05-10"),
    venue: "University Campus",
    type: "Competition"
  },
  {
    _id: "evt3",
    title: "AI Workshop",
    date: new Date("2025-04-25"),
    venue: "Innovation Hub",
    type: "Workshop"
  }
];

// Sample recent registrations
const sampleRecentRegistrations = [
  {
    _id: "team1",
    name: "Code Wizards",
    event: {
      _id: "evt1",
      title: "Annual Tech Conference"
    },
    leader: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567"
    },
    registrationDate: "2025-03-10"
  },
  {
    _id: "team2",
    name: "Data Miners",
    event: {
      _id: "evt2",
      title: "Hackathon 2025"
    },
    leader: {
      name: "Emily Johnson",
      email: "emily.j@example.com",
      phone: "+1 (555) 987-6543"
    },
    registrationDate: "2025-03-12"
  },
  {
    _id: "team3",
    name: "AI Innovators",
    event: {
      _id: "evt3",
      title: "AI Workshop"
    },
    leader: {
      name: "Michael Chen",
      email: "michael.c@example.com",
      phone: "+1 (555) 456-7890"
    },
    registrationDate: "2025-03-14"
  }
];

// Static dashboard data with sample events and registrations
const staticDashboardData: DashboardStats = {
  totalTeams: 42,
  totalEvents: 12,
  totalInstitutions: 15,
  totalParticipants: 156,
  upcomingEvents: sampleUpcomingEvents,
  recentRegistrations: sampleRecentRegistrations
};

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
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
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
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use static data instead of API call
        setStats(staticDashboardData);
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
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Teams" 
            value={stats.totalTeams} 
            icon={<PeopleIcon />} 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Events" 
            value={stats.totalEvents} 
            icon={<EventIcon />} 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Institutions" 
            value={stats.totalInstitutions} 
            icon={<SchoolIcon />} 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Participants" 
            value={stats.totalParticipants} 
            icon={<InsightsIcon />} 
            loading={loading}
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader 
              title="Upcoming Events" 
              avatar={<CalendarIcon color="primary" />}
              titleTypographyProps={{ variant: isMobile ? 'h6' : 'h5' }}
            />
            <Divider />
            <CardContent sx={{ p: 0, maxHeight: { xs: 300, sm: 400 }, overflow: 'auto' }}>
              <List>
                {stats.upcomingEvents.length > 0 ? (
                  stats.upcomingEvents.map((event) => (
                    <ListItem key={event._id} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <TodayIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography 
                              variant="body1" 
                              fontWeight="medium"
                              sx={{ mr: 1 }}
                            >
                              {event.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                              {`${event.date.toLocaleDateString()} - ${event.venue}`}
                            </Typography>
                            <Chip 
                              size="small" 
                              label={event.type} 
                              color="primary" 
                              variant="outlined"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No upcoming events" />
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
              avatar={<GroupIcon color="secondary" />}
              titleTypographyProps={{ variant: isMobile ? 'h6' : 'h5' }}
            />
            <Divider />
            <CardContent sx={{ p: 0, maxHeight: { xs: 300, sm: 400 }, overflow: 'auto' }}>
              <List>
                {stats.recentRegistrations.length > 0 ? (
                  stats.recentRegistrations.map((team) => (
                    <ListItem key={team._id} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {team.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body1" fontWeight="medium">
                              {team.name}
                            </Typography>
                            <Chip 
                              size="small" 
                              label={team.event && team.event.title ? team.event.title : 'No Event'} 
                              color="primary" 
                              variant="outlined"
                              sx={{ ml: { xs: 0, sm: 1 } }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                              <PersonIcon fontSize="small" color="action" />
                              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                {team.leader.name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <EmailIcon fontSize="small" color="action" />
                              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                {team.leader.email}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <PhoneIcon fontSize="small" color="action" />
                              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                {team.leader.phone}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              Registered: {new Date(team.registrationDate).toLocaleDateString()}
                            </Typography>
                          </>
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