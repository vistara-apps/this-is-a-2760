import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, Zap, TrendingUp, DollarSign, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

function Landing() {
  const navigate = useNavigate()
  const { user, signInWithX } = useAuth()

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleGetStarted = async () => {
    try {
      await signInWithX()
      toast.success('Welcome to X Creatify!')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to sign in. Please try again.')
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">X Creatify</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-6 py-2 bg-white text-background rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Turn your X content into a
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              storefront, effortlessly
            </span>
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            X Creatify analyzes your X presence to automatically generate and deploy 
            a functional storefront, monetizing your best content with AI-powered insights.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-8 py-4 bg-accent-500 text-white rounded-lg font-semibold text-lg hover:bg-accent-600 transform hover:scale-105 transition-all shadow-glow"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">
            Everything you need to monetize your content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-effect rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Content Analysis</h3>
              <p className="text-purple-200">
                Automatically identify your top-performing tweets and extract potential 
                products and services from your content.
              </p>
            </div>
            <div className="glass-effect rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Automated Storefront</h3>
              <p className="text-purple-200">
                Generate a professional, mobile-friendly storefront in minutes with 
                AI-generated descriptions and pricing suggestions.
              </p>
            </div>
            <div className="glass-effect rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Integrated Payments</h3>
              <p className="text-purple-200">
                Start selling immediately with built-in payment processing and 
                performance analytics to track your success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to turn your X content into revenue?
            </h2>
            <p className="text-purple-200 mb-8 text-lg">
              Join thousands of creators who are already monetizing their content with X Creatify.
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-4 bg-accent-500 text-white rounded-lg font-semibold text-lg hover:bg-accent-600 transform hover:scale-105 transition-all shadow-glow"
            >
              Start for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing