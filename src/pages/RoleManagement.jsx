import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Typography,
  Chip,
  Grid,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const permissionGroups = {
  'User Management': ['view_users', 'create_users', 'edit_users', 'delete_users'],
  'Role Management': ['view_roles', 'create_roles', 'edit_roles', 'delete_roles'],
  'Business Management': ['view_businesses', 'create_businesses', 'edit_businesses', 'delete_businesses'],
  'System Settings': ['view_settings', 'edit_settings'],
};

const validationSchema = Yup.object({
  name: Yup.string().required('Role name is required'),
  description: Yup.string().required('Description is required'),
});

export default function RoleManagement() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Admin',
      description: 'Administrator with full access',
      permissions: Object.values(permissionGroups).flat(),
    },
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        if (editMode && selectedRole) {
          setRoles(roles.map(role => role.id === selectedRole.id ? { ...role, ...values } : role));
          showSnackbar('Role updated successfully');
        } else {
          const newRole = {
            id: roles.length + 1,
            ...values,
            permissions: [],
          };
          setRoles([...roles, newRole]);
          showSnackbar('Role added successfully');
        }
        handleClose();
      } catch {
        showSnackbar('An error occurred', 'error');
      }
    },
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedRole(null);
    formik.resetForm();
  };

  const handleEdit = (role) => {
    setEditMode(true);
    setSelectedRole(role);
    formik.setValues(role);
    setOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setDeleteRoleId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    setRoles(roles.filter(role => role.id !== deleteRoleId));
    showSnackbar('Role deleted successfully');
    setConfirmDeleteOpen(false);
    setDeleteRoleId(null);
  };

  const getPermissionLabel = (perm) =>
    perm.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <Box 
      sx={{ 
        width: '100%',
        p: { xs: 1, sm: 2, md: 3 },
        boxSizing: 'border-box'
      }}
    >
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        mb={2}
        width="100%"
      >
        <Button 
          variant="contained" 
          onClick={() => setOpen(true)}
          sx={{
            minWidth: { xs: '120px', sm: '150px' },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            py: { xs: 1, sm: 1.5 },
            px: { xs: 2, sm: 3 },
            mx: 'auto'
          }}
        >
          Add Role
        </Button>
      </Box>

      {isMobile ? (
        // Mobile view - Card layout
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {roles.map((role) => (
            <Paper 
              key={role.id}
              sx={{ 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {role.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    size="small" 
                    onClick={() => handleEdit(role)}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleDeleteRequest(role.id)}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                ID: {role.id}
              </Typography>
              <Typography variant="body2">
                {role.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {role.permissions.slice(0, 3).map((perm) => (
                  <Chip 
                    key={perm} 
                    label={getPermissionLabel(perm)} 
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: '20px',
                      '& .MuiChip-label': {
                        px: 0.5
                      }
                    }}
                  />
                ))}
                {role.permissions.length > 3 && (
                  <Chip 
                    label={`+${role.permissions.length - 3}`} 
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      height: '20px',
                      '& .MuiChip-label': {
                        px: 0.5
                      }
                    }}
                  />
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        // Desktop view - Table layout
        <TableContainer 
          component={Paper} 
          sx={{ 
            overflowX: 'auto',
            '& .MuiTable-root': {
              minWidth: 650,
            },
            '& .MuiTableCell-root': {
              whiteSpace: 'nowrap',
              px: 2,
              py: 1.5,
              fontSize: '1rem',
            },
            '& .MuiTableCell-head': {
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
            },
          }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell width="10%">ID</TableCell>
                <TableCell width="20%">Name</TableCell>
                <TableCell width="30%">Description</TableCell>
                <TableCell width="25%">Permissions</TableCell>
                <TableCell width="15%" align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 0.5,
                      }}
                    >
                      {role.permissions.slice(0, 3).map((perm) => (
                        <Chip 
                          key={perm} 
                          label={getPermissionLabel(perm)} 
                          size="small"
                          sx={{
                            fontSize: '0.875rem',
                            height: '24px',
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      ))}
                      {role.permissions.length > 3 && (
                        <Chip 
                          label={`+${role.permissions.length - 3}`} 
                          size="small"
                          sx={{
                            fontSize: '0.875rem',
                            height: '24px',
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        gap: 1,
                        justifyContent: 'center',
                      }}
                    >
                      <Button 
                        size="small" 
                        onClick={() => handleEdit(role)}
                        sx={{
                          minWidth: '60px',
                          fontSize: '0.875rem',
                          py: 1
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={() => handleDeleteRequest(role.id)}
                        sx={{
                          minWidth: '60px',
                          fontSize: '0.875rem',
                          py: 1
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Role Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            width: { xs: '95%', sm: '80%', md: '60%' },
            maxHeight: { xs: '90vh', sm: '80vh' }
          }
        }}
      >
        <DialogTitle sx={{ 
          p: { xs: 1.5, sm: 2 },
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}>
          {editMode ? 'Edit Role' : 'Add New Role'}
          <IconButton 
            onClick={handleClose} 
            sx={{ 
              position: 'absolute', 
              right: 8, 
              top: 8,
              p: { xs: 0.5, sm: 1 }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 } }}>
            <TextField
              fullWidth
              label="Role Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="dense"
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              margin="dense"
              size={isMobile ? "small" : "medium"}
            />

            {editMode && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography 
                  variant="subtitle1" 
                  gutterBottom
                  sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
                >
                  Permissions
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(permissionGroups).map(([group, permissions]) => (
                    <Grid item xs={12} sm={6} key={group}>
                      <Typography 
                        variant="body2" 
                        fontWeight="bold" 
                        gutterBottom
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                      >
                        {group}
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 1,
                          '& .MuiChip-root': {
                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                            height: { xs: '20px', sm: '24px' },
                            '& .MuiChip-label': {
                              px: { xs: 0.5, sm: 1 }
                            }
                          }
                        }}
                      >
                        {permissions.map((perm) => {
                          const selected = selectedRole?.permissions.includes(perm);
                          return (
                            <Chip
                              key={perm}
                              label={getPermissionLabel(perm)}
                              variant={selected ? 'filled' : 'outlined'}
                              color={selected ? 'primary' : 'default'}
                            />
                          );
                        })}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Button 
              onClick={handleClose}
              size={isMobile ? "small" : "medium"}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              size={isMobile ? "small" : "medium"}
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {editMode ? 'Update' : 'Add'} Role
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>Are you sure you want to delete this role?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
