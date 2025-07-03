import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { People, Assignment, CheckCircle, Schedule } from '@mui/icons-material';

const KPISummary = ({ stats }) => {
  const kpis = [
    {
      title: 'Total Colleagues',
      value: stats?.totalColleagues || 0,
      icon: <People fontSize="large" />,
      color: '#1976d2'
    },
    {
      title: 'Fully Billed',
      value: stats?.billingStats?.find(s => s._id === 'FULLY_BILLED')?.count || 0,
      icon: <CheckCircle fontSize="large" />,
      color: '#2e7d32'
    },
    {
      title: 'Available',
      value: stats?.availabilityStats?.find(s => s._id === 'Available')?.count || 0,
      icon: <Schedule fontSize="large" />,
      color: '#ed6c02'
    },
    {
      title: 'On Projects',
      value: stats?.availabilityStats?.find(s => s._id === 'Project delivery')?.count || 0,
      icon: <Assignment fontSize="large" />,
      color: '#9c27b0'
    }
  ];
  return (
    <Grid container spacing={2}>
      {kpis.map((kpi) => (
        <Grid item xs={12} sm={6} md={3} key={kpi.title}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Box mr={2} color={kpi.color}>
                  {kpi.icon}
                </Box>
                <Box>
                  <Typography variant="h5" component="div">
                    {kpi.value}
                  </Typography>
                  <Typography color="textSecondary">
                    {kpi.title}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default KPISummary;