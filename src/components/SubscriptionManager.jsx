import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { Crown, Check, X, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

function SubscriptionManager({ onClose }) {
  const { subscriptionStatus, upgradeSubscription, cancelSubscription } = useData()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedTier, setSelectedTier] = useState('pro')

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'forever',
      features: [
        'Up to 10 products',
        'Basic analytics',
        'Standard storefront',
        'Email support'
      ],
      limitations: [
        'Limited customization',
        'Basic AI analysis',
        'No priority support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 15,
      interval: 'month',
      popular: true,
      features: [
        'Unlimited products',
        'Advanced analytics',
        'Custom storefront design',
        'Priority support',
        'Advanced AI analysis',
        'Custom domain',
        'Export data'
      ],
      limitations: []
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      interval: 'month',
      features: [
        'Everything in Pro',
        'White-label solution',
        'Dedicated support',
        'Custom integrations',
        'Advanced API access',
        'Team collaboration',
        'SLA guarantee'
      ],
      limitations: []
    }
  ]

  const handleUpgrade = async (tier) => {
    if (tier === 'enterprise') {
      toast.success('Please contact us for Enterprise pricing')
      return
    }

    setLoading(true)
    try {
      await upgradeSubscription(tier)
      toast.success(`Successfully upgraded to ${tier} plan!`)
      onClose()
    } catch (error) {
      toast.error('Failed to upgrade subscription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) {
      return
    }

    setLoading(true)
    try {
      await cancelSubscription()
      toast.success('Subscription canceled successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to cancel subscription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Subscription Plans</h2>
              <p className="text-text-secondary mt-1">
                Choose the plan that's right for your business
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Current Plan Status */}
          {subscriptionStatus.status === 'active' && (
            <div className="mb-8 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-green-500" />
                <span className="text-green-500 font-medium">
                  Current Plan: {subscriptionStatus.tier.charAt(0).toUpperCase() + subscriptionStatus.tier.slice(1)}
                </span>
              </div>
              {subscriptionStatus.currentPeriodEnd && (
                <p className="text-sm text-green-400 mt-1">
                  Renews on {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl p-6 border-2 transition-all ${
                  plan.popular
                    ? 'border-accent-500 bg-accent-500 bg-opacity-10'
                    : 'border-gray-600 bg-gray-700 bg-opacity-50'
                } ${
                  subscriptionStatus.tier === plan.id
                    ? 'ring-2 ring-green-500'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {subscriptionStatus.tier === plan.id && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-white">
                    {typeof plan.price === 'number' ? (
                      <>
                        ${plan.price}
                        <span className="text-lg text-text-secondary">/{plan.interval}</span>
                      </>
                    ) : (
                      <span className="text-2xl">{plan.price}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-white text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <span className="text-text-secondary text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading || subscriptionStatus.tier === plan.id || plan.id === 'free'}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    subscriptionStatus.tier === plan.id
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : plan.id === 'free'
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-accent-500 text-white hover:bg-accent-600'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  {loading ? (
                    'Processing...'
                  ) : subscriptionStatus.tier === plan.id ? (
                    'Current Plan'
                  ) : plan.id === 'free' ? (
                    'Free Forever'
                  ) : plan.id === 'enterprise' ? (
                    'Contact Sales'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Cancel Subscription */}
          {subscriptionStatus.status === 'active' && subscriptionStatus.tier !== 'free' && (
            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Cancel Subscription</h3>
                  <p className="text-text-secondary text-sm">
                    You'll continue to have access until your current billing period ends.
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Canceling...' : 'Cancel Plan'}
                </button>
              </div>
            </div>
          )}

          {/* Payment Security Notice */}
          <div className="mt-6 p-4 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <span className="text-blue-500 font-medium">Secure Payment</span>
            </div>
            <p className="text-sm text-blue-400 mt-1">
              All payments are processed securely through Stripe. We never store your payment information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionManager
