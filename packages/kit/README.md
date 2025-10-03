# Clayout Kit

Reusable React components and block renderer for the Clayout website builder.

## 🚀 Overview

This package provides a comprehensive set of React components and utilities for building and rendering dynamic website layouts. It includes block components, page renderers, and utility functions that power the Clayout visual editor.

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Zod** - Schema validation and type inference
- **tsup** - Fast TypeScript bundler
- **@clayout/interface** - Shared types and schemas

## 📦 Key Dependencies

### Core

- `react` - React library
- `react-dom` - React DOM rendering
- `@clayout/interface` - Shared interfaces and schemas
- `zod` - Schema validation

### Development

- `tsup` - TypeScript bundler
- `typescript` - TypeScript compiler
- `eslint` - Code linting
- `typescript-eslint` - TypeScript ESLint rules

## 🏗️ Project Structure

```
packages/kit/
├── src/
│   ├── index.ts              # Main export file
│   ├── blocks/               # Block components
│   │   ├── text/
│   │   │   ├── text.block.ts
│   │   │   └── text.component.tsx
│   │   ├── image/
│   │   │   ├── image.block.ts
│   │   │   └── image.component.tsx
│   │   ├── button/
│   │   │   ├── button.block.ts
│   │   │   └── button.component.tsx
│   │   ├── container/
│   │   │   ├── container.block.ts
│   │   │   └── container.component.tsx
│   │   ├── spacer/
│   │   │   ├── spacer.block.ts
│   │   │   └── spacer.component.tsx
│   │   ├── divider/
│   │   │   ├── divider.block.ts
│   │   │   └── divider.component.tsx
│   │   ├── heading/
│   │   │   ├── heading.block.ts
│   │   │   └── heading.component.tsx
│   │   ├── list/
│   │   │   ├── list.block.ts
│   │   │   └── list.component.tsx
│   │   └── quote/
│   │       ├── quote.block.ts
│   │       └── quote.component.tsx
│   ├── pages/                # Page rendering
│   │   ├── renderer.tsx      # Main page renderer
│   │   ├── page.component.tsx # Page component
│   │   └── page.types.ts     # Page types
│   └── utils/                # Utility functions
│       ├── block-registry.ts # Block registry system
│       ├── render-utils.ts   # Rendering utilities
│       ├── style-utils.ts    # Style utilities
│       └── validation.ts     # Validation helpers
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
   import { BlockRegistry, renderToJsx } from "@clayout/kit";
   ```

### Available Scripts

```bash
pnpm build              # Build the package
pnpm build:js           # Build JavaScript output
pnpm build:types        # Build TypeScript declarations
pnpm prepare            # Build before publishing
pnpm lint               # Run ESLint
pnpm test               # Run tests (placeholder)
```

## 🧩 Block System

### Block Types

The kit includes various block types for building layouts:

#### **Text Block**

- Rich text content
- Typography styling
- Text alignment options
- Color and size customization

#### **Image Block**

- Image display and optimization
- Alt text support
- Responsive sizing
- Lazy loading

#### **Button Block**

- Call-to-action buttons
- Link and action configuration
- Styling options
- Hover effects

#### **Container Block**

- Layout containers
- Flexbox and grid support
- Spacing and padding
- Background styling

#### **Spacer Block**

- Vertical and horizontal spacing
- Responsive spacing
- Custom spacing values

#### **Divider Block**

- Visual separators
- Line styling options
- Custom thickness and color

#### **Heading Block**

- H1-H6 headings
- Typography styling
- SEO optimization

#### **List Block**

- Ordered and unordered lists
- Custom list styling
- Nested list support

#### **Quote Block**

- Blockquote styling
- Citation support
- Custom quote formatting

### Block Structure

Each block follows a consistent structure:

```typescript
// Block definition
export const TextBlock = {
  type: SiteBlockTypes.Text,
  schema: TextBlockSchema,
  defaultData: DefaultTextBlockData,
  component: TextBlockComponent,
};

// Block component
export function TextBlockComponent({ block, ...props }: BlockComponentProps) {
  return (
    <div className="text-block" style={block.style}>
      {block.content}
    </div>
  );
}
```

## 🎨 Page Rendering

### Renderer Functions

The kit provides multiple rendering functions:

#### **JSX Rendering**

