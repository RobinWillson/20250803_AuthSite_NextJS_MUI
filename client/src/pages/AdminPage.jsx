import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';


const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user: currentUser } = useAuth(); // Token and current user from AuthContext

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }
      try {
        const data = await userService.getAllUsers(token);
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users. You may not have permission.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    setError(''); // Clear previous errors
    try {
      await userService.updateUserRole(userId, newRole, token);
      // Update the user's role in the local state for immediate UI feedback
      setUsers(users.map(u => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    // Prevent accidental deletion with a confirmation dialog
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setError(''); // Clear previous errors
      try {
        await userService.deleteUser(userId, token);
        setUsers(users.filter((u) => u._id !== userId)); // Update UI immediately
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: { error }</div>;
  }

  return (
    <div className="container p-4 mx-auto sm:p-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard - User Management</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Name</th>
              <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Email</th>
              <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Role</th>
              <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Provider</th>
              <th className="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            { users.map((user) => (
              <tr key={ user._id } className="hover:bg-gray-50">
                <td className="px-5 py-5 text-sm bg-transparent border-b border-gray-200">
                  <p className="text-gray-900 whitespace-no-wrap">{ user.name }</p>
                </td>
                <td className="px-5 py-5 text-sm bg-transparent border-b border-gray-200">
                  <p className="text-gray-900 whitespace-no-wrap">{ user.email }</p>
                </td>
                <td className="px-5 py-5 text-sm bg-transparent border-b border-gray-200">
                  { currentUser && user._id === currentUser._id ? (
                    // Admin cannot change their own role
                    <span className={ `relative inline-block px-3 py-1 font-semibold leading-tight text-green-900` }>
                      <span aria-hidden className={ `absolute inset-0 bg-green-200 rounded-full opacity-50` }></span>
                      <span className="relative">{ user.role }</span>
                    </span>
                  ) : (
                    <select
                      value={ user.role }
                      onChange={ (e) => handleRoleChange(user._id, e.target.value) }
                      className="block w-full p-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  ) }
                </td>
                <td className="px-5 py-5 text-sm bg-transparent border-b border-gray-200">
                  <p className="text-gray-900 whitespace-no-wrap">{ user.provider }</p>
                </td>
                <td className="px-5 py-5 text-sm bg-transparent border-b border-gray-200">
                  <button
                    onClick={ () => handleDeleteUser(user._id) }
                    disabled={ currentUser && user._id === currentUser._id }
                    className="px-3 py-1 font-semibold text-white bg-red-500 rounded-full hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;