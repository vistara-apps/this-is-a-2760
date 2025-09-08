# X Creatify

Turn your X content into a storefront, effortlessly.

X Creatify analyzes your X presence to automatically generate and deploy a functional storefront, monetizing your best content with AI-powered insights.

## 🚀 Features

### Core Features
- **AI Content Analysis**: Leverages AI to scan your X profile, identifying top-performing tweets and potential products
- **Automated Storefront Generation**: Creates professional storefronts with AI-generated descriptions and pricing
- **Integrated Payment & Analytics**: Seamless transactions with Stripe and built-in performance tracking
- **User Content Control**: Review and approve AI suggestions before they go live

### Business Model
- **Freemium**: Basic storefront (10 products, limited analytics) - FREE
- **Pro**: Unlimited products, advanced analytics, customization - $15/month
- **Enterprise**: Custom solutions and dedicated support - Contact for pricing

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend Services**: 
  - Supabase (Database & Auth)
  - OpenAI (AI Content Analysis)
  - Stripe (Payments)
  - X API (Content Fetching)
- **Deployment**: Docker, Vercel/Netlify ready

## 📋 Prerequisites

Before running this application, you'll need:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **API Keys** for:
   - OpenAI API
   - Stripe (for payments)
   - X (Twitter) API
   - Supabase project

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/this-is-a-2760.git
cd this-is-a-2760
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your actual API keys:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-your-openai-api-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# X (Twitter) API Configuration
VITE_X_API_BEARER_TOKEN=your-x-api-bearer-token
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🔧 API Setup Guide

### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. The app will automatically create the required database tables

### OpenAI Setup
1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Add credits to your account for API usage
3. The app uses GPT-4 for content analysis and DALL-E for image generation

### Stripe Setup
1. Create an account at [stripe.com](https://stripe.com)
2. Get your publishable key from the dashboard
3. Set up webhooks for production deployment

### X API Setup
1. Apply for X API access at [developer.x.com](https://developer.x.com)
2. Create a new app and get your Bearer Token
3. Ensure you have the necessary permissions for reading tweets

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── ProductCard.jsx
│   ├── ContentAnalyzer.jsx
│   └── ...
├── contexts/           # React contexts for state management
│   ├── AuthContext.jsx
│   └── DataContext.jsx
├── pages/              # Main application pages
│   ├── Landing.jsx
│   ├── Dashboard.jsx
│   └── Storefront.jsx
├── services/           # API service layers
│   ├── api.js          # Base API configuration
│   ├── xService.js     # X API integration
│   ├── openaiService.js # OpenAI integration
│   ├── stripeService.js # Stripe integration
│   └── supabaseService.js # Database operations
└── styles/             # CSS and styling
```

## 🎨 Design System

The application uses a custom design system built with Tailwind CSS:

- **Colors**: Purple gradient theme with dark mode support
- **Typography**: Inter font family
- **Components**: Modular, reusable components
- **Responsive**: Mobile-first design approach

## 🔒 Security Features

- **API Key Protection**: All sensitive keys are environment variables
- **Input Validation**: Comprehensive validation on all user inputs
- **Rate Limiting**: Built-in protection against API abuse
- **Secure Payments**: PCI-compliant payment processing with Stripe

## 📊 Analytics & Monitoring

- **Revenue Tracking**: Real-time revenue and order analytics
- **Engagement Metrics**: Track product performance and user engagement
- **Error Monitoring**: Comprehensive error logging and reporting

## 🚀 Deployment

### Docker Deployment
```bash
# Build the Docker image
docker build -t x-creatify .

# Run the container
docker run -p 3000:3000 x-creatify
```

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build for production
npm run build

# Serve the built files
npm run preview
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 📈 Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Optimized images with lazy loading
- **Caching**: Intelligent caching strategies for API responses
- **Bundle Analysis**: Built-in bundle size analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.xcreatify.com](https://docs.xcreatify.com)
- **Issues**: [GitHub Issues](https://github.com/vistara-apps/this-is-a-2760/issues)
- **Discord**: [Join our community](https://discord.gg/xcreatify)
- **Email**: support@xcreatify.com

## 🗺️ Roadmap

- [ ] Multi-platform content analysis (Instagram, LinkedIn, TikTok)
- [ ] Advanced AI product recommendations
- [ ] White-label solutions for agencies
- [ ] Mobile app for iOS and Android
- [ ] Advanced analytics dashboard
- [ ] Affiliate program integration

## 🙏 Acknowledgments

- OpenAI for powerful AI capabilities
- Stripe for secure payment processing
- Supabase for backend infrastructure
- The React and Vite communities

---

**Made with ❤️ by the X Creatify team**
