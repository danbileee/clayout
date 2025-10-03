# Clayout Router

The edge routing service for Clayout - a Cloudflare Workers-based routing system that handles site routing and asset delivery.

## 🚀 Overview

This is a lightweight edge routing service built with Cloudflare Workers and Hono that provides:

- **Dynamic Site Routing** - Route requests to the correct site based on domain
- **Asset Delivery** - Serve static assets and bundles from Cloudflare R2
- **Edge Performance** - Global edge deployment for fast response times
- **KV Storage** - Fast key-value storage for routing configuration
- **Custom Domains** - Support for custom domain routing

## 🛠️ Tech Stack

- **Cloudflare Workers** - Edge computing platform
- **Hono** - Lightweight web framework for edge environments
- **TypeScript** - Type-safe development
- **Wrangler** - Cloudflare Workers CLI and deployment tool
- **Cloudflare KV** - Global key-value storage
- **Cloudflare R2** - Object storage for assets and bundles

## 📦 Key Dependencies

### Core Framework

- `hono` - Lightweight web framework
- `typescript` - TypeScript support

### Development Tools

- `wrangler` - Cloudflare Workers CLI

## 🏗️ Project Structure

```
apps/router/
├── src/
│   └── index.ts               # Main router logic
├── wrangler.jsonc             # Cloudflare Workers configuration
├── worker-configuration.d.ts  # Type definitions
└── package.json               # Dependencies and scripts
```

## 🚀 Development

### Prerequisites

- Node.js 22.x
- pnpm 10.13.1
- Cloudflare account
- Wrangler CLI

### Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up Cloudflare credentials**

   ```bash
   wrangler login
   ```

3. **Configure environment variables**
   Update `wrangler.jsonc` with your Cloudflare resources:

   ```json
   {
     "kv_namespaces": [
       {
         "binding": "SITE_ROUTING_KV",
         "id": "your_kv_namespace_id"
       }
     ],
     "r2_buckets": [
       {
         "binding": "CLAYOUT_BUNDLES_R2",
         "bucket_name": "your_r2_bucket_name"
       }
     ]
   }
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

### Available Scripts

```bash
pnpm dev              # Start development server
pnpm deploy           # Deploy to Cloudflare Workers
pnpm cf-typegen       # Generate Cloudflare types
```

## 🔧 Configuration

### Wrangler Configuration

The `wrangler.jsonc` file contains the Cloudflare Workers configuration:

```json
{
  "name": "clayout-router",
  "main": "src/index.ts",
  "compatibility_date": "2024-01-01",
  "kv_namespaces": [
    {
      "binding": "SITE_ROUTING_KV",
      "id": "your_kv_namespace_id"
    }
  ],
  "r2_buckets": [
    {
      "binding": "CLAYOUT_BUNDLES_R2",
      "bucket_name": "your_r2_bucket_name"
    }
  ]
}
```

### Environment Variables

Configure these in your Cloudflare Workers dashboard:

- `DEFAULT_DOMAIN` - Default domain for routing (e.g., `.clayout.app`)
- `API_URL` - Backend API URL for fallback routing

## 🌐 Routing Logic

### Site Routing

The router handles different types of requests:

1. **Custom Domain Requests**

   - Look up site ID from KV storage using domain
   - Route to appropriate site bundle

2. **Default Domain Requests**

   - Parse subdomain to determine site
   - Route to site-specific content

3. **Asset Requests**
   - Serve static assets from R2 storage
   - Handle bundle delivery

### Routing Flow

```
Request → Domain Lookup → Site Resolution → Bundle Delivery
    ↓
