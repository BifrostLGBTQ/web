import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext.tsx'
import { ToolbarContext } from './contexts/ToolbarContext.tsx'
import { SettingsContext } from './contexts/SettingsContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsContext>
    <ToolbarContext>
    <ThemeProvider>
      <AppProvider>
      <AuthProvider>
        
        <App />
      </AuthProvider>
      </AppProvider>
    </ThemeProvider>
    </ToolbarContext>
    </SettingsContext>
  </React.StrictMode>
)
