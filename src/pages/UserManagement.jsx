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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
});

export default function UserManagement() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
    },
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      role: '',
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        if (editMode && selectedUser) {
          setUsers(users.map(user => user.id === selectedUser.id ? { ...user, ...values } : user));
          showSnackbar('User updated successfully');
        } else {
          const newUser = {
            id: users.length + 1,
            ...values,
          };
          setUsers([...users, newUser]);
          showSnackbar('User added successfully');
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
    setSelectedUser(null);
    formik.resetForm();
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setSelectedUser(user);
    formik.setValues(user);
    setOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setDeleteUserId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter(user => user.id !== deleteUserId));
    showSnackbar('User deleted successfully');
    setConfirmDeleteOpen(false);
    setDeleteUserId(null);
  };

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
          Add User
        </Button>
      </Box>

      {isMobile ? (
        // Mobile view - Card layout
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {users.map((user) => (
            <Paper 
              key={user.id}
              sx={{ 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    size="small" 
                    onClick={() => handleEdit(user)}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleDeleteRequest(user.id)}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                ID: {user.id}
              </Typography>
              <Typography variant="body2">
                Email: {user.email}
              </Typography>
              <Typography variant="body2">
                Role: {user.role}
              </Typography>
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
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
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
                        onClick={() => handleEdit(user)}
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
                        onClick={() => handleDeleteRequest(user.id)}
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

      {/* Add/Edit User Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {editMode ? 'Edit User' : 'Add New User'}
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Update' : 'Add'} User
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>Are you sure you want to delete this user?</DialogContent>
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
