import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    primary: { main: '#00897B', dark: '#00695C', light: '#4DB6AC' },
    secondary: { main: '#1565C0' },
    background: { default: '#F0F4F8', paper: '#FFFFFF' },
    success: { main: '#2E7D32' },
    warning: { main: '#E65100' },
    error: { main: '#C62828' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Outfit", system-ui, sans-serif',
    h5: { fontWeight: 800, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 12 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 20 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
