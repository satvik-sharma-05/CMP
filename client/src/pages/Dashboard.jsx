import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import api from '../services/api';
import KPISummary from '../components/dashboard/KPISummary';
import BillingChart from '../components/dashboard/BillingChart';
import AvailabilityChart from '../components/dashboard/AvailabilityChart';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ mb: 4 }}>
        <KPISummary stats={stats} loading={loading} />
      </Box>

      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Billing Summary" />
          <Tab label="Availability Breakdown" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <BillingChart data={stats?.billingStats} loading={loading} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <AvailabilityChart data={stats?.availabilityStats} loading={loading} />
        </TabPanel>
      </Paper>

      {stats?.skillsStats?.length > 0 && (
        <Box mt={5}>
          <Typography variant="h6" gutterBottom>
            Top Skills Distribution
          </Typography>
          <Grid container spacing={2}>
            {stats.skillsStats.map((skill, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary">
                    {skill.count}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {skill._id}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
