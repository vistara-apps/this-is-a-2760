// Supabase Database Service
import { supabaseApi } from './api.js'

class SupabaseService {
  /**
   * User Management
   */
  
  async createUser(userData) {
    try {
      const response = await supabaseApi.post('/users', userData)
      return response.data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async getUserById(userId) {
    try {
      const response = await supabaseApi.get(`/users?id=eq.${userId}`)
      return response.data[0]
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  async updateUser(userId, updates) {
    try {
      const response = await supabaseApi.patch(`/users?id=eq.${userId}`, updates)
      return response.data[0]
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  /**
   * Product Management
   */
  
  async createProduct(productData) {
    try {
      const response = await supabaseApi.post('/products', productData)
      return response.data[0]
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async getProductsByUserId(userId) {
    try {
      const response = await supabaseApi.get(`/products?userId=eq.${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  async updateProduct(productId, updates) {
    try {
      const response = await supabaseApi.patch(`/products?productId=eq.${productId}`, updates)
      return response.data[0]
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async deleteProduct(productId) {
    try {
      await supabaseApi.delete(`/products?productId=eq.${productId}`)
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  /**
   * Order Management
   */
  
  async createOrder(orderData) {
    try {
      const response = await supabaseApi.post('/orders', orderData)
      return response.data[0]
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  async getOrdersByUserId(userId) {
    try {
      const response = await supabaseApi.get(`/orders?userId=eq.${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await supabaseApi.patch(`/orders?orderId=eq.${orderId}`, { status })
      return response.data[0]
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }

  /**
   * X Post Analysis Management
   */
  
  async saveXPostAnalysis(analysisData) {
    try {
      const response = await supabaseApi.post('/xpostanalysis', analysisData)
      return response.data[0]
    } catch (error) {
      console.error('Error saving X post analysis:', error)
      throw error
    }
  }

  async getXPostAnalysisByUserId(userId) {
    try {
      const response = await supabaseApi.get(`/xpostanalysis?userId=eq.${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching X post analysis:', error)
      return []
    }
  }

  /**
   * Analytics and Reporting
   */
  
  async getUserAnalytics(userId) {
    try {
      // Get orders for revenue calculation
      const orders = await this.getOrdersByUserId(userId)
      const products = await this.getProductsByUserId(userId)
      
      const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.amount, 0)
      
      const totalOrders = orders.filter(order => order.status === 'completed').length
      
      // Calculate top product
      const productSales = orders.reduce((acc, order) => {
        acc[order.productId] = (acc[order.productId] || 0) + 1
        return acc
      }, {})
      
      const topProductId = Object.keys(productSales).reduce((a, b) => 
        productSales[a] > productSales[b] ? a : b, null
      )
      
      const topProduct = topProductId ? products.find(p => p.productId === topProductId) : null
      
      // Calculate conversion rate (mock calculation)
      const conversionRate = totalOrders > 0 ? (totalOrders / (totalOrders * 30)) * 100 : 0
      
      return {
        totalRevenue,
        totalOrders,
        conversionRate: Math.round(conversionRate * 100) / 100,
        topProduct,
        recentOrders: orders.slice(-5).reverse()
      }
    } catch (error) {
      console.error('Error calculating analytics:', error)
      return {
        totalRevenue: 0,
        totalOrders: 0,
        conversionRate: 0,
        topProduct: null,
        recentOrders: []
      }
    }
  }

  /**
   * Database Schema Creation (for initial setup)
   */
  
  async createTables() {
    const tables = [
      // Users table
      `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        xHandle TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        avatar TEXT,
        storefrontUrl TEXT UNIQUE,
        subscriptionTier TEXT DEFAULT 'free',
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      );
      `,
      
      // Products table
      `
      CREATE TABLE IF NOT EXISTS products (
        productId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        userId UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        imageUrl TEXT,
        xPostUrl TEXT,
        status TEXT DEFAULT 'draft',
        category TEXT,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      );
      `,
      
      // Orders table
      `
      CREATE TABLE IF NOT EXISTS orders (
        orderId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        productId UUID REFERENCES products(productId) ON DELETE CASCADE,
        userId UUID REFERENCES users(id) ON DELETE CASCADE,
        paymentIntentId TEXT,
        amount DECIMAL(10,2) NOT NULL,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'pending',
        customerEmail TEXT,
        createdAt TIMESTAMP DEFAULT NOW()
      );
      `,
      
      // X Post Analysis table
      `
      CREATE TABLE IF NOT EXISTS xpostanalysis (
        analysisId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        userId UUID REFERENCES users(id) ON DELETE CASCADE,
        postId TEXT NOT NULL,
        tweetText TEXT,
        engagementMetrics JSONB,
        identifiedProducts JSONB,
        createdAt TIMESTAMP DEFAULT NOW()
      );
      `
    ]

    try {
      for (const table of tables) {
        await supabaseApi.post('/rpc/exec_sql', { sql: table })
      }
      console.log('Database tables created successfully')
    } catch (error) {
      console.error('Error creating database tables:', error)
    }
  }

  /**
   * Real-time subscriptions (for live updates)
   */
  
  subscribeToOrders(userId, callback) {
    // This would use Supabase real-time subscriptions
    // For now, we'll simulate with polling
    const interval = setInterval(async () => {
      try {
        const orders = await this.getOrdersByUserId(userId)
        callback(orders)
      } catch (error) {
        console.error('Error in order subscription:', error)
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }

  subscribeToProducts(userId, callback) {
    const interval = setInterval(async () => {
      try {
        const products = await this.getProductsByUserId(userId)
        callback(products)
      } catch (error) {
        console.error('Error in product subscription:', error)
      }
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(interval)
  }

  /**
   * Batch operations for better performance
   */
  
  async batchCreateProducts(products) {
    try {
      const response = await supabaseApi.post('/products', products)
      return response.data
    } catch (error) {
      console.error('Error batch creating products:', error)
      throw error
    }
  }

  async batchUpdateProducts(updates) {
    try {
      const promises = updates.map(update => 
        this.updateProduct(update.productId, update.data)
      )
      return await Promise.all(promises)
    } catch (error) {
      console.error('Error batch updating products:', error)
      throw error
    }
  }

  /**
   * Search and filtering
   */
  
  async searchProducts(query, filters = {}) {
    try {
      let url = '/products?'
      
      if (query) {
        url += `name.ilike.*${query}*&`
      }
      
      if (filters.category) {
        url += `category=eq.${filters.category}&`
      }
      
      if (filters.status) {
        url += `status=eq.${filters.status}&`
      }
      
      if (filters.minPrice) {
        url += `price=gte.${filters.minPrice}&`
      }
      
      if (filters.maxPrice) {
        url += `price=lte.${filters.maxPrice}&`
      }

      const response = await supabaseApi.get(url)
      return response.data
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  }
}

export default new SupabaseService()
