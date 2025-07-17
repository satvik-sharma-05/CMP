// src/components/catalogue/Breadcrumbs.jsx
import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { Home } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map URL segments to human‑readable labels:
  const nameMap = {
    dashboard: 'Dashboard',
    catalogue: 'Colleague Catalogue',
    // add more if you have deeper routes
  };

  return (
    <Box sx={{ py: 1, px: 3, backgroundColor: '#f5f5f5' }}>
      <MuiBreadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} to="/dashboard" sx={{ display: 'flex', alignItems: 'center' }}>
          <Home fontSize="small" sx={{ mr: .5 }} />
          Home
        </Link>
        {pathnames.map((segment, idx) => {
          const to = `/${pathnames.slice(0, idx + 1).join('/')}`;
          const isLast = idx === pathnames.length - 1;
          const label = nameMap[segment] || segment;
          return isLast
            ? <Typography key={to} color="text.primary">{label}</Typography>
            : <Link key={to} component={RouterLink} to={to}>{label}</Link>;
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
