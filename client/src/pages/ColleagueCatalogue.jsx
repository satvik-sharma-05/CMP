import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Paper, Snackbar, MenuItem, Select, InputLabel, FormControl, 
  Grid,
} from '@mui/material';
import { Add, GetApp } from '@mui/icons-material';
import api from '../services/api';
import FilterBar from '../components/catalogue/FilterBar';
import ColleagueTable from '../components/catalogue/ColleagueTable';



import Breadcrumbs from '../components/layout/Breadcrumbs';

const ColleagueCatalogue = () => {
  const [colleagues, setColleagues] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('firstName');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, colleague: null });
  const [openAdd, setOpenAdd] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [editColleague, setEditColleague] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'





  const [newColleague, setNewColleague] = useState({
    firstName: '',
    lastName: '',
    email: '',
    skills: '',
    experienceInYears: '',
    billingStatus: 'UNBILLED',
    availability: { availableInDays: '', status: 'Available' },
    assignment: { name: '' },
    managerId: '',
  });

  useEffect(() => {
    fetchColleagues();
  }, [filters, order, orderBy]);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchColleagues = async () => {
    try {
      setLoading(true);
      const params = { ...filters, sortBy: orderBy, sortOrder: order };
      const response = await api.get('/colleagues', { params });
      console.log('colleagues data:', colleagues);
      setColleagues(response.data.colleagues);
    } catch (err) {
      setError('Failed to fetch colleagues');
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await api.get('/managers');
      setManagers(res.data);
    } catch (err) {
      setError('Failed to load managers');
    }
  };

  const handleRequestSort = (_, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDelete = (colleague) => {
    setDeleteDialog({ open: true, colleague });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/colleagues/${deleteDialog.colleague._id}`);
      setDeleteDialog({ open: false, colleague: null });
      fetchColleagues();
      setSuccessMessage('Colleague deleted successfully');
    } catch (err) {
      setError('Failed to delete colleague');
    }
  };
  const handleToggleStatus = async (colleague) => {
    const newStatus = colleague.availability.status === 'Deactivated' ? 'Available' : 'Deactivated';
    try {
      await api.put(`/colleagues/${colleague._id}`, {
        availability: {
          ...colleague.availability,
          status: newStatus
        }
      });
      setSuccessMessage(`${colleague.firstName} ${newStatus === 'Deactivated' ? 'deactivated' : 'activated'} successfully`);
      fetchColleagues();
    } catch (err) {
      console.error('Status toggle error:', err);
      setError(`Failed to ${newStatus === 'Deactivated' ? 'deactivate' : 'activate'} colleague`);
    }
  };







  const handleExport = async () => {
    try {
      const response = await api.get('/colleagues/export', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'colleagues.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export error:', error);
    }
  };

  const handleAddColleague = async () => {
    try {
      const payload = {
        ...newColleague,
        skills: newColleague.skills.split(',').map(s => s.trim()),
        experienceInYears: Number(newColleague.experienceInYears),
        availability: {
          availableInDays: Number(newColleague.availability.availableInDays),
          status: newColleague.availability.status
        }
      };

      await api.post('/colleagues', payload);
      setOpenAdd(false);
      fetchColleagues();
      setSuccessMessage('Colleague added successfully');
      setNewColleague({
        firstName: '',
        lastName: '',
        email: '',
        skills: '',
        experienceInYears: '',
        billingStatus: 'UNBILLED',
        availability: { availableInDays: '', status: 'Available' },
        assignment: { name: '' },
        managerId: ''
      });
    } catch (err) {
      if (err.response?.status === 400 && err.response.data?.error?.includes('E11000')) {
        setError('Email already exists. Try a different one.');
      } else {
        setError('Failed to add colleague');
      }
    }
  };
  const handleUpdateColleague = async () => {
    try {
      const payload = {
        firstName: editColleague.firstName,
        lastName: editColleague.lastName,
        email: editColleague.email,
        skills: typeof editColleague.skills === 'string'
          ? editColleague.skills.split(',').map(s => s.trim())
          : editColleague.skills,
        experienceInYears: Number(editColleague.experienceInYears),
        billingStatus: editColleague.billingStatus,
        managerId: editColleague.managerId,
        availability: {
          status: editColleague.availability?.status || 'Available',
          availableInDays: Number(editColleague.availability?.availableInDays || 0)
        },
        assignment: {
          name: editColleague.assignment?.name || 'None',
          type: editColleague.assignment?.type || 'Unassigned'
        }
      };

      console.log("Updating colleague...", payload);

      await api.put(`/colleagues/${editColleague._id}`, payload);
      setOpenEdit(false);
      fetchColleagues();
      setSuccessMessage('Colleague updated successfully');
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      setError('Failed to update colleague');
    }
  };


  return (

    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Colleague Catalogue
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
          >
            {viewMode === 'table' ? 'Switch to Card View' : 'Switch to Table View'}
          </Button>





          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<GetApp />} onClick={handleExport}>Export CSV</Button>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAdd(true)}>Add Colleague</Button>
          </Box>



        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={() => setFilters({})}
        />

        {viewMode === 'table' ? (
  <ColleagueTable
    colleagues={colleagues}
    loading={loading}
    order={order}
    orderBy={orderBy}
    onRequestSort={handleRequestSort}
    onView={(c) => alert(`${c.firstName} ${c.lastName}\nEmail: ${c.email}`)}
    onEdit={(colleague) => {
      setEditColleague({ ...colleague });
      setOpenEdit(true);
    }}
    onDelete={handleDelete}
    onToggleStatus={handleToggleStatus}
  />
) : (
  <Grid container spacing={2}>
    {colleagues.map((colleague) => (
      <Grid item xs={12} md={6} lg={4} key={colleague._id}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">{colleague.fullName}</Typography>
          <Typography variant="body2">{colleague.email}</Typography>
          <Typography variant="body2">Experience: {colleague.experienceInYears} years</Typography>
          <Typography variant="body2">Manager: {colleague.managerId?.name || 'N/A'}</Typography>
          <Typography variant="body2">Billing: {colleague.billingStatus}</Typography>
          <Typography variant="body2">Status: {colleague.availability.status}</Typography>
          <Typography variant="body2">Assignment: {colleague.assignment.name}</Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            <Button size="small" onClick={() => alert(`${colleague.firstName} ${colleague.lastName}`)}>View</Button>
            <Button size="small" onClick={() => {
              setEditColleague({ ...colleague });
              setOpenEdit(true);
            }}>Edit</Button>
            <Button size="small" color="error" onClick={() => handleDelete(colleague)}>Delete</Button>
            <Button size="small" onClick={() => handleToggleStatus(colleague)}>
              {colleague.availability.status === 'Deactivated' ? 'Activate' : 'Deactivate'}
            </Button>
          </Box>
        </Paper>
      </Grid>
    ))}
  </Grid>
)}




      </Paper>

      {/* ✅ Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, colleague: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {deleteDialog.colleague?.firstName}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, colleague: null })}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Add Colleague Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Colleague</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="First Name"
              required
              value={newColleague.firstName}
              onChange={(e) => setNewColleague({ ...newColleague, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              required
              value={newColleague.lastName}
              onChange={(e) => setNewColleague({ ...newColleague, lastName: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              required
              value={newColleague.email}
              onChange={(e) => setNewColleague({ ...newColleague, email: e.target.value })}
              error={!!newColleague.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newColleague.email)}
              helperText={
                newColleague.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newColleague.email)
                  ? 'Invalid email format'
                  : ''
              }
            />
            <TextField
              label="Skills (comma separated)"
              required
              value={newColleague.skills}
              onChange={(e) => setNewColleague({ ...newColleague, skills: e.target.value })}
            />
            <TextField
              label="Experience (years)"
              type="number"
              required
              inputProps={{ min: 0 }}
              value={newColleague.experienceInYears}
              onChange={(e) =>
                setNewColleague({ ...newColleague, experienceInYears: e.target.value })
              }
            />

            {/* Billing Status Dropdown */}
            <FormControl fullWidth required>
              <InputLabel>Billing Status</InputLabel>
              <Select
                value={newColleague.billingStatus}
                label="Billing Status"
                onChange={(e) =>
                  setNewColleague({ ...newColleague, billingStatus: e.target.value })
                }
              >
                <MenuItem value="FULLY_BILLED">Fully Billed</MenuItem>
                <MenuItem value="PARTIALLY_BILLED">Partially Billed</MenuItem>
                <MenuItem value="UNBILLED">Unbilled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Availability Days"
              type="number"
              inputProps={{ min: 0 }}
              required
              value={newColleague.availability.availableInDays}
              onChange={(e) =>
                setNewColleague({
                  ...newColleague,
                  availability: {
                    ...newColleague.availability,
                    availableInDays: e.target.value
                  }
                })
              }
            />

            {/* Availability Status Dropdown */}
            <FormControl fullWidth required>
              <InputLabel>Availability Status</InputLabel>
              <Select
                value={newColleague.availability.status}
                label="Availability Status"
                onChange={(e) =>
                  setNewColleague({
                    ...newColleague,
                    availability: {
                      ...newColleague.availability,
                      status: e.target.value
                    }
                  })
                }
              >
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="On Leave">On Leave</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Assignment Name"
              value={newColleague.assignment.name}
              onChange={(e) =>
                setNewColleague({ ...newColleague, assignment: { name: e.target.value } })
              }
            />

            {/* Manager Dropdown */}
            <FormControl fullWidth required>
              <InputLabel>Manager</InputLabel>
              <Select
                value={newColleague.managerId}
                label="Manager"
                onChange={(e) =>
                  setNewColleague({ ...newColleague, managerId: e.target.value })
                }
              >
                <MenuItem value="">Select a manager</MenuItem>
                {managers.map((m) => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.username} ({m.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddColleague}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* ✅ Edit Colleague Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Colleague</DialogTitle>
        <DialogContent>
          {editColleague && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="First Name"
                value={editColleague.firstName}
                onChange={(e) => setEditColleague({ ...editColleague, firstName: e.target.value })}
              />
              <TextField
                label="Last Name"
                value={editColleague.lastName}
                onChange={(e) => setEditColleague({ ...editColleague, lastName: e.target.value })}
              />
              <TextField
                label="Email"
                type="email"
                value={editColleague.email}
                onChange={(e) => setEditColleague({ ...editColleague, email: e.target.value })}
              />
              <TextField
                label="Skills (comma separated)"
                value={Array.isArray(editColleague.skills) ? editColleague.skills.join(', ') : editColleague.skills}
                onChange={(e) => setEditColleague({ ...editColleague, skills: e.target.value })}
              />
              <TextField
                label="Experience (years)"
                type="number"
                value={editColleague.experienceInYears}
                onChange={(e) =>
                  setEditColleague({ ...editColleague, experienceInYears: e.target.value })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Billing Status</InputLabel>
                <Select
                  value={editColleague.billingStatus}
                  onChange={(e) => setEditColleague({ ...editColleague, billingStatus: e.target.value })}
                >
                  <MenuItem value="FULLY_BILLED">Fully Billed</MenuItem>
                  <MenuItem value="PARTIALLY_BILLED">Partially Billed</MenuItem>
                  <MenuItem value="UNBILLED">Unbilled</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Availability Days"
                type="number"
                value={editColleague.availability.availableInDays}
                onChange={(e) =>
                  setEditColleague({
                    ...editColleague,
                    availability: {
                      ...editColleague.availability,
                      availableInDays: e.target.value
                    }
                  })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Availability Status</InputLabel>
                <Select
                  value={editColleague.availability.status}
                  onChange={(e) =>
                    setEditColleague({
                      ...editColleague,
                      availability: {
                        ...editColleague.availability,
                        status: e.target.value
                      }
                    })
                  }
                >
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="On Leave">On Leave</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Assignment Name"
                value={editColleague.assignment.name}
                onChange={(e) =>
                  setEditColleague({ ...editColleague, assignment: { name: e.target.value } })
                }
              />
            </Box>
          )}f
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateColleague}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success messages */}
      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage('')} message={successMessage} />
    </Container>
  );
};

export default ColleagueCatalogue;
