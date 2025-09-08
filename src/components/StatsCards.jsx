import React from 'react'
import { DollarSign, ShoppingBag, TrendingUp, Award } from 'lucide-react'

function StatsCards({ analytics }) {
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders.toString(),
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'text-blue-500'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-purple-500'
    },
    {
      title: 'Top Product',
      value: analytics.topProduct?.name || 'N/A',
      change: analytics.topProduct ? `$${analytics.topProduct.price}` : '',
      icon: Award,
      color: 'text-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="card-dark rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 ${stat.color.replace('text-', 'bg-').replace('500', '500/20')} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            {stat.change && (
              <span className={`text-sm font-medium ${stat.color}`}>
                {stat.change}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
          <p className="text-text-secondary text-sm">{stat.title}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsCards