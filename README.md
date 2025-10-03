# Clayout

🛠️ **Create layouts that connect.**

Clayout is a modern, full-stack website builder that enables users to create and manage dynamic layouts with a visual editor. Built with a monorepo architecture, it provides a complete solution for building, editing, and deploying websites.

## 🏗️ Architecture

This project is organized as a monorepo with the following structure:

### Applications (`apps/`)

- **`web`** - React-based frontend application with visual site editor
- **`api`** - NestJS backend API with Supabase integration
- **`router`** - Cloudflare Workers-based routing service

### Packages (`packages/`)

- **`interface`** - Shared TypeScript interfaces and schemas
- **`kit`** - Reusable React components and block renderer

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x
- pnpm 10.13.1
- Supabase account (for database)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/danbileee/clayout.git
   cd clayout
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   - Copy environment files and configure your Supabase credentials
   - Set up AWS S3 credentials for file storage

4. **Start development servers**

   ```bash
   # Start all applications
   pnpm dev

   # Or start individually
   pnpm --filter @clayout/web dev
   pnpm --filter @clayout/api start:dev
   pnpm --filter @clayout/router dev
   ```

## 📦 Available Scripts

### Build Commands

```bash
pnpm build:web        # Build web application
pnpm build:api        # Build API server
pnpm build:interface  # Build shared interfaces
pnpm build:kit        # Build component kit
```

### Development Commands

```bash
pnpm test:all         # Run all tests
pnpm lint:all         # Lint all packages
```

### Database Commands

```bash
pnpm gen-supabase-types      # Generate Supabase types
pnpm improve-supabase-types  # Improve generated types
```

## 🚀 Deployment

For detailed deployment instructions, see the specific application READMEs:

### Applications

- **[Web Deployment](apps/web/README.md#-deployment)** - Vercel automatic deployment for staging and production
- **[Router Deployment](apps/router/README.md#-deployment)** - Cloudflare Workers deployment with GitHub Actions
- **[API Deployment](apps/api/README.md#-deployment)** - Render.com deployment with preview environments

## 🛠️ Tech Stack

### Frontend (Web App)

- **React 19** with React Router v7
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Zustand** for state management
- **TanStack Query** for server state
- **Conform** for form handling
- **Styled Components** for dynamic styling

### Backend (API)

- **NestJS** framework
- **TypeORM** for database operations
- **Supabase** for database and auth
- **JWT** for authentication
- **Cloudflare R2 & KV** for storages
- **Handlebars** for email templates

### Infrastructure

- **Cloudflare Workers** for edge routing
- **Hono** for lightweight API routing

## 🎨 Features

- **Visual Site Editor** - Drag-and-drop interface for building layouts
- **Block System** - Modular components (text, image, button, etc.)
- **Real-time Preview** - Live preview of changes
- **Multi-page Support** - Create and manage multiple pages
- **Responsive Design** - Mobile-first approach
- **Authentication** - User management and site ownership
- **Asset Management** - Image and file uploads
- Custom Domains - Deploy to custom domains (Coming soon!)

## 📁 Project Structure

```
clayout/
├── apps/
│   ├── web/          # React frontend
│   ├── api/          # NestJS backend
│   └── router/       # Cloudflare Worker
├── packages/
│   ├── interface/    # Shared types & schemas
│   └── kit/          # React components
└── package.json      # Root package configuration
```

## 🔧 Development

### Adding New Block Types

1. Define the block schema in `packages/interface`
2. Create the block component in `packages/kit`
3. Add editor components in `apps/web`
4. Update the block registry

### Database Migrations

Migrations are located in `apps/api/supabase/migrations/`. Use the Supabase CLI to manage them.

## 📄 License

UNLICENSED - See [LICENSE.md](LICENSE.md) for details.

## 📚 Documentation

For detailed information about each component of the Clayout ecosystem:

### Applications

- **[Web App](apps/web/README.md)** - React frontend with visual editor
- **[API Server](apps/api/README.md)** - NestJS backend with Supabase integration
- **[Router](apps/router/README.md)** - Cloudflare Workers edge routing service

### Packages

- **[Interface](packages/interface/README.md)** - Shared TypeScript interfaces and schemas
- **[Kit](packages/kit/README.md)** - Reusable React components and block renderer

## 👨‍💻 Author

**Danbi Lee** - [hello@danbileee.com](mailto:hello@danbileee.com)
