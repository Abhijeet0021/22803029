import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import App from './App'
import NavBar from './components/NavBar'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#6C63FF' },
    secondary:  { main: '#FF6584' },
    background: { default: '#0A0A14', paper: '#12121F' },
    text:       { primary: '#F0F0FF', secondary: '#9090B0' },
    success:    { main: '#22C55E' },
    warning:    { main: '#F59E0B' },
    info:       { main: '#38BDF8' },
  },
  typography: {
    fontFamily: '"DM Sans", "Segoe UI", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none', border: '1px solid rgba(108,99,255,0.15)' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, letterSpacing: '0.02em' },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar unreadCount={0} /> {/* 2. Add this right here */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)