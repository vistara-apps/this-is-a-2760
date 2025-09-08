// X (Twitter) API Service
import { xApi } from './api.js'

class XService {
  /**
   * Fetch user's recent tweets with engagement metrics
   * @param {string} userId - X user ID
   * @param {number} maxResults - Maximum number of tweets to fetch (default: 100)
   * @returns {Promise<Array>} Array of tweet objects with engagement data
   */
  async getUserTweets(userId, maxResults = 100) {
    try {
      const response = await xApi.get(`/users/${userId}/tweets`, {
        params: {
          'tweet.fields': 'public_metrics,created_at,context_annotations,entities',
          'user.fields': 'public_metrics',
          'max_results': Math.min(maxResults, 100), // API limit
          'exclude': 'retweets,replies'
        }
      })

      return response.data.data?.map(tweet => ({
        id: tweet.id,
        text: tweet.text,
        createdAt: tweet.created_at,
        metrics: {
          likes: tweet.public_metrics.like_count,
          retweets: tweet.public_metrics.retweet_count,
          replies: tweet.public_metrics.reply_count,
          quotes: tweet.public_metrics.quote_count,
          impressions: tweet.public_metrics.impression_count
        },
        entities: tweet.entities,
        contextAnnotations: tweet.context_annotations,
        engagementScore: this.calculateEngagementScore(tweet.public_metrics)
      })) || []
    } catch (error) {
      console.error('Error fetching user tweets:', error)
      // Return mock data for development/demo purposes
      return this.getMockTweets()
    }
  }

  /**
   * Get user's liked tweets to understand interests
   * @param {string} userId - X user ID
   * @param {number} maxResults - Maximum number of liked tweets to fetch
   * @returns {Promise<Array>} Array of liked tweet objects
   */
  async getUserLikedTweets(userId, maxResults = 50) {
    try {
      const response = await xApi.get(`/users/${userId}/liked_tweets`, {
        params: {
          'tweet.fields': 'public_metrics,created_at,context_annotations',
          'max_results': Math.min(maxResults, 100)
        }
      })

      return response.data.data?.map(tweet => ({
        id: tweet.id,
        text: tweet.text,
        createdAt: tweet.created_at,
        metrics: tweet.public_metrics,
        contextAnnotations: tweet.context_annotations
      })) || []
    } catch (error) {
      console.error('Error fetching liked tweets:', error)
      return []
    }
  }

  /**
   * Get user profile information
   * @param {string} username - X username (without @)
   * @returns {Promise<Object>} User profile object
   */
  async getUserByUsername(username) {
    try {
      const response = await xApi.get(`/users/by/username/${username}`, {
        params: {
          'user.fields': 'public_metrics,description,profile_image_url,verified'
        }
      })

      const user = response.data.data
      return {
        id: user.id,
        username: user.username,
        name: user.name,
        description: user.description,
        profileImageUrl: user.profile_image_url,
        verified: user.verified,
        metrics: {
          followers: user.public_metrics.followers_count,
          following: user.public_metrics.following_count,
          tweets: user.public_metrics.tweet_count,
          listed: user.public_metrics.listed_count
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Return mock user for development
      return this.getMockUser(username)
    }
  }

  /**
   * Calculate engagement score for a tweet
   * @param {Object} metrics - Tweet public metrics
   * @returns {number} Engagement score
   */
  calculateEngagementScore(metrics) {
    const { like_count, retweet_count, reply_count, quote_count, impression_count } = metrics
    
    // Weighted engagement score calculation
    const engagementActions = (like_count * 1) + (retweet_count * 3) + (reply_count * 2) + (quote_count * 4)
    const engagementRate = impression_count > 0 ? (engagementActions / impression_count) * 100 : 0
    
    return Math.round(engagementRate * 100) / 100 // Round to 2 decimal places
  }

  /**
   * Identify potential product mentions in tweets
   * @param {Array} tweets - Array of tweet objects
   * @returns {Array} Tweets with potential product mentions
   */
  identifyProductMentions(tweets) {
    const productKeywords = [
      'course', 'guide', 'template', 'ebook', 'book', 'consultation', 'coaching',
      'service', 'tool', 'software', 'app', 'product', 'launch', 'sale',
      'discount', 'offer', 'free', 'download', 'buy', 'purchase', 'price',
      'workshop', 'masterclass', 'training', 'tutorial', 'blueprint'
    ]

    return tweets.map(tweet => {
      const text = tweet.text.toLowerCase()
      const mentionedKeywords = productKeywords.filter(keyword => 
        text.includes(keyword)
      )

      return {
        ...tweet,
        productPotential: mentionedKeywords.length > 0,
        mentionedKeywords,
        productScore: this.calculateProductScore(tweet, mentionedKeywords)
      }
    }).filter(tweet => tweet.productPotential)
  }

  /**
   * Calculate product potential score
   * @param {Object} tweet - Tweet object
   * @param {Array} keywords - Mentioned product keywords
   * @returns {number} Product potential score (0-100)
   */
  calculateProductScore(tweet, keywords) {
    let score = 0
    
    // Base score from keywords
    score += keywords.length * 10
    
    // Engagement bonus
    if (tweet.engagementScore > 5) score += 20
    if (tweet.engagementScore > 10) score += 30
    
    // Metrics bonus
    if (tweet.metrics.likes > 100) score += 15
    if (tweet.metrics.retweets > 50) score += 15
    if (tweet.metrics.replies > 20) score += 10
    
    return Math.min(score, 100) // Cap at 100
  }

  /**
   * Mock data for development/demo purposes
   */
  getMockTweets() {
    return [
      {
        id: '1234567890',
        text: "Just finished my comprehensive AI writing course - it's been a game changer for my content strategy! 🔥 #AIWriting #ContentCreation",
        createdAt: '2024-01-15T10:30:00.000Z',
        metrics: {
          likes: 1250,
          retweets: 180,
          replies: 95,
          quotes: 45,
          impressions: 15000
        },
        engagementScore: 11.33,
        productPotential: true,
        mentionedKeywords: ['course'],
        productScore: 85
      },
      {
        id: '1234567891',
        text: "The content planning template I use has helped me grow from 1K to 50K followers in 6 months. Templates work! 📈",
        createdAt: '2024-01-14T14:20:00.000Z',
        metrics: {
          likes: 890,
          retweets: 120,
          replies: 67,
          quotes: 23,
          impressions: 12000
        },
        engagementScore: 9.17,
        productPotential: true,
        mentionedKeywords: ['template'],
        productScore: 75
      },
      {
        id: '1234567892',
        text: "Offering 1-on-1 consultations for content strategy this month. DM me if you're interested in growing your personal brand! 💪",
        createdAt: '2024-01-13T09:15:00.000Z',
        metrics: {
          likes: 650,
          retweets: 85,
          replies: 120,
          quotes: 15,
          impressions: 8500
        },
        engagementScore: 10.29,
        productPotential: true,
        mentionedKeywords: ['consultation', 'service'],
        productScore: 80
      }
    ]
  }

  getMockUser(username) {
    return {
      id: 'mock_user_123',
      username: username || 'johndoe',
      name: 'John Doe',
      description: 'Content creator & entrepreneur. Helping others build their online presence. 🚀',
      profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      verified: false,
      metrics: {
        followers: 25000,
        following: 1500,
        tweets: 3200,
        listed: 150
      }
    }
  }
}

export default new XService()
