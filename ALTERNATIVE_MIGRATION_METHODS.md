# Alternative Migration Methods (No Download Required)

## Method 1: GitHub Transfer (Recommended)

### Step 1: Create GitHub Repository from Current Project
1. In current Replit project, click the version control icon (Git tab)
2. Click "Create a Git Repository" 
3. Connect to GitHub and create new repository
4. Push all files to GitHub

### Step 2: Import from GitHub to New Replit
1. Create new Replit project
2. Select "Import from GitHub"
3. Choose your newly created repository
4. All files transfer automatically

## Method 2: Copy-Paste Key Files

### Essential Files to Recreate Manually:

**package.json** - Copy this content to new project:
```json
{
  "name": "retail-restock",
  "version": "1.0.0",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "start": "node dist/index.js",
    "db:push": "drizzle-kit push",
    "seed": "tsx server/seed.ts"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.9.4",
    "drizzle-orm": "^0.33.0",
    "drizzle-zod": "^0.5.1",
    "express": "^4.19.2",
    "tsx": "^4.16.2",
    "typescript": "^5.5.4",
    "zod": "^3.23.8"
  }
}
```

### Key Directories to Recreate:
1. Create `server/` folder
2. Create `client/public/` folder  
3. Create `shared/` folder

## Method 3: Manual File Export

### Export Individual Files:
1. Open each file in current Replit
2. Select All (Ctrl+A) and Copy (Ctrl+C)
3. Create same file in new project
4. Paste content

### Priority Order:
1. `package.json`
2. `server/index.ts`
3. `server/routes.ts` 
4. `client/public/preview-fix.html`
5. `shared/schema.ts`

## Method 4: ZIP Creation Script

Run this in your current project to create downloadable archive:

```bash
# Create zip file
zip -r project-backup.zip server/ client/ shared/ package.json drizzle.config.ts .replit

# This creates project-backup.zip you can download
```

## Method 5: Cloud Storage Transfer

### Using Replit's built-in integration:
1. Connect Google Drive or Dropbox to Replit
2. Upload key files to cloud storage
3. Download from cloud to your computer
4. Upload to new Replit project

## Simplified New Project Setup

### If manual transfer, create this minimal structure:

```
new-project/
├── package.json (copy content above)
├── server/
│   ├── index.ts (copy from current)
│   └── routes.ts (copy from current)
├── client/public/
│   └── preview-fix.html (copy from current)
└── shared/
    └── schema.ts (copy from current)
```

### Then run:
```bash
npm install
npm run dev
```

## Database Migration Without File Export

The database can be recreated easily:

```bash
# In new project after npm install
npm run db:push  # Creates tables
npm run seed     # Adds all venue/product data
```

This recreates your 6 users, 5 venues, and 18 products with authentic data.

## Quick Test Method

1. Create new Replit Node.js project
2. Copy just these 3 files manually:
   - `package.json`
   - `server/index.ts` 
   - `client/public/preview-fix.html`
3. Run `npm install && npm run dev`
4. If preview works, continue copying remaining files

The preview iframe issue should be resolved immediately in the new environment.