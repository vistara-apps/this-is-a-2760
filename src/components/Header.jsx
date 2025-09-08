import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, User, Sparkles } from 'lucide-react'

function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b border-gray-800 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">X Creatify</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-white">{user?.name}</span>
              <span className="text-xs bg-accent-500 text-white px-2 py-1 rounded-full">
                {user?.subscriptionTier}
              </span>
            </div>
            
            <button
              onClick={signOut}
              className="p-2 text-text-secondary hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header