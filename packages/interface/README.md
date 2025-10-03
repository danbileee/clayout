# Clayout Interface

Shared TypeScript interfaces, schemas, and types for the Clayout ecosystem.

## 🚀 Overview

This package provides a centralized collection of TypeScript interfaces, Zod schemas, and type definitions used across all Clayout applications. It ensures type safety and consistency between the frontend, backend, and shared components.

## 🛠️ Tech Stack

- **TypeScript** - Type-safe development
- **Zod** - Schema validation and type inference
- **tsup** - Fast TypeScript bundler
- **Pexels API** - Stock photo integration types

## 📦 Key Dependencies

### Core

- `zod` - Schema validation and type inference
- `pexels` - Stock photo API client

### Development

- `tsup` - TypeScript bundler
- `typescript` - TypeScript compiler

## 🏗️ Project Structure

```
packages/interface/
├── src/
│   ├── index.ts              # Main export file
│   ├── constants/            # Application constants
│   │   ├── site-categories.ts
│   │   ├── site-statuses.ts
│   │   ├── site-page-categories.ts
│   │   └── site-block-types.ts
│   ├── schemas/              # Zod schemas
│   │   ├── site.schema.ts
│   │   ├── site-page.schema.ts
│   │   ├── site-block.schema.ts
│   │   ├── user.schema.ts
│   │   ├── asset.schema.ts
│   │   ├── auth.schema.ts
│   │   ├── email.schema.ts
│   │   ├── counter.schema.ts
│   │   ├── pexels.schema.ts
│   │   ├── api-response.schema.ts
│   │   ├── pagination.schema.ts
│   │   ├── validation.schema.ts
│   │   ├── file-upload.schema.ts
│   │   └── site-domain.schema.ts
│   ├── types/                # TypeScript types
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── site.types.ts
│   │   ├── user.types.ts
│   │   ├── asset.types.ts
│   │   ├── email.types.ts
│   │   ├── counter.types.ts
│   │   ├── pexels.types.ts
│   │   ├── common.types.ts
│   │   ├── editor.types.ts
│   │   ├── supabase.types.ts
│   │   └── validation.types.ts
│   └── errors/               # Error definitions
│       ├── api.error.ts
│       └── validation.error.ts
├── dist/                     # Compiled output
└── package.json              # Package configuration
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

2. **Build the package**

   ```bash
   pnpm build
   ```

3. **Use in other packages**
   ```typescript
   import { SiteSchema, SiteBlockTypes } from "@clayout/interface";
   ```

### Available Scripts

```bash
pnpm build              # Build the package
pnpm build:js           # Build JavaScript output
pnpm build:types        # Build TypeScript declarations
pnpm prepare            # Build before publishing
pnpm test               # Run tests (placeholder)
```

## 📋 Schema Categories

### Site Management

- **Site Schema** - Complete site structure and validation
- **Site Page Schema** - Page configuration and metadata
- **Site Block Schema** - Block content and styling
- **Site Domain Schema** - Domain configuration

### User & Authentication

- **User Schema** - User profile and settings
- **Auth Schema** - Authentication and authorization
- **API Response Schema** - Standardized API responses

### Content & Assets

- **Asset Schema** - File upload and management
- **Pexels Schema** - Stock photo integration
- **File Upload Schema** - File validation and processing

### System & Utilities

- **Pagination Schema** - List pagination
- **Validation Schema** - Common validation rules
- **Email Schema** - Email templates and sending
- **Counter Schema** - Analytics and metrics

## 🔧 Type Definitions

### Core Types

```typescript
// Site-related types
export type Site = z.infer<typeof SiteSchema>;
export type SitePage = z.infer<typeof SitePageSchema>;
export type SiteBlock = z.infer<typeof SiteBlockSchema>;

// User types
export type User = z.infer<typeof UserSchema>;
export type AuthUser = z.infer<typeof AuthSchema>;

// API types
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};
```

### Block Types

```typescript
export enum SiteBlockTypes {
  Text = "text",
  Image = "image",
  Button = "button",
  Container = "container",
  // ... more block types
}
```

### Site Categories

```typescript
export enum SiteCategories {
  "Landing Page" = "landing-page",
  "Portfolio" = "portfolio",
  "Blog" = "blog",
  "E-commerce" = "e-commerce",
  // ... more categories
}
```

## 🎯 Usage Examples

### Schema Validation

```typescript
import { SiteSchema, SiteBlockSchema } from "@clayout/interface";

// Validate site data
const siteData = SiteSchema.parse(rawSiteData);

// Validate block data
const blockData = SiteBlockSchema.parse(rawBlockData);
```

### Type Safety

```typescript
import { Site, SiteBlockTypes, SiteCategories } from "@clayout/interface";

// Type-safe site creation
const newSite: Site = {
  name: "My Site",
  category: SiteCategories["Landing Page"],
  status: SiteStatuses.Draft,
  // ... other properties
};

// Type-safe block handling
if (block.type === SiteBlockTypes.Text) {
  // TypeScript knows this is a text block
  console.log(block.content);
}
```

### API Integration

```typescript
import { ApiResponse, PaginationSchema } from "@clayout/interface";

// Type-safe API responses
const response: ApiResponse<Site[]> = await fetch("/api/sites");

// Pagination handling
const pagination = PaginationSchema.parse(queryParams);
```

## 🔄 Build Process

### TypeScript Compilation

The package uses `tsup` for fast compilation:

1. **JavaScript Build** - Generates both ESM and CJS outputs
2. **Type Declarations** - Generates `.d.ts` files
3. **Source Maps** - Includes source maps for debugging

### Output Structure

```
dist/
├── index.js              # ESM output
├── index.cjs             # CommonJS output
├── src/
│   └── index.d.ts        # Type declarations
└── index.cjs.map         # Source maps
```

## 📦 Package Exports

### Main Exports

```typescript
// Constants
export * from "./constants/site-categories";
export * from "./constants/site-statuses";
export * from "./constants/site-block-types";

// Schemas
export * from "./schemas/site.schema";
export * from "./schemas/site-page.schema";
export * from "./schemas/site-block.schema";

// Types
export * from "./types/site.types";
export * from "./types/user.types";
export * from "./types/api.types";

// Errors
export * from "./errors/api.error";
export * from "./errors/validation.error";
```

## 🔧 Configuration

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "outDir": "./dist"
  }
}
```

### Build Configuration

```typescript
// tsup.config.ts
export default {
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
};
```

## 🧪 Testing

### Schema Validation Testing

```typescript
import { SiteSchema } from "@clayout/interface";

// Test valid data
const validSite = SiteSchema.parse({
  name: "Test Site",
  category: "landing-page",
  // ... other required fields
});

// Test invalid data
expect(() => SiteSchema.parse({})).toThrow();
```

## 📚 Additional Resources

- [Zod Documentation](https://zod.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [tsup Documentation](https://tsup.egoist.dev/)

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper JSDoc comments
3. Include schema validation
4. Update exports in index.ts
5. Ensure type safety across all schemas

## 📄 License

UNLICENSED - See [LICENSE.md](../../LICENSE.md) for details.
