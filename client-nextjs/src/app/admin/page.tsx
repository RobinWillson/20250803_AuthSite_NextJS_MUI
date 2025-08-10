'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';
import AdminRoute from '@/components/AdminRoute';
import { useAuth } from '@/hooks/useAuth';
import userService, { User } from '@/services/userService';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [search, setSearch] = useState('');
  const [page] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { token, user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [token, page, search]);

  const fetchUsers = async () => {
    if (!token) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await userService.getAllUsers(token, page, 10, search);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!token) return;
    
    setError('');
    try {
      await userService.updateUserRole(userId, newRole, token);
      // Update the user's role in the local state for immediate UI feedback
      setUsers(users.map(u => (u._id === userId ? { ...u, isAdmin: newRole === 'admin' } : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!token) return;

    setError('');
    try {
      await userService.deleteUser(userId, token);
      setUsers(users.filter((u) => u._id !== userId));
      setDeleteDialog({ open: false, user: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const openDeleteDialog = (user: User) => {
    setDeleteDialog({ open: true, user });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, user: null });
  };

  const getUserProvider = (user: User) => {
    return user.googleId ? 'Google' : 'Email';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <AdminRoute>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminIcon color="primary" />
          Admin Dashboard - User Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Users Table */}
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Provider</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Verified</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Joined</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user.isAdmin ? <AdminIcon color="primary" /> : <PersonIcon color="action" />}
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon color="action" />
                      {user.email}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {currentUser && user._id === currentUser.id ? (
                      // Current admin user cannot change their own role
                      <Chip
                        label={user.isAdmin ? 'Admin' : 'User'}
                        color={user.isAdmin ? 'primary' : 'default'}
                        variant="outlined"
                      />
                    ) : (
                      <FormControl size="small">
                        <Select
                          value={user.isAdmin ? 'admin' : 'user'}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        >
                          <MenuItem value="user">User</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getUserProvider(user) === 'Google' ? (
                        <GoogleIcon color="primary" />
                      ) : (
                        <EmailIcon color="action" />
                      )}
                      {getUserProvider(user)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.emailVerified ? 'Verified' : 'Unverified'}
                      color={user.emailVerified ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete User">
                      <IconButton
                        onClick={() => openDeleteDialog(user)}
                        disabled={currentUser && user._id === currentUser.id}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete user <strong>{deleteDialog.user?.name}</strong> ({deleteDialog.user?.email})?
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => deleteDialog.user && handleDeleteUser(deleteDialog.user._id)}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Summary */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Total Users: {users.length} {totalPages > 1 && `(Page ${page} of ${totalPages})`}
          </Typography>
        </Box>
      </Container>
    </AdminRoute>
  );
}