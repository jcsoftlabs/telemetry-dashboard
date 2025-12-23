# Telemetry Dashboard - Ministry of Tourism Haiti

A real-time analytics and monitoring dashboard for tracking tourism data, user behavior, and system performance across Haiti's tourism platforms.

![Version](https://img.shields.io/badge/version-2.4.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black)
![License](https://img.shields.io/badge/license-Proprietary-red)

## 🌟 Features

### Real-Time Analytics
- **Live WebSocket Updates**: Real-time data streaming for instant insights
- **Interactive Dashboards**: Dynamic visualizations with Recharts
- **Geographic Analytics**: World heatmap with intelligent country matching
- **User Journey Tracking**: Navigation paths and conversion funnel analysis

### Comprehensive Monitoring
- **Session Analytics**: Track user sessions, duration, and engagement
- **Performance Metrics**: Monitor response times, TTFB, and system health
- **Error Tracking**: Real-time error monitoring with severity classification
- **Device Analytics**: Breakdown by device type, OS, and browser

### Advanced Features
- **Dark Mode Support**: Seamless theme switching
- **Export Capabilities**: CSV and PDF export for reports and user data
- **Responsive Design**: Optimized for desktop and mobile
- **French Localization**: Full French language support

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.0 (App Router)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: react-simple-maps
- **Real-time**: WebSocket connections
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Access to the telemetry backend API

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/jcsoftlabs/telemetry-dashboard.git
cd telemetry-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
telemetry-dashboard/
├── app/                      # Next.js app directory
│   ├── (dashboard)/         # Dashboard pages
│   │   ├── analytics-geo/   # Geographic analytics
│   │   ├── journeys/        # User journey analysis
│   │   ├── users/           # User management
│   │   └── reports/         # Report generation
│   ├── login/               # Authentication
│   └── api/                 # API routes
├── components/              # React components
│   ├── charts/             # Chart components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── lib/                     # Utilities and helpers
│   ├── api/                # API client functions
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
└── public/                  # Static assets
```

## 🔑 Key Features Explained

### Intelligent Country Mapping
The dashboard includes a sophisticated country name matching system that handles:
- Exact matches
- Case-insensitive matching
- Accent normalization (e.g., "Haïti" → "Haiti")
- Partial matching with validation
- ISO country code support

### Export Functionality
- **User Data Export**: Comprehensive CSV/PDF exports with reverse geocoding
- **Report Generation**: Automated PDF reports with formatted tables
- **Smart Fallbacks**: Intelligent data fallback for missing information

### Overflow Prevention
- Robust layout constraints to prevent horizontal scroll
- Proper text truncation for long navigation paths
- Responsive grid systems with `min-w-0` constraints

## 🎨 Design System

The dashboard uses a modern design system with:
- **Color Palette**: Blue, Green, Purple, Red accent colors
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable KPI cards, charts, and tables

## 🔐 Authentication

The dashboard uses NextAuth.js for secure authentication:
- Credential-based login
- Session management
- Protected routes
- Role-based access control (planned)

## 📊 Available Pages

- **Dashboard** (`/`): Overview with key metrics
- **Geographic Analytics** (`/analytics-geo`): World map and location data
- **User Journeys** (`/journeys`): Navigation paths and conversion funnels
- **Users** (`/users`): User list with detailed profiles
- **Reports** (`/reports`): Report templates and generation
- **Sessions** (`/sessions`): Session analytics
- **Events** (`/events`): Event tracking
- **Performance** (`/performance`): System performance metrics
- **Errors** (`/errors`): Error monitoring

## 🚢 Deployment

The dashboard is deployed on Vercel:

```bash
vercel --prod
```

## 🤝 Contributing

This is a proprietary project for the Ministry of Tourism Haiti. For access or contributions, please contact the development team.

## 📝 License

© 2025 Ministry of Tourism Haiti. All rights reserved.

## 👥 Development Team

Developed by JC Soft Labs for the Ministry of Tourism Haiti.

## 📞 Support

For technical support or questions, please contact the development team.

---

**System Version**: 2.4.0  
**Last Updated**: December 2025
