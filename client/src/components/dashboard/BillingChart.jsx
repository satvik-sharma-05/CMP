import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cell } from 'recharts';

const BillingChart = ({ data }) => {
  const chartData = data?.map(item => ({
    status: item._id.replace('_', ' '),
    count: item.count
  })) || [];

  const getColor = (status) => {
    switch (status) {
      case 'FULLY BILLED': return '#2e7d32';
      case 'PARTIALLY BILLED': return '#ed6c02';
      case 'UNBILLED': return '#d32f2f';
      default: return '#1976d2';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Billing Status Distribution
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1976d2" isAnimationActive>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BillingChart;