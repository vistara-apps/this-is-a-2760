import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import xService from '../services/xService'
import openaiService from '../services/openaiService'
import stripeService from '../services/stripeService'
import supabaseService from '../services/supabaseService'

const DataContext = createContext()

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    conversionRate: 0,
    topProduct: null
  })
  const [loading, setLoading] = useState(false)
  const [contentAnalysis, setContentAnalysis] = useState(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState({ tier: 'free', status: 'inactive' })

  // Mock data initialization
  useEffect(() => {
    if (user) {
      initializeMockData()
    }
  }, [user])

  const initializeMockData = () => {
    const mockProducts = [
      {
        id: 'prod_1',
        name: 'AI Writing Course',
        description: 'Master AI-powered content creation with proven strategies and tools.',
        price: 97,
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
        xPostUrl: 'https://x.com/johndoe/status/123',
        status: 'active',
        category: 'Digital Course'
      },
      {
        id: 'prod_2',
        name: 'Content Strategy Template',
        description: 'Complete template pack for planning viral content across all platforms.',
        price: 29,
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        xPostUrl: 'https://x.com/johndoe/status/124',
        status: 'active',
        category: 'Template'
      },
      {
        id: 'prod_3',
        name: '1-on-1 Consultation',
        description: 'Personal consultation to optimize your content strategy and growth.',
        price: 150,
        imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
        xPostUrl: 'https://x.com/johndoe/status/125',
        status: 'active',
        category: 'Service'
      },
      {
        id: 'prod_4',
        name: 'Growth Hacking Toolkit',
        description: 'Essential tools and scripts for automating your social media growth.',
        price: 67,
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        xPostUrl: 'https://x.com/johndoe/status/126',
        status: 'active',
        category: 'Digital Product'
      }
    ]

    const mockOrders = [
      {
        id: 'order_1',
        productId: 'prod_1',
        amount: 97,
        currency: 'USD',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        customerEmail: 'customer1@example.com'
      },
      {
        id: 'order_2',
        productId: 'prod_2',
        amount: 29,
        currency: 'USD',
        status: 'completed',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        customerEmail: 'customer2@example.com'
      },
      {
        id: 'order_3',
        productId: 'prod_1',
        amount: 97,
        currency: 'USD',
        status: 'completed',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        customerEmail: 'customer3@example.com'
      }
    ]

    setProducts(mockProducts)
    setOrders(mockOrders)
    
    // Calculate analytics
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.amount, 0)
    const totalOrders = mockOrders.length
    const productSales = mockOrders.reduce((acc, order) => {
      acc[order.productId] = (acc[order.productId] || 0) + 1
      return acc
    }, {})
    const topProductId = Object.keys(productSales).reduce((a, b) => 
      productSales[a] > productSales[b] ? a : b
    )
    const topProduct = mockProducts.find(p => p.id === topProductId)

    setAnalytics({
      totalRevenue,
      totalOrders,
      conversionRate: 3.2,
      topProduct
    })
  }

  const analyzeXContent = async () => {
    setLoading(true)
    try {
      if (!user?.xHandle) {
        throw new Error('X handle not found')
      }

      // Step 1: Get user profile and tweets
      const userProfile = await xService.getUserByUsername(user.xHandle.replace('@', ''))
      const tweets = await xService.getUserTweets(userProfile.id)
      
      // Step 2: Identify product mentions
      const productMentions = xService.identifyProductMentions(tweets)
      
      // Step 3: Analyze content with AI
      const productSuggestions = await openaiService.analyzeContentForProducts(productMentions, userProfile)
      
      // Step 4: Generate enhanced product content
      const enhancedProducts = await Promise.all(
        productSuggestions.slice(0, 3).map(async (suggestion) => {
          const enhancedContent = await openaiService.generateProductContent(suggestion)
          const imageUrl = await openaiService.generateProductImage(suggestion)
          
          return {
            id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: enhancedContent.name,
            description: enhancedContent.description,
            price: enhancedContent.suggestedPrice,
            imageUrl: imageUrl,
            xPostUrl: productMentions[0]?.id ? `https://x.com/${userProfile.username}/status/${productMentions[0].id}` : '',
            status: 'draft',
            category: enhancedContent.category,
            benefits: enhancedContent.benefits,
            tagline: enhancedContent.tagline,
            keywords: enhancedContent.keywords,
            aiGenerated: true,
            createdAt: new Date().toISOString()
          }
        })
      )
      
      // Step 5: Save analysis to database (if available)
      try {
        await supabaseService.saveXPostAnalysis({
          userId: user.id,
          postId: productMentions[0]?.id || 'analysis_' + Date.now(),
          tweetText: productMentions.map(t => t.text).join('\n\n'),
          engagementMetrics: productMentions.map(t => t.metrics),
          identifiedProducts: enhancedProducts
        })
      } catch (dbError) {
        console.warn('Could not save to database, using local storage:', dbError)
      }
      
      // Step 6: Update local state
      setProducts(prev => [...prev, ...enhancedProducts])
      setContentAnalysis({
        userProfile,
        tweets: productMentions,
        suggestions: productSuggestions,
        analyzedAt: new Date().toISOString()
      })
      
      return enhancedProducts[0] // Return first product for UI feedback
    } catch (error) {
      console.error('Content analysis error:', error)
      
      // Fallback to mock data if real analysis fails
      const mockProduct = {
        id: `prod_${Date.now()}`,
        name: 'AI-Generated Product Idea',
        description: 'Based on your content analysis, this product could be a great fit for your audience.',
        price: 47,
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
        xPostUrl: 'https://x.com/johndoe/status/127',
        status: 'draft',
        category: 'Digital Product',
        aiGenerated: true,
        createdAt: new Date().toISOString()
      }
      
      setProducts(prev => [...prev, mockProduct])
      return mockProduct
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = (productId, updates) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, ...updates } : p
    ))
  }

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  const createOrder = async (productId, paymentData) => {
    const product = products.find(p => p.id === productId)
    if (!product) throw new Error('Product not found')

    try {
      // Step 1: Create payment intent with Stripe
      const paymentIntent = await stripeService.createPaymentIntent(product, paymentData)
      
      // Step 2: Create order in database
      const orderData = {
        productId,
        userId: user.id,
        amount: product.price,
        currency: 'USD',
        status: 'pending',
        customerEmail: paymentData.email,
        paymentIntentId: paymentIntent.id,
        createdAt: new Date().toISOString()
      }

      let newOrder
      try {
        // Try to save to database first
        newOrder = await supabaseService.createOrder(orderData)
      } catch (dbError) {
        console.warn('Could not save to database, using local storage:', dbError)
        // Fallback to local state
        newOrder = {
          id: `order_${Date.now()}`,
          ...orderData
        }
      }

      // Step 3: Process payment (in real app, this would be handled by webhook)
      // For demo purposes, we'll simulate successful payment
      if (paymentIntent.status === 'requires_payment_method' || paymentIntent.id.includes('mock')) {
        // Simulate successful payment
        newOrder.status = 'completed'
        newOrder.paymentIntentId = paymentIntent.id
        
        // Update order status in database
        try {
          await supabaseService.updateOrderStatus(newOrder.id, 'completed')
        } catch (dbError) {
          console.warn('Could not update order in database:', dbError)
        }
      }

      // Step 4: Update local state
      setOrders(prev => [...prev, newOrder])
      
      // Step 5: Update analytics
      if (newOrder.status === 'completed') {
        const newTotalRevenue = analytics.totalRevenue + product.price
        const newTotalOrders = analytics.totalOrders + 1
        
        setAnalytics(prev => ({
          ...prev,
          totalRevenue: newTotalRevenue,
          totalOrders: newTotalOrders
        }))
      }

      return newOrder
    } catch (error) {
      console.error('Error creating order:', error)
      
      // Fallback to simple order creation
      const fallbackOrder = {
        id: `order_${Date.now()}`,
        productId,
        amount: product.price,
        currency: 'USD',
        status: 'completed',
        createdAt: new Date().toISOString(),
        customerEmail: paymentData.email,
        paymentIntentId: `pi_fallback_${Date.now()}`
      }

      setOrders(prev => [...prev, fallbackOrder])
      
      const newTotalRevenue = analytics.totalRevenue + product.price
      const newTotalOrders = analytics.totalOrders + 1
      
      setAnalytics(prev => ({
        ...prev,
        totalRevenue: newTotalRevenue,
        totalOrders: newTotalOrders
      }))

      return fallbackOrder
    }
  }

  // Subscription management
  const upgradeSubscription = async (tier = 'pro') => {
    try {
      const subscription = await stripeService.createSubscription(
        { email: user.email },
        tier === 'pro' ? 'price_pro_monthly' : 'price_enterprise_monthly'
      )
      
      setSubscriptionStatus({
        tier: tier,
        status: 'active',
        subscriptionId: subscription.id,
        currentPeriodEnd: subscription.current_period_end
      })
      
      return subscription
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      throw error
    }
  }

  const cancelSubscription = async () => {
    try {
      if (subscriptionStatus.subscriptionId) {
        await stripeService.cancelSubscription(subscriptionStatus.subscriptionId)
        setSubscriptionStatus({ tier: 'free', status: 'inactive' })
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }

  // Enhanced product management
  const generateProductWithAI = async (productIdea) => {
    setLoading(true)
    try {
      const enhancedContent = await openaiService.generateProductContent(productIdea)
      const imageUrl = await openaiService.generateProductImage(productIdea)
      
      const newProduct = {
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...enhancedContent,
        imageUrl,
        status: 'draft',
        aiGenerated: true,
        createdAt: new Date().toISOString()
      }
      
      setProducts(prev => [...prev, newProduct])
      return newProduct
    } catch (error) {
      console.error('Error generating product with AI:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    products,
    orders,
    analytics,
    loading,
    contentAnalysis,
    subscriptionStatus,
    analyzeXContent,
    updateProduct,
    deleteProduct,
    createOrder,
    upgradeSubscription,
    cancelSubscription,
    generateProductWithAI
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
