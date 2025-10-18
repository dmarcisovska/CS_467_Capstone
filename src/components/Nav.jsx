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
import { NavLink } from 'react-router-dom';
import avatarImg from "../assets/denisa.jpeg"

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const pages = [
  { text: 'Home', to: '/' },
  { text: 'Events', to: '/events' },
  { text: 'Create Event', to: '/create' },
    { text: 'Login', to: '/login' },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

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

  // helper to style active links
  const linkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: isActive ? 700 : 500,
  });

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            component={NavLink}
            to="/"
            sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 1,
              color: 'inherit',
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

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Denisa" src={avatarImg} />
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
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
