import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { MoreVertical, Edit, Trash2, ExternalLink, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

function ProductCard({ product, onAddToCart, showActions = false }) {
  const { updateProduct, deleteProduct } = useData()
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price
  })

  const handleStatusToggle = () => {
    const newStatus = product.status === 'active' ? 'draft' : 'active'
    updateProduct(product.id, { status: newStatus })
    toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(product.id)
      toast.success('Product deleted')
    }
  }

  const handleSaveEdit = () => {
    updateProduct(product.id, editForm)
    setIsEditing(false)
    toast.success('Product updated')
  }

  const statusColors = {
    active: 'bg-green-500',
    draft: 'bg-yellow-500'
  }

  return (
    <div className="card-dark rounded-xl overflow-hidden group">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[product.status]}`}>
            {product.status}
          </span>
        </div>
        {!showActions && (
          <div className="absolute top-3 right-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 bg-black bg-opacity-50 rounded-lg text-white hover:bg-opacity-70 transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-card border border-gray-700 rounded-lg py-1 min-w-[120px] z-10">
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setShowMenu(false)
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleStatusToggle}
                  className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-gray-700"
                >
                  {product.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            <input
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-accent-500 text-white rounded text-sm hover:bg-accent-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 border border-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-text-secondary text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">
                ${product.price}
              </span>
              {showActions ? (
                <button
                  onClick={onAddToCart}
                  className="inline-flex items-center px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  {product.xPostUrl && (
                    <a
                      href={product.xPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-text-secondary hover:text-white transition-colors"
                      title="View original post"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
            {product.category && (
              <div className="mt-3">
                <span className="inline-block px-2 py-1 bg-gray-700 text-xs text-text-secondary rounded">
                  {product.category}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductCard