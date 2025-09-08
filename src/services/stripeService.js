// Stripe Payment Service
import { API_CONFIG } from './api.js'

class StripeService {
  constructor() {
    this.stripe = null
    this.initializeStripe()
  }

  async initializeStripe() {
    if (typeof window !== 'undefined') {
      // Load Stripe.js dynamically
      const { loadStripe } = await import('@stripe/stripe-js')
      this.stripe = await loadStripe(API_CONFIG.STRIPE_PUBLISHABLE_KEY)
    }
  }

  /**
   * Create a payment intent for a product purchase
   * @param {Object} product - Product information
   * @param {Object} customerInfo - Customer information
   * @returns {Promise<Object>} Payment intent details
   */
  async createPaymentIntent(product, customerInfo) {
    try {
      // In a real app, this would call your backend API
      // which would then call Stripe's API to create the payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          amount: product.price * 100, // Convert to cents
          currency: 'usd',
          customerEmail: customerInfo.email,
          productName: product.name
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating payment intent:', error)
      // Return mock payment intent for development
      return this.getMockPaymentIntent(product)
    }
  }

  /**
   * Process payment using Stripe Checkout
   * @param {Array} items - Cart items
   * @param {Object} customerInfo - Customer information
   * @returns {Promise<Object>} Checkout session
   */
  async createCheckoutSession(items, customerInfo) {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          })),
          customerEmail: customerInfo.email,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/cancel`
        })
      })

      const session = await response.json()
      
      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return session
    } catch (error) {
      console.error('Error creating checkout session:', error)
      // Simulate successful checkout for development
      return this.simulateCheckout(items, customerInfo)
    }
  }

  /**
   * Confirm payment with payment method
   * @param {string} paymentIntentId - Payment intent ID
   * @param {Object} paymentMethod - Payment method details
   * @returns {Promise<Object>} Payment confirmation
   */
  async confirmPayment(paymentIntentId, paymentMethod) {
    try {
      if (!this.stripe) {
        await this.initializeStripe()
      }

      const result = await this.stripe.confirmCardPayment(paymentIntentId, {
        payment_method: paymentMethod
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.paymentIntent
    } catch (error) {
      console.error('Error confirming payment:', error)
      throw error
    }
  }

  /**
   * Create a subscription for premium features
   * @param {Object} customerInfo - Customer information
   * @param {string} priceId - Stripe price ID for subscription
   * @returns {Promise<Object>} Subscription details
   */
  async createSubscription(customerInfo, priceId) {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: customerInfo.email,
          priceId: priceId
        })
      })

      return await response.json()
    } catch (error) {
      console.error('Error creating subscription:', error)
      return this.getMockSubscription()
    }
  }

  /**
   * Get customer's subscription status
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<Object>} Subscription status
   */
  async getSubscriptionStatus(customerId) {
    try {
      const response = await fetch(`/api/subscription-status/${customerId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching subscription status:', error)
      return { status: 'inactive', tier: 'free' }
    }
  }

  /**
   * Cancel subscription
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
        method: 'POST'
      })
      return await response.json()
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }

  /**
   * Mock payment intent for development
   */
  getMockPaymentIntent(product) {
    return {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret`,
      amount: product.price * 100,
      currency: 'usd',
      status: 'requires_payment_method'
    }
  }

  /**
   * Simulate checkout for development
   */
  async simulateCheckout(items, customerInfo) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return {
      id: `cs_mock_${Date.now()}`,
      success: true,
      paymentIntent: {
        id: `pi_mock_${Date.now()}`,
        status: 'succeeded',
        amount: items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) * 100
      }
    }
  }

  /**
   * Mock subscription for development
   */
  getMockSubscription() {
    return {
      id: `sub_mock_${Date.now()}`,
      status: 'active',
      current_period_end: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
      plan: {
        id: 'price_pro_monthly',
        nickname: 'Pro Plan',
        amount: 1500, // $15.00
        currency: 'usd',
        interval: 'month'
      }
    }
  }

  /**
   * Format price for display
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code
   * @returns {string} Formatted price
   */
  formatPrice(amount, currency = 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  /**
   * Validate card number using Luhn algorithm
   * @param {string} cardNumber - Card number
   * @returns {boolean} Is valid
   */
  validateCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '')
    if (!/^\d+$/.test(cleanNumber)) return false
    
    let sum = 0
    let isEven = false
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i])
      
      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  }
}

export default new StripeService()
