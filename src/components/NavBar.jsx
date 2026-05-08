import { AppBar, Toolbar, Typography, Button, Box, Badge } from '@mui/material'
import { Notifications as NotificationsIcon, Star as StarIcon } from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'

export default function NavBar({ unreadCount = 0 }) {
  const { pathname } = useLocation()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(10,10,20,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(108,99,255,0.2)',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <NotificationsIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Typography variant="h6" sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}>
            CampusNotify
          </Typography>
        </Box>

        {/* Nav links */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            component={Link} to="/"
            variant={pathname === '/' ? 'contained' : 'text'}
            startIcon={
              <Badge badgeContent={unreadCount} color="secondary" max={99}>
                <NotificationsIcon />
              </Badge>
            }
            size="small"
            sx={{ borderRadius: 2 }}
          >
            All
          </Button>

          <Button
            component={Link} to="/priority"
            variant={pathname === '/priority' ? 'contained' : 'text'}
            startIcon={<StarIcon />}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Priority
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}