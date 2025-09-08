import React from 'react'
import ProductCard from './ProductCard'
import { Plus, Package } from 'lucide-react'

function ProductsGrid({ products }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Products</h2>
        <span className="text-text-secondary">
          {products.length} products
        </span>
      </div>
      
      {products.length === 0 ? (
        <div className="card-dark rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
          <p className="text-text-secondary mb-6">
            Analyze your X content to automatically generate products, or create them manually.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsGrid