import { useState } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

const drawerWidth = 260;
const collapsedDrawerWidth = 70;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Roles', icon: <SecurityIcon />, path: '/roles' },
  { text: 'Businesses', icon: <BusinessIcon />, path: '/businesses' },
];

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapse = () => {
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 1, sm: 2 },
          minHeight: { xs: '56px', sm: '64px' } + ' !important',
        }}
      >
        {!isDrawerCollapsed && (
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              color: 'primary.main',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Super Admin
          </Typography>
        )}
        <IconButton 
          onClick={handleDrawerCollapse}
          sx={{
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
            },
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          {isDrawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, px: { xs: 0.5, sm: 1 } }}>
        {menuItems.map((item) => (
          <Tooltip
            key={item.text}
            title={isDrawerCollapsed ? item.text : ''}
            placement="right"
          >
            <ListItem
              component={NavLink}
              to={item.path}
              button
              onClick={() => {
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                minHeight: { xs: 40, sm: 48 },
                justifyContent: isDrawerCollapsed ? 'center' : 'initial',
                px: { xs: 1, sm: 2 },
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
                '&.active': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isDrawerCollapsed ? 'auto' : { xs: 1, sm: 2 },
                  justifyContent: 'center',
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isDrawerCollapsed && (
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>
      <Divider />
      <List sx={{ px: { xs: 0.5, sm: 1 } }}>
        <Tooltip title={isDrawerCollapsed ? 'Logout' : ''} placement="right" arrow>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              minHeight: { xs: 40, sm: 48 },
              justifyContent: isDrawerCollapsed ? 'center' : 'initial',
              px: { xs: 1, sm: 2 },
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                '& .MuiListItemIcon-root': {
                  color: 'error.main',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isDrawerCollapsed ? 'auto' : { xs: 1, sm: 2 },
                justifyContent: 'center',
                transition: 'color 0.2s ease-in-out',
                cursor: 'pointer',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!isDrawerCollapsed && (
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{
                  color: 'error.main',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              />
            )}
          </ListItem>
        </Tooltip>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: {
            sm: `calc(100% - ${isDrawerCollapsed ? collapsedDrawerWidth : drawerWidth}px)`,
          },
          ml: { sm: `${isDrawerCollapsed ? collapsedDrawerWidth : drawerWidth}px` },
          transition: 'width 0.3s ease-in-out, margin 0.3s ease-in-out',
          backgroundColor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: isDrawerCollapsed ? collapsedDrawerWidth : drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: isDrawerCollapsed ? collapsedDrawerWidth : drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              transition: 'width 0.3s ease-in-out',
              overflowX: 'hidden',
              backgroundColor: 'background.paper',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: {
            sm: `calc(100% - ${isDrawerCollapsed ? collapsedDrawerWidth : drawerWidth}px)`,
          },
          marginLeft: 0,
          mt: { xs: '56px', sm: '64px' },
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;

