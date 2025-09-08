// OpenAI API Service for AI-powered content analysis and product generation
import { openaiApi } from './api.js'

class OpenAIService {
  /**
   * Analyze tweets to extract product opportunities
   * @param {Array} tweets - Array of tweet objects
   * @param {Object} userProfile - User profile information
   * @returns {Promise<Array>} Array of suggested products
   */
  async analyzeContentForProducts(tweets, userProfile) {
    try {
      const tweetTexts = tweets.map(tweet => tweet.text).join('\n\n')
      
      const prompt = `
        Analyze the following tweets from a content creator and suggest potential digital products or services they could create and sell based on their content themes, expertise, and audience engagement.

        Creator Profile:
        - Name: ${userProfile.name}
        - Bio: ${userProfile.description}
        - Followers: ${userProfile.metrics?.followers || 'N/A'}
        - Engagement Level: ${this.calculateAverageEngagement(tweets)}

        Recent High-Engagement Tweets:
        ${tweetTexts}

        Please suggest 3-5 potential products/services with the following format for each:
        {
          "name": "Product Name",
          "description": "Detailed description (2-3 sentences)",
          "category": "Course|Template|eBook|Service|Tool|Consultation",
          "suggestedPrice": number,
          "reasoning": "Why this product makes sense based on the content",
          "targetAudience": "Who would buy this",
          "keyFeatures": ["feature1", "feature2", "feature3"]
        }

        Focus on products that:
        1. Align with the creator's demonstrated expertise
        2. Address problems mentioned in their content
        3. Have clear market demand based on engagement
        4. Are feasible for a solo creator to produce

        Return only valid JSON array.
      `

      const response = await openaiApi.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert product strategist and content analyst. Analyze social media content to suggest profitable digital products. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const content = response.data.choices[0].message.content
      return JSON.parse(content)
    } catch (error) {
      console.error('Error analyzing content with OpenAI:', error)
      // Return mock suggestions for development
      return this.getMockProductSuggestions()
    }
  }

  /**
   * Generate product description using AI
   * @param {Object} productIdea - Basic product information
   * @returns {Promise<Object>} Enhanced product with AI-generated content
   */
  async generateProductContent(productIdea) {
    try {
      const prompt = `
        Create compelling marketing content for this digital product:

        Product: ${productIdea.name}
        Category: ${productIdea.category}
        Target Audience: ${productIdea.targetAudience}
        Key Features: ${productIdea.keyFeatures?.join(', ')}

        Generate:
        1. A compelling product description (2-3 paragraphs)
        2. Key benefits (5-7 bullet points)
        3. A catchy tagline
        4. Suggested keywords for SEO

        Format as JSON:
        {
          "description": "Full product description",
          "benefits": ["benefit1", "benefit2", ...],
          "tagline": "Catchy tagline",
          "keywords": ["keyword1", "keyword2", ...]
        }
      `

      const response = await openaiApi.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert copywriter specializing in digital product marketing. Create compelling, conversion-focused content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })

      const content = response.data.choices[0].message.content
      const generatedContent = JSON.parse(content)

      return {
        ...productIdea,
        ...generatedContent,
        aiGenerated: true
      }
    } catch (error) {
      console.error('Error generating product content:', error)
      return productIdea
    }
  }

  /**
   * Generate product image using DALL-E
   * @param {Object} product - Product information
   * @returns {Promise<string>} Generated image URL
   */
  async generateProductImage(product) {
    try {
      const prompt = `
        Create a professional, modern product mockup image for a digital ${product.category.toLowerCase()} called "${product.name}". 
        The image should be clean, minimalist, and suitable for an online storefront. 
        Style: Modern, professional, high-quality, suitable for social media and e-commerce.
        Colors: Use a cohesive color palette that conveys professionalism and trust.
        No text overlay needed.
      `

      const response = await openaiApi.post('/images/generations', {
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard'
      })

      return response.data.data[0].url
    } catch (error) {
      console.error('Error generating product image:', error)
      // Return a placeholder image
      return `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&auto=format&q=80`
    }
  }

  /**
   * Analyze tweet sentiment and engagement patterns
   * @param {Array} tweets - Array of tweet objects
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeTweetSentiment(tweets) {
    try {
      const tweetTexts = tweets.slice(0, 10).map(tweet => tweet.text).join('\n\n')
      
      const prompt = `
        Analyze the sentiment and themes of these tweets:

        ${tweetTexts}

        Provide analysis in JSON format:
        {
          "overallSentiment": "positive|neutral|negative",
          "mainThemes": ["theme1", "theme2", "theme3"],
          "expertiseAreas": ["area1", "area2", "area3"],
          "audienceInterests": ["interest1", "interest2", "interest3"],
          "contentStyle": "educational|entertaining|inspirational|promotional",
          "recommendedProductTypes": ["type1", "type2", "type3"]
        }
      `

      const response = await openaiApi.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a social media analyst. Analyze content to understand creator expertise and audience interests.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      })

      const content = response.data.choices[0].message.content
      return JSON.parse(content)
    } catch (error) {
      console.error('Error analyzing tweet sentiment:', error)
      return this.getMockSentimentAnalysis()
    }
  }

  /**
   * Generate pricing suggestions based on content and market analysis
   * @param {Object} product - Product information
   * @param {Object} userProfile - Creator profile
   * @returns {Promise<Object>} Pricing recommendations
   */
  async suggestPricing(product, userProfile) {
    try {
      const prompt = `
        Suggest pricing for this digital product:

        Product: ${product.name}
        Category: ${product.category}
        Creator Followers: ${userProfile.metrics?.followers || 0}
        Creator Engagement: ${this.calculateAverageEngagement([])}

        Consider:
        - Market standards for ${product.category}
        - Creator's audience size and engagement
        - Product complexity and value
        - Competitive pricing

        Provide pricing suggestions in JSON:
        {
          "recommendedPrice": number,
          "priceRange": {"min": number, "max": number},
          "reasoning": "Why this price makes sense",
          "alternatives": [
            {"tier": "Basic", "price": number, "features": ["feature1", "feature2"]},
            {"tier": "Premium", "price": number, "features": ["feature1", "feature2", "feature3"]}
          ]
        }
      `

      const response = await openaiApi.post('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a pricing strategist for digital products. Provide data-driven pricing recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 600
      })

      const content = response.data.choices[0].message.content
      return JSON.parse(content)
    } catch (error) {
      console.error('Error suggesting pricing:', error)
      return {
        recommendedPrice: 47,
        priceRange: { min: 29, max: 97 },
        reasoning: 'Based on standard digital product pricing',
        alternatives: []
      }
    }
  }

  /**
   * Calculate average engagement rate from tweets
   * @param {Array} tweets - Array of tweet objects
   * @returns {string} Engagement level description
   */
  calculateAverageEngagement(tweets) {
    if (!tweets.length) return 'Unknown'
    
    const avgEngagement = tweets.reduce((sum, tweet) => sum + (tweet.engagementScore || 0), 0) / tweets.length
    
    if (avgEngagement > 10) return 'Very High'
    if (avgEngagement > 5) return 'High'
    if (avgEngagement > 2) return 'Medium'
    return 'Low'
  }

  /**
   * Mock data for development/demo purposes
   */
  getMockProductSuggestions() {
    return [
      {
        name: 'AI Content Mastery Course',
        description: 'A comprehensive course teaching creators how to leverage AI tools for content creation, from ideation to optimization. Learn proven strategies used by top creators to scale their content production while maintaining quality and authenticity.',
        category: 'Course',
        suggestedPrice: 197,
        reasoning: 'High engagement on AI-related content shows audience interest in learning these skills',
        targetAudience: 'Content creators, marketers, and entrepreneurs looking to scale their content',
        keyFeatures: ['Video tutorials', 'AI tool templates', 'Community access', 'Live Q&A sessions']
      },
      {
        name: 'Viral Content Template Pack',
        description: 'A collection of proven content templates and frameworks that have generated millions of views. Includes post structures, hooks, and engagement strategies for different platforms.',
        category: 'Template',
        suggestedPrice: 47,
        reasoning: 'Strong engagement on template-related posts indicates audience demand for structured content approaches',
        targetAudience: 'Social media managers, content creators, and small business owners',
        keyFeatures: ['50+ templates', 'Platform-specific formats', 'Engagement hooks', 'Analytics tracking']
      },
      {
        name: 'Personal Brand Strategy Session',
        description: 'One-on-one consultation to develop a personalized content strategy and brand positioning. Includes content audit, competitor analysis, and 90-day action plan.',
        category: 'Service',
        suggestedPrice: 297,
        reasoning: 'High engagement on personal branding content suggests audience values expert guidance',
        targetAudience: 'Entrepreneurs, executives, and creators building their personal brand',
        keyFeatures: ['90-minute session', 'Custom strategy document', 'Content calendar', '30-day follow-up']
      }
    ]
  }

  getMockSentimentAnalysis() {
    return {
      overallSentiment: 'positive',
      mainThemes: ['content creation', 'AI tools', 'personal branding', 'entrepreneurship'],
      expertiseAreas: ['content strategy', 'social media growth', 'AI implementation'],
      audienceInterests: ['productivity', 'business growth', 'content creation', 'technology'],
      contentStyle: 'educational',
      recommendedProductTypes: ['Course', 'Template', 'Consultation']
    }
  }
}

export default new OpenAIService()
