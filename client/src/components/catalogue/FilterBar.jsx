import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  InputAdornment,
  Box,
  Grid
} from '@mui/material';
import { Search } from '@mui/icons-material';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const handleFilterChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const skillOptions = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular',
    'Vue.js', 'PHP', 'C#', 'Go', 'Ruby', 'Swift', 'Kotlin'
  ];

  const availabilityOptions = [
    'Available', 'Project delivery', 'On Leave', 'Reserved', 'Onboarding'
  ];

  const billingOptions = [
    'FULLY_BILLED', 'PARTIALLY_BILLED', 'UNBILLED'
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name or email..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Skill</InputLabel>
            <Select
              value={filters.skill || ''}
              label="Skill"
              onChange={(e) => handleFilterChange('skill', e.target.value)}
            >
              <MenuItem value="">All Skills</MenuItem>
              {skillOptions.map((skill) => (
                <MenuItem key={skill} value={skill}>{skill}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Availability</InputLabel>
            <Select
              value={filters.availability || ''}
              label="Availability"
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {availabilityOptions.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Billing</InputLabel>
            <Select
              value={filters.billing || ''}
              label="Billing"
              onChange={(e) => handleFilterChange('billing', e.target.value)}
            >
              <MenuItem value="">All Billing</MenuItem>
              {billingOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClearFilters}
            size="small"
            fullWidth
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>
      {/* Active Filters */}
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {Object.entries(filters).map(([key, value]) =>
          value && (
            <Chip
              key={key}
              label={`${key}: ${value}`}
              onDelete={() => handleFilterChange(key, '')}
              size="small"
              variant="outlined"
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default FilterBar;