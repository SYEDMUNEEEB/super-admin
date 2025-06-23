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
  name: Yup.string().required('Business name is required'),
  type: Yup.string().required('Business type is required'),
  address: Yup.string().required('Address is required'),
  contact: Yup.string().required('Contact information is required'),
});

export default function BusinessManagement() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [businesses, setBusinesses] = useState([
    {
      id: 1,
      name: 'Sample Business',
      type: 'Retail',
      address: '123 Main St',
      contact: '555-0123',
    },
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteBusinessId, setDeleteBusinessId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      address: '',
      contact: '',
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        if (editMode && selectedBusiness) {
          setBusinesses(businesses.map(business => 
            business.id === selectedBusiness.id ? { ...business, ...values } : business
          ));
          showSnackbar('Business updated successfully');
        } else {
          const newBusiness = {
            id: businesses.length + 1,
            ...values,
          };
          setBusinesses([...businesses, newBusiness]);
          showSnackbar('Business added successfully');
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
    setSelectedBusiness(null);
    formik.resetForm();
  };

  const handleEdit = (business) => {
    setEditMode(true);
    setSelectedBusiness(business);
    formik.setValues(business);
    setOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setDeleteBusinessId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    setBusinesses(businesses.filter(business => business.id !== deleteBusinessId));
    showSnackbar('Business deleted successfully');
    setConfirmDeleteOpen(false);
    setDeleteBusinessId(null);
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
          Add Business
        </Button>
      </Box>

      {isMobile ? (
        // Mobile view - Card layout
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {businesses.map((business) => (
            <Paper 
              key={business.id}
              sx={{ 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {business.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    size="small" 
                    onClick={() => handleEdit(business)}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleDeleteRequest(business.id)}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                ID: {business.id}
              </Typography>
              <Typography variant="body2">
                Type: {business.type}
              </Typography>
              <Typography variant="body2">
                Address: {business.address}
              </Typography>
              <Typography variant="body2">
                Contact: {business.contact}
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
                <TableCell>Type</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {businesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>{business.id}</TableCell>
                  <TableCell>{business.name}</TableCell>
                  <TableCell>{business.type}</TableCell>
                  <TableCell>{business.address}</TableCell>
                  <TableCell>{business.contact}</TableCell>
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
                        onClick={() => handleEdit(business)}
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
                        onClick={() => handleDeleteRequest(business.id)}
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

      {/* Add/Edit Business Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {editMode ? 'Edit Business' : 'Add New Business'}
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Business Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Business Type"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Contact"
              name="contact"
              value={formik.values.contact}
              onChange={formik.handleChange}
              error={formik.touched.contact && Boolean(formik.errors.contact)}
              helperText={formik.touched.contact && formik.errors.contact}
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editMode ? 'Update' : 'Add'} Business
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Delete Business</DialogTitle>
        <DialogContent>Are you sure you want to delete this business?</DialogContent>
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
