import React from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  Edit,
  Delete,
  PersonOff
} from '@mui/icons-material';

const ActionMenu = ({ colleague, onView, onEdit, onDelete, isDeactivated,onToggleStatus }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleClose();
    action(colleague);
  };

  return (
    <>
      <MenuItem onClick={() => handleAction(onView)}>
        View Profile
      </MenuItem>
      <MenuItem onClick={() => handleAction(onEdit)}>
        Edit
      </MenuItem>
      <MenuItem onClick={onToggleStatus}>
        {isDeactivated ? 'Activate' : 'Deactivate'}
      </MenuItem>

      <MenuItem
        onClick={() => handleAction(onDelete)}
        sx={{ color: 'error.main' }}
      >
        Delete
      </MenuItem>
    </>
  );
};

export default ActionMenu;