import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import Header from '../components/Header'
import StatsCards from '../components/StatsCards'
import ProductsGrid from '../components/ProductsGrid'
import AnalyticsChart from '../components/AnalyticsChart'
import ContentAnalyzer from '../components/ContentAnalyzer'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

function Dashboard() {
  const { user } = useAuth()
  const { products, analytics, analyzeXContent, loading } = useData()
  const [showAnalyzer, setShowAnalyzer] = useState(false)

  const handleAnalyzeContent = async () => {
    try {
      const newProduct = await analyzeXContent()
      toast.success(`Found new product: ${newProduct.name}`)
      setShowAnalyzer(false)
    } catch (error) {
      toast.error('Failed to analyze content')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'Creator'}!
          </h1>
          <p className="text-text-secondary">
            Here's how your storefront is performing today.
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards analytics={analytics} />

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowAnalyzer(true)}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              {loading ? 'Analyzing...' : 'Analyze X Content'}
            </button>
            <a
              href={`/storefront/${user?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-card border border-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              View Storefront
            </a>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AnalyticsChart />
          </div>
          <div className="card-dark rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">New order received</p>
                  <p className="text-xs text-text-secondary">2 minutes ago</p>
                </div>
                <span className="text-sm font-medium text-green-500">+$97</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Product view increased</p>
                  <p className="text-xs text-text-secondary">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">New product added</p>
                  <p className="text-xs text-text-secondary">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <ProductsGrid products={products} />

        {/* Content Analyzer Modal */}
        {showAnalyzer && (
          <ContentAnalyzer
            onClose={() => setShowAnalyzer(false)}
            onAnalyze={handleAnalyzeContent}
            loading={loading}
          />
        )}
      </main>
    </div>
  )
}

export default Dashboard