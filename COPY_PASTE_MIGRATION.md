# Copy-Paste Migration Guide

## Step 1: Create New Replit Project
1. Go to replit.com → Create Repl → Node.js
2. Name: "retail-restock-v2"

## Step 2: Copy Essential Files (in order)

### 1. package.json
Copy this exact content to new project's package.json:
```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.10.4",
    "drizzle-orm": "^0.33.0",
    "drizzle-zod": "^0.5.1",
    "express": "^4.19.2",
    "tsx": "^4.16.2",
    "typescript": "^5.5.4",
    "zod": "^3.23.8",
    "@types/express": "^4.17.21",
    "@types/node": "^22.7.4"
  }
}
```

### 2. Create folder structure
- Create `server/` folder
- Create `client/public/` folder
- Create `shared/` folder

### 3. Copy server/index.ts
Open current project's `server/index.ts`, copy all content to new project

### 4. Copy server/routes.ts  
Open current project's `server/routes.ts`, copy all content to new project

### 5. Copy client/public/preview-fix.html
Open current project's `client/public/preview-fix.html`, copy all content to new project

### 6. Copy shared/schema.ts
Open current project's `shared/schema.ts`, copy all content to new project

## Step 3: Install and Start
```bash
npm install
npm run dev
```

## Step 4: Test Preview
Preview should immediately show professional dashboard without blank screen.

This minimal setup will get your application running in the new environment.

## Key Files Ready for Copy:

**Most Important:** client/public/preview-fix.html (complete working application)
**Backend Core:** server/index.ts, server/routes.ts  
**Database:** shared/schema.ts
**Config:** package.json above

The preview iframe issue should resolve immediately in fresh Replit environment.