KV Storage → Site Configuration → R2 Assets → Response
```

## 🗄️ Data Storage

### Cloudflare KV

Used for fast site routing configuration:

- **Key Format**: `site:${domain}`
- **Value**: Site configuration including:
  - Site ID
  - Release version
  - Bundle path
  - Custom settings

### Cloudflare R2

Used for asset and bundle storage:

- **Site Bundles**: Compiled site assets
- **Static Assets**: Images, CSS, JS files
- **CDN Delivery**: Global edge caching

## 🚀 Deployment

### Manual Deployment (CLI)

#### Development Deployment

```bash
# Deploy to development environment
wrangler deploy --env development
```

#### Production Deployment

```bash
# Deploy to production
wrangler deploy
```

#### Environment Management

```bash
# List environments
wrangler environments list

# Deploy to specific environment
wrangler deploy --env production
```

### Automated Deployment (GitHub Actions)

The router can be deployed using GitHub Actions for a more streamlined workflow:

#### **Manual GitHub Actions Deployment**

1. **Navigate to GitHub Actions**

   - Go to your repository on GitHub
   - Click on the "Actions" tab

2. **Select Deploy Router Workflow**

   - Find "Deploy Router (w/ Cloudflare Workers)" in the workflow list
   - Click on it to open the workflow page

3. **Run the Workflow**

   - Click the "Run workflow" button (top right)
   - Select the branch you want to deploy (usually `main` or `release/*`)
   - Click "Run workflow" to start the deployment

4. **Monitor the Deployment**
   - Watch the workflow progress in real-time
   - Check the logs for any errors
   - Verify successful deployment

#### **Prerequisites for GitHub Actions**

- **Cloudflare API Token**: Must be configured as `CF_WORKERS_TOKEN` secret in GitHub repository settings
- **Cloudflare Account**: With Workers access and appropriate permissions
- **Repository Access**: The token must have access to deploy to your Cloudflare Workers

#### **Setting up GitHub Secrets**

1. Go to the GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `CF_WORKERS_TOKEN`
5. Value: Your Cloudflare API token with Workers permissions

#### **Benefits of GitHub Actions Deployment**

- **Consistent Environment**: Same deployment process every time
- **Audit Trail**: Full deployment history in GitHub
- **Team Access**: Multiple team members can trigger deployments
- **Integration**: Works seamlessly with the existing Git workflow
- **Monitoring**: Built-in deployment status and logs

## 🧪 Testing

### Local Testing

```bash
# Start local development server
pnpm dev

# Test with curl
curl http://localhost:8787/your-site-domain
```

### Production Testing

```bash
# Test deployed worker
curl https://your-worker.your-subdomain.workers.dev/
```

## 🔒 Security

- **CORS Configuration** - Cross-origin request handling
- **Rate Limiting** - Built-in Cloudflare rate limiting
- **DDoS Protection** - Cloudflare's DDoS protection
- **SSL/TLS** - Automatic HTTPS with Cloudflare

## 📊 Monitoring

- **Cloudflare Analytics** - Built-in request analytics
- **Error Tracking** - Automatic error logging
- **Performance Metrics** - Response time monitoring
- **Usage Statistics** - Request volume tracking

## 🔧 Custom Domains

### Adding Custom Domains

1. **Configure DNS**

   - Point domain to Cloudflare
   - Add CNAME record to worker

2. **Update KV Storage**

   ```bash
   # Add site routing configuration
   wrangler kv:key put "site:yourdomain.com" '{"siteId":"123","version":"1.0.0"}'
   ```

3. **Deploy Changes**
   ```bash
   wrangler deploy
   ```

## 🌍 Global Deployment

The router is deployed globally on Cloudflare's edge network:

- **200+ Data Centers** - Global edge presence
- **Sub-100ms Response** - Ultra-fast response times
- **Automatic Scaling** - Handles traffic spikes
- **Zero Cold Starts** - Always warm instances

## 📚 Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Documentation](https://hono.dev/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/kv/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)

## 🤝 Contributing

1. Follow Cloudflare Workers best practices
2. Test locally before deploying
3. Update configuration as needed
4. Ensure proper error handling
5. Follow the existing code style

## 📄 License

UNLICENSED - See [LICENSE.md](../../LICENSE.md) for details.
