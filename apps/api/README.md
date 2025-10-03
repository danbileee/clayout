# Clayout API Server

The backend API server for Clayout - a NestJS-based REST API with Supabase integration.

## 🚀 Overview

This is a robust backend API built with NestJS that provides:

- **Site Management** - CRUD operations for sites and pages
- **Block System** - Dynamic content block management
- **User Authentication** - JWT-based authentication with Supabase
- **File Storage** - Cloudflare R2 integration for asset management
- **Email Services** - Handlebars-based email templates
- **Database Operations** - TypeORM with PostgreSQL via Supabase

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **TypeORM** - Object-relational mapping
- **Supabase** - PostgreSQL database and authentication
- **JWT** - JSON Web Token authentication
- **Cloudflare R2 & KV** - Storage and asset management
- **Handlebars** - Email template engine
- **Jest** - Testing framework
- **Sentry** - Error monitoring and performance tracking

## 📦 Key Dependencies

### Core Framework

- `@nestjs/core` - NestJS core framework
- `@nestjs/common` - Common utilities and decorators
- `@nestjs/config` - Configuration management
- `@nestjs/typeorm` - TypeORM integration
- `@nestjs/jwt` - JWT authentication

### Database & Storage

- `typeorm` - ORM for database operations
- `pg` - PostgreSQL driver
- `@supabase/supabase-js` - Supabase client
- `@aws-sdk/client-s3` - Cloudflare R2 integration

### Utilities

- `class-validator` - Validation decorators
- `class-transformer` - Object transformation
- `bcrypt` - Password hashing
- `handlebars` - Email templating
- `zod` - Schema validation

## 🏗️ Project Structure

```
apps/api/
├── src/
│   ├── app.controller.ts      # Main app controller
│   ├── app.module.ts          # Root module
│   ├── app.service.ts         # App service
│   ├── main.ts                # Application entry point
│   ├── auth/                  # Authentication module
│   ├── sites/                 # Site management
│   ├── users/                 # User management
│   ├── assets/                # Asset management
│   ├── emails/                # Email services
│   ├── pexels/                # Image API integration
│   └── shared/                # Shared utilities
├── supabase/
│   └── migrations/            # Database migrations
├── test/                      # Test files
└── dist/                      # Compiled output
```

## 🚀 Development

### Prerequisites

- Node.js 22.x
- pnpm 10.13.1
- Supabase CLI
- PostgreSQL (via Supabase)

### Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start Supabase locally**

   ```bash
   supabase start
   ```

3. **Set up environment variables**
   Create a `.env` file with:

   ```env
   DATABASE_URL=your_database_url
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_S3_BUCKET=your_s3_bucket
   ```

4. **Start development server**
   ```bash
   pnpm start:dev
   ```

### Available Scripts

```bash
pnpm start              # Start production server
pnpm start:dev          # Start development server with watch mode
pnpm start:debug        # Start with debugging enabled
pnpm build              # Build for production
pnpm build:prod         # Build with Sentry sourcemaps
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Run tests with coverage
pnpm test:e2e           # Run end-to-end tests
pnpm lint               # Run ESLint
pnpm format             # Format code with Prettier
```

## 🗄️ Database Management

### Local Development Workflow

1. **Start Supabase**

   ```bash
   supabase start
   ```

2. **Create tables manually** (for initial development)
   - Use Supabase Studio: http://127.0.0.1:54323
   - Or direct SQL queries via pgAdmin/psql

3. **Generate TypeScript types**

   ```bash
   pnpm gen-supabase-types
   pnpm improve-supabase-types
   ```

4. **Create migration files**

   ```bash
   supabase migration new create_example_table
   ```

5. **Apply migrations locally**

   ```bash
   supabase db reset
   ```

6. **Push to production**
   ```bash
   supabase db push
   ```

### Migration Management

```bash
# Create new migration
supabase migration new migration_name

# List migrations
supabase migration list

# Reset local database
supabase db reset --local

# Link to the target project
supabse link

# Get schema diff
supabase db diff --schema public

# Backup data
supabase db dump --data-only > backup.sql

# Push to the remote DB
supabase db push
```

## 🔧 API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

### Sites

- `GET /sites` - List user sites
- `POST /sites` - Create new site
- `GET /sites/:id` - Get site details
- `PUT /sites/:id` - Update site
- `DELETE /sites/:id` - Delete site

### Pages

- `GET /sites/:id/pages` - List site pages
- `POST /sites/:id/pages` - Create new page
- `PUT /sites/:id/pages/:pageId` - Update page
- `DELETE /sites/:id/pages/:pageId` - Delete page

### Blocks

- `GET /sites/:id/pages/:pageId/blocks` - List page blocks
- `POST /sites/:id/pages/:pageId/blocks` - Create new block
- `PUT /sites/:id/pages/:pageId/blocks/:blockId` - Update block
- `DELETE /sites/:id/pages/:pageId/blocks/:blockId` - Delete block

### Assets

- `POST /assets/upload` - Upload file
- `GET /assets/:id` - Get asset details
- `DELETE /assets/:id` - Delete asset

## 🧪 Testing

### Unit Tests

```bash
pnpm test              # Run all unit tests
pnpm test:watch        # Run tests in watch mode
pnpm test:cov          # Run tests with coverage
```

### End-to-End Tests

```bash
pnpm test:e2e          # Run E2E tests
```

### Test Structure

- Unit tests: `*.spec.ts` files
- E2E tests: `test/` directory
- Test utilities: `test/test-utils.ts`

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password security
- **Input Validation** - class-validator for request validation
- **CORS Configuration** - Cross-origin request handling
- **Error Monitoring** - Sentry integration for error tracking
- Rate Limiting - API rate limiting (Coming soon!)

## 📧 Email Services

The API includes email functionality with Handlebars templates:

- **Welcome emails** - User registration
- **Password reset** - Account recovery
- Site notifications - Site-related updates (Coming soon!)

### Email Templates

Located in `src/emails/templates/` with `.hbs` extension.

## 🚀 Deployment

### Production Build

```bash
pnpm build:prod
```

### Environment Variables

Ensure all required environment variables are set:

- Database connection strings
- JWT secrets
- AWS credentials
- Supabase configuration
- Sentry DSN

### Docker Support

The API can be containerized using the provided Docker configuration.

### Render.com Deployment

The API uses Render.com for hosting with an automated preview deployment system:

#### **Preview Deployment (Staging)**

The API automatically creates preview environments for testing:

1. **Create Pull Request**

   ```bash
   # Create a release branch
   git checkout -b release/your-release-name

   # Make changes and commit
   git add .
   git commit -m "Your changes"
   git push origin release/your-release-name
   ```

2. **Create PR to Staging Branch**
   - Create a pull request targeting the `staging` branch
   - The `render-preview-api` GitHub Action automatically runs

3. **Automatic Preview Environment**
   - GitHub Action adds `render-preview` label to the PR
   - Render.com detects the label and creates a preview environment
   - Provides a unique URL for testing your changes

4. **Testing & Review**
   - Use the preview URL for testing your API changes
   - Share the URL with team members for review
   - Preview environment updates automatically with new commits

#### **Production Deployment**

When ready for production:

1. Merge the PR to the `main` branch
2. Render.com automatically deploys to production
3. Preview environment is automatically cleaned up

#### **Benefits of Preview Deployment**

- **Isolated Testing**: Each PR gets its own environment
- **Automatic Setup**: No manual configuration required
- **Team Collaboration**: Easy sharing of preview URLs
- **Cost Effective**: Preview environments are automatically cleaned up
- **Integration**: Works seamlessly with GitHub workflow

#### **Render.com Configuration**

The API is configured to:

- Auto-deploy from the `main` branch to production
- Create preview environments for PRs with `render-preview` label
- Use environment variables from Render.com dashboard
- Scale automatically based on traffic

## 📊 Monitoring

- **Sentry Integration** - Error tracking and performance monitoring
- **Health Checks** - API health endpoint
- **Logging** - Structured logging with NestJS Logger

## 🔧 Configuration

### Database Configuration

- TypeORM configuration in `app.module.ts`
- Connection pooling and retry logic
- Migration management

### Authentication

- JWT configuration
- Password validation rules
- Session management

### File Storage

- AWS S3 configuration
- File upload limits
- Asset optimization

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)

## 🤝 Contributing

1. Follow NestJS best practices
2. Add tests for new features
3. Update API documentation
4. Ensure all linting passes
5. Follow the existing code style

## 📄 License

UNLICENSED - See [LICENSE.md](../../LICENSE.md) for details.
