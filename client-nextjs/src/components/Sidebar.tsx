'use client';

import {
  Popover,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import FunctionsIcon from '@mui/icons-material/Functions';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { User } from '@/types/auth';

const drawerWidth = 240;

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface ProfileSectionProps {
  user: User | null;
  logout: () => void;
  router: {
    push: (path: string) => void;
  };
}

function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const mainNavItems: NavItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    // Add other main navigation items here
  ];

  if (user?.isAdmin) {
    mainNavItems.push({ text: 'Admin Panel', icon: <AdminPanelSettingsIcon />, path: '/admin' });
  }

  const drawerContent = (
    <Box id="sidebar-container" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box id="sidebar-main-content" sx={{ overflow: 'auto', flexGrow: 1 }}>
        <List dense>
          {mainNavItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} href={item.path}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <List dense>
          {['Function1', 'Function2', 'Function3'].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <FunctionsIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <ProfileSection user={user} logout={logout} router={router} />
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative', // Override the default 'fixed' position
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

function ProfileSection({ user, logout, router }: ProfileSectionProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Box id="sidebar-footer" sx={{ position: 'relative' }}>
      <Divider />
      <List dense>
        <ListItem
          id="user-profile"
          sx={{ my: 0.5, cursor: 'pointer' }}
          onClick={handleClick}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Avatar src={user?.photo} sx={{ width: 32, height: 32 }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={user?.name || 'User'}
            secondary={user?.email}
            sx={{
              '& .MuiListItemText-primary': { fontSize: '0.8rem' },
              '& .MuiListItemText-secondary': { fontSize: '0.6rem' },
            }}
          />
        </ListItem>
      </List>

      <Popover
        id="profile-menu-popover"
        container={() => document.getElementById('sidebar-container')}
        sx={{
          '& .MuiPopover-paper': {
            width: drawerWidth - 20,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
          }
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handleClose}
      >
        <List dense>
          <ListItem id="edit-profile" disablePadding>
            <ListItemButton component={Link} href="/profile">
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Edit Profile"
                sx={{
                  '& .MuiListItemText-primary': { fontSize: '0.8rem' },
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem id="logout" disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Log out"
                sx={{
                  '& .MuiListItemText-primary': { fontSize: '0.8rem' },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </Box>
  );
}

export default Sidebar;