```typescript
import { renderToJsx } from "@clayout/kit";

const jsx = renderToJsx(pageData);
// Returns React JSX elements
```

#### **String Rendering**

```typescript
import { renderToString } from "@clayout/kit";

const html = renderToString(pageData);
// Returns HTML string for SSR
```

### Page Component

```typescript
import { PageComponent } from "@clayout/kit";

function MyPage({ pageData }: { pageData: SitePage }) {
  return (
    <PageComponent
      page={pageData}
      blocks={pageData.blocks}
      containerStyle={pageData.containerStyle}
    />
  );
}
```

## 🔧 Block Registry

### Registry System

The block registry manages all available blocks:

```typescript
import { BlockRegistry } from "@clayout/kit";

const registry = new BlockRegistry();

// Register a block
registry.register(TextBlock);

// Find a block by type
const block = registry.find({ type: SiteBlockTypes.Text });

// Get all blocks
const allBlocks = registry.getAll();
```

### Custom Block Registration

```typescript
import { BlockRegistry, SiteBlockTypes } from "@clayout/kit";

// Define custom block
const CustomBlock = {
  type: "custom" as const,
  schema: CustomBlockSchema,
  defaultData: DefaultCustomBlockData,
  component: CustomBlockComponent,
};

// Register custom block
const registry = new BlockRegistry();
registry.register(CustomBlock);
```

## 🎯 Usage Examples

### Basic Block Rendering

```typescript
import { BlockRegistry, SiteBlockTypes } from "@clayout/kit";

const registry = new BlockRegistry();
const block = registry.find({ type: SiteBlockTypes.Text });

if (block) {
  const BlockComponent = block.component;
  return <BlockComponent block={blockData} />;
}
```

### Page Rendering

```typescript
import { renderToJsx, PageComponent } from "@clayout/kit";

// Render page to JSX
function MyPage({ pageData }: { pageData: SitePage }) {
  const jsx = renderToJsx(pageData);
  return <div className="page">{jsx}</div>;
}

// Or use the PageComponent
function MyPage({ pageData }: { pageData: SitePage }) {
  return <PageComponent page={pageData} />;
}
```

### Custom Block Creation

```typescript
import { BlockComponentProps, SiteBlockTypes } from "@clayout/kit";

// Define custom block schema
const CustomBlockSchema = z.object({
  type: z.literal("custom"),
  content: z.string(),
  style: z.object({
    color: z.string().optional(),
    fontSize: z.string().optional(),
  }),
});

// Create custom block component
function CustomBlockComponent({ block }: BlockComponentProps) {
  return (
    <div style={block.style}>
      <h3>Custom Block</h3>
      <p>{block.content}</p>
    </div>
  );
}

// Register custom block
const CustomBlock = {
  type: "custom" as const,
  schema: CustomBlockSchema,
  defaultData: {
    type: "custom",
    content: "Default content",
    style: {},
  },
  component: CustomBlockComponent,
};
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
// Block components
export * from "./blocks/text/text.component";
export * from "./blocks/image/image.component";
export * from "./blocks/button/button.component";

// Page rendering
export * from "./pages/renderer";
export * from "./pages/page.component";

// Utilities
export * from "./utils/block-registry";
export * from "./utils/render-utils";
export * from "./utils/style-utils";

// Types
export * from "./pages/page.types";
```

## 🧪 Testing

### Component Testing

```typescript
import { render, screen } from "@testing-library/react";
import { TextBlockComponent } from "@clayout/kit";

test("renders text block", () => {
  const blockData = {
    type: "text",
    content: "Hello World",
    style: { color: "blue" },
  };

  render(<TextBlockComponent block={blockData} />);
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});
```

### Registry Testing

```typescript
import { BlockRegistry } from "@clayout/kit";

test("registers and finds blocks", () => {
  const registry = new BlockRegistry();
  const block = registry.find({ type: "text" });

  expect(block).toBeDefined();
  expect(block.type).toBe("text");
});
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zod Documentation](https://zod.dev/)

## 🤝 Contributing

1. Follow React best practices
2. Add proper TypeScript types
3. Include component tests
4. Update block registry
5. Ensure accessibility compliance

## 📄 License

UNLICENSED - See [LICENSE.md](../../LICENSE.md) for details.
