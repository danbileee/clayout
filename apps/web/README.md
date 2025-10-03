# Clayout Web Application

The frontend application for Clayout - a modern website builder with a visual editor interface.

## 🚀 Overview

This is a React-based single-page application built with React Router v7 that provides:

- **Visual Site Editor** - Drag-and-drop interface for building websites
- **Block System** - Modular components for content creation
- **Real-time Preview** - Live preview of site changes
- **Multi-page Management** - Create and organize multiple pages
- **User Authentication** - Secure user management
- **Asset Management** - Upload and manage images/files

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **React Router v7** - File-based routing with SSR support
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **Conform** - Form handling and validation
- **Styled Components** - CSS-in-JS for dynamic styling

## 📦 Key Dependencies

### UI & Styling

- `@radix-ui/*` - Accessible UI components
- `tailwindcss` - CSS framework
- `styled-components` - Dynamic styling
- `@tabler/icons-react` - Icon library

### State & Data

- `zustand` - Client state management
- `@tanstack/react-query` - Server state
- `axios` - HTTP client
- `@supabase/supabase-js` - Database client

### Forms & Validation

- `@conform-to/react` - Form handling
- `@conform-to/zod` - Schema validation
- `zod` - Schema validation library

## 🏗️ Project Structure

```
apps/web/
├── app/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and configurations
│   ├── providers/     # Context providers
│   ├── themes/        # Theme configurations
│   └── utils/         # Helper functions
├── public/            # Static assets
├── build/             # Production build output
└── package.json       # Dependencies and scripts
```

## 🚀 Development

### Prerequisites

- Node.js 22.x
- pnpm 10.13.1

### Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start development server**

   ```bash
   pnpm dev
   ```

3. **Build for production**

   ```bash
   pnpm build
   ```

4. **Preview production build**
   ```bash
   pnpm preview
   ```

### Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm build:client     # Build client-side code
pnpm build:server     # Build server-side code
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm preview          # Preview production build
```

## 🎨 Features

### Visual Editor

- **Block-based editing** - Add, remove, and reorder content blocks
- **Real-time preview** - See changes instantly
- **Responsive design** - Mobile-first approach
- **Custom styling** - Advanced styling options

### Block Types

- **Text Block** - Rich text editing
- **Image Block** - Image upload and management
- **Button Block** - Call-to-action buttons
- **Container Block** - Layout containers

### Site Management

- **Multi-page sites** - Create multiple pages per site
- **Page organization** - Drag-and-drop page ordering
- **SEO settings** - Meta tags and descriptions
- **Custom domains** - Deploy to custom domains

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=your_api_url
```

### Build Configuration

- **Vite** - Configured for React with TypeScript
- **React Router** - File-based routing with SSR
- **Tailwind CSS** - Configured with custom theme
- **ESLint** - TypeScript-aware linting rules

## 🧪 Testing

The application uses Jest for testing with the following setup:

```bash
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
```

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly**: Optimized for touch interactions
- **Progressive enhancement**: Works on all device sizes

## 🔒 Security

- **Authentication** - JWT-based authentication
- **Authorization** - Role-based access control
- **CSRF Protection** - Built-in CSRF protection
- **Content Security Policy** - Configured CSP headers

## 🚀 Deployment

### Vercel Deployment (Recommended)

The web application is automatically deployed to Vercel with the following setup:

#### **Automatic Deployment**

The application automatically builds and deploys when branches are updated:

1. **Staging Deployment**

   - Triggered when the `staging` branch is updated
   - Provides a preview environment for testing
   - Accessible via Vercel's preview URL

2. **Production Deployment**
   - Triggered when the `main` branch is updated
   - Deploys to the production domain
   - Automatically optimized for performance

#### **Deployment Flow**

```bash
# For staging deployment
git checkout staging
git merge release/your-release
git push origin staging
# → Vercel automatically builds and deploys to staging

# For production deployment
git checkout main
git merge release/your-release
git push origin main
# → Vercel automatically builds and deploys to production
```

#### **Vercel Configuration**

The application is configured with:

- **Framework Preset**: React Router v7
- **Build Command**: `pnpm build`
- **Output Directory**: `build/`
- **Node.js Version**: 22.x
- **Environment Variables**: Configured in Vercel dashboard

### Manual Deployment

#### **Production Build**

```bash
pnpm build
```

The build output will be in the `build/` directory.

## 📚 Additional Resources

- [React Router v7 Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TanStack Query Documentation](https://tanstack.com/query)

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure all linting passes

## 📄 License

UNLICENSED - See [LICENSE.md](../../LICENSE.md) for details.
