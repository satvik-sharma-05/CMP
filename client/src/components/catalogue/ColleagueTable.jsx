import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  Avatar,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import ActionMenu from './ActionMenu';

const ColleagueTable = ({
  colleagues,
  loading,
  orderBy,
  order,
  onRequestSort,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const getBillingStatusColor = (status) => {
    switch (status) {
      case 'FULLY_BILLED':
        return 'success';
      case 'PARTIALLY_BILLED':
        return 'warning';
      case 'UNBILLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'Available':
        return 'success';
      case 'Project delivery':
        return 'primary';
      case 'On Leave':
        return 'warning';
      case 'Reserved':
        return 'info';
      case 'Onboarding':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const headCells = [
    { id: 'fullName', label: 'Name' },
    { id: 'experienceInYears', label: 'Experience' },
    { id: 'managerId', label: 'Manager' },
    { id: 'skills', label: 'Skills' },
    { id: 'billingStatus', label: 'Billing Status' },
    { id: 'availability', label: 'Availability' },
    { id: 'assignment', label: 'Assignment' },
    { id: 'actions', label: 'Actions', disablePadding: true }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}
                sx={{ fontWeight: 'bold' }}
              >
                {headCell.id !== 'actions' ? (
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id && (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    )}
                  </TableSortLabel>
                ) : (
                  headCell.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {Array.isArray(colleagues) && colleagues.length > 0 ? (
            colleagues.map((colleague) => (
              <TableRow
                key={colleague._id}
                sx={{
                  opacity: colleague.availability?.status === 'Deactivated' ? 0.5 : 1,
                  transition: 'opacity 0.4s ease'
                }}


              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 1 }}>
                      {colleague.firstName?.[0] || ''}
                      {colleague.lastName?.[0] || ''}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{colleague.fullName || ''}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {colleague.email || ''}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>{colleague.experienceInYears ?? '-'} years</TableCell>
                <TableCell>{colleague.managerId?.name || 'Not Assigned'}</TableCell>

                <TableCell>
                  {Array.isArray(colleague.skills) && colleague.skills.slice(0, 2).map((skill, index) => (
                    <Chip key={index} label={skill} size="small" sx={{ mr: 0.5 }} />
                  ))}
                  {Array.isArray(colleague.skills) && colleague.skills.length > 2 && (
                    <Chip
                      label={`+${colleague.skills.length - 2} more`}
                      size="small"
                      color="default"
                    />
                  )}
                </TableCell>

                <TableCell>
                  <Chip
                    label={colleague.billingStatus ? colleague.billingStatus.replace('_', ' ') : ''}
                    color={getBillingStatusColor(colleague.billingStatus)}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    label={
                      colleague.availability?.status === 'Deactivated'
                        ? 'Deactivated'
                        : colleague.availability?.availableInDays > 0
                          ? `${colleague.availability.status} (${colleague.availability.availableInDays} days)`
                          : colleague.availability?.status || ''
                    }
                    color={
                      colleague.availability?.status === 'Deactivated'
                        ? 'default'
                        : getAvailabilityColor(colleague.availability?.status)
                    }
                    variant={colleague.availability?.status === 'Deactivated' ? 'outlined' : 'filled'}
                    size="small"
                    sx={{
                      fontStyle: colleague.availability?.status === 'Deactivated' ? 'italic' : 'normal'
                    }}
                  />
                </TableCell>

                <TableCell>
                  {colleague.assignment?.name && colleague.assignment.name !== 'None'
                    ? colleague.assignment.name
                    : 'Unassigned'}
                </TableCell>

                <TableCell>
                  <ActionMenu
                    onView={() => onView(colleague)}
                    onEdit={() => onEdit(colleague)}
                    onDelete={() => onDelete(colleague)}
                    onToggleStatus={() => onToggleStatus(colleague)}
                    isDeactivated={colleague.availability?.status === 'Deactivated'}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No colleagues found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ColleagueTable;
