import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import ProductCard from '../components/ProductCard'
import { ShoppingCart, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

function Storefront() {
  const { userId } = useParams()
  const { products, createOrder } = useData()
  const [cart, setCart] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)

  const activeProducts = products.filter(p => p.status === 'active')

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast.success('Added to cart!')
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return

    try {
      // Simulate checkout process
      for (const item of cart) {
        await createOrder(item.id, {
          email: 'customer@example.com',
          quantity: item.quantity
        })
      }
      
      setCart([])
      setShowCheckout(false)
      toast.success('Order completed successfully!')
    } catch (error) {
      toast.error('Checkout failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-800 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
                alt="Creator"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h1 className="text-xl font-bold text-white">John's Store</h1>
                <p className="text-sm text-text-secondary">@johndoe</p>
              </div>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="relative inline-flex items-center px-4 py-2 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart ({cart.length})
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Premium Digital Products & Services
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Curated collection of tools, courses, and services to help you grow your online presence.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
                showActions={true}
              />
            ))}
          </div>
          
          {activeProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No products available</h3>
              <p className="text-text-secondary">Check back soon for new products!</p>
            </div>
          )}
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">Shopping Cart</h3>
            
            {cart.length === 0 ? (
              <p className="text-text-secondary mb-6">Your cart is empty</p>
            ) : (
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <p className="text-sm text-text-secondary">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total:</span>
                    <span>${getTotalPrice()}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Continue Shopping
              </button>
              {cart.length > 0 && (
                <button
                  onClick={handleCheckout}
                  className="flex-1 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
                >
                  Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Storefront