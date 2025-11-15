// src/components/ResponsiveAppBar.jsx
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { NavLink, useNavigate } from 'react-router-dom';

const settings = ['Profile', 'Logout'];

const pages = [
  { text: 'Home', to: '/' },
  { text: 'Events', to: '/events' },
  { text: 'Create Event', to: '/create' },
];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Check if user is logged in by looking for user data in localStorage
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [avatarKey, setAvatarKey] = React.useState(Date.now()); // cache-bust key

  React.useEffect(() => {
    // Check localStorage for user on mount
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
        setAvatarKey(Date.now()); // refresh avatar src when user changes
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkUser();

    // Listen for storage changes (when user logs in/out)
    window.addEventListener('storage', checkUser);

    // Listen for custom event when login happens in same tab
    window.addEventListener('userLoggedIn', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userLoggedIn', checkUser);
    };
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuAction = (setting) => {
    handleCloseUserMenu();
    
    if (setting === 'Logout') {
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/login');
    } else if (setting === 'Profile') {
      navigate('/profile');
    }
    // Add other menu actions as needed
  };

  // helper to style active links
  const linkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: isActive ? 700 : 500,
  });

  return (
    <AppBar position="static" color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            component={NavLink}
            to="/"
            sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 1,
              color: 'primary.main',
            }}
          >
            <DirectionsRunIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component={NavLink}
            to="/"
            style={linkStyle}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          ></Typography>

          {/* Mobile menu button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.text}
                  component={NavLink}
                  to={page.to}
                  onClick={handleCloseNavMenu}
                  style={linkStyle}
                >
                  <Typography sx={{ textAlign: 'center' }}>
                    {page.text}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile logo */}
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={NavLink}
            to="/"
            style={linkStyle}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              letterSpacing: '.3rem',
              color: 'inherit',
            }}
          >
            LOGO
          </Typography>

          {/* Desktop links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.text}
                component={NavLink}
                to={page.to}
                onClick={handleCloseNavMenu}
                style={linkStyle}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.text}
              </Button>
            ))}
          </Box>

          {/* User section - Show Avatar if logged in, Login button if not */}
          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      alt={user?.username}
                      src={user?.avatar_url ? `${user.avatar_url}?t=${avatarKey}` : undefined}
                      sx={{
                        bgcolor: user?.avatar_url ? 'transparent' : 'primary.main',
                      }}
                    >
                      {!user?.avatar_url && user?.username?.[0]?.toLowerCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem 
                      key={setting} 
                      onClick={() => handleMenuAction(setting)}
                    >
                      <Typography sx={{ textAlign: 'center' }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                component={NavLink}
                to="/login"
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
