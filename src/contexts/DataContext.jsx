import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

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
      // Simulate AI analysis of X content
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // This would normally call OpenAI API to analyze tweets
      const newProduct = {
        id: `prod_${Date.now()}`,
        name: 'Social Media Mastery Guide',
        description: 'Complete guide to building a massive social media following.',
        price: 47,
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
        xPostUrl: 'https://x.com/johndoe/status/127',
        status: 'draft',
        category: 'eBook'
      }
      
      setProducts(prev => [...prev, newProduct])
      return newProduct
    } catch (error) {
      console.error('Content analysis error:', error)
      throw error
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

    const newOrder = {
      id: `order_${Date.now()}`,
      productId,
      amount: product.price,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date().toISOString(),
      customerEmail: paymentData.email,
      paymentIntentId: `pi_${Date.now()}`
    }

    setOrders(prev => [...prev, newOrder])
    
    // Update analytics
    const newTotalRevenue = analytics.totalRevenue + product.price
    const newTotalOrders = analytics.totalOrders + 1
    
    setAnalytics(prev => ({
      ...prev,
      totalRevenue: newTotalRevenue,
      totalOrders: newTotalOrders
    }))

    return newOrder
  }

  const value = {
    products,
    orders,
    analytics,
    loading,
    analyzeXContent,
    updateProduct,
    deleteProduct,
    createOrder
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}