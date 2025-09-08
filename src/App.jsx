import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Storefront from './pages/Storefront'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/storefront/:userId" element={<Storefront />} />
          </Routes>
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

export default App