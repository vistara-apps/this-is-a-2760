import React, { useState } from 'react'
import { X, Zap, TrendingUp, Eye } from 'lucide-react'

function ContentAnalyzer({ onClose, onAnalyze, loading }) {
  const [analysisStep, setAnalysisStep] = useState(0)

  const analysisSteps = [
    'Fetching your X posts...',
    'Analyzing engagement metrics...',
    'Identifying product mentions...',
    'Generating product suggestions...',
    'Creating product listings...'
  ]

  const handleStartAnalysis = () => {
    setAnalysisStep(1)
    onAnalyze()
  }

  const mockTweets = [
    {
      id: 1,
      text: "Just finished my comprehensive guide to AI writing - it's been a game changer for my content strategy! 🔥",
      engagement: 1250,
      suggested: true
    },
    {
      id: 2,
      text: "The content planning template I use has helped me grow from 1K to 50K followers in 6 months. Templates work!",
      engagement: 890,
      suggested: true
    },
    {
      id: 3,
      text: "Coffee break thoughts on building personal brands in 2024 ☕",
      engagement: 450,
      suggested: false
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">AI Content Analysis</h2>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!loading && analysisStep === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-accent-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Analyze Your X Content
                </h3>
                <p className="text-text-secondary">
                  Our AI will scan your recent tweets to identify potential products and services 
                  based on engagement and content themes.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-white">Recent High-Engagement Posts</h4>
                {mockTweets.map((tweet) => (
                  <div key={tweet.id} className="bg-gray-700 rounded-lg p-4">
                    <p className="text-white text-sm mb-2">{tweet.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-text-secondary">
                        <span className="flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {tweet.engagement} engagements
                        </span>
                      </div>
                      {tweet.suggested && (
                        <span className="px-2 py-1 bg-accent-500 text-white text-xs rounded-full">
                          Product Potential
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStartAnalysis}
                className="w-full py-3 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 transition-colors"
              >
                Start Analysis
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Analyzing Your Content
              </h3>
              <p className="text-text-secondary mb-4">
                {analysisSteps[Math.min(analysisStep - 1, analysisSteps.length - 1)]}
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-accent-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(analysisStep / analysisSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContentAnalyzer