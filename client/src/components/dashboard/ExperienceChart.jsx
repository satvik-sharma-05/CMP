import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Skeleton, Box } from '@mui/material';

const ExperienceChart = ({ data, loading }) => {
  if (loading) return <Skeleton variant="rectangular" height={300} />;

  const formatted = data?.map(item => ({
    name: item._id, // like "0-2", "2-5", ...
    count: item.count
  })) || [];

  return (
    <Box>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#4caf50" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ExperienceChart;
