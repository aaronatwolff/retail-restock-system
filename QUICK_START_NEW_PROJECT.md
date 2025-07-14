# Quick Start for New Replit Project

## Essential Files Priority Order

**Must Transfer First (Core Functionality):**
1. `package.json` - Dependencies and scripts
2. `server/` folder - Complete backend
3. `client/public/preview-fix.html` - Working application
4. `shared/schema.ts` - Database structure
5. `drizzle.config.ts` - Database configuration

**Transfer Second (Configuration):**
6. `.replit` - Project configuration
7. `tsconfig.json` - TypeScript settings
8. `vite.config.ts` - Build configuration

**Transfer Last (Documentation):**
9. `replit.md` - Project documentation
10. `MIGRATION_GUIDE.md` - Reference

## Minimal Working Setup

If time-constrained, upload just these 5 files for immediate functionality:

1. **package.json**
2. **server/** (entire folder)
3. **client/public/preview-fix.html**
4. **shared/schema.ts**
5. **drizzle.config.ts**

Then run:
```bash
npm install
npm run dev
```

## Database Quick Setup

If backup import fails, recreate data quickly:

```bash
# Create tables
npm run db:push

# Add essential data via API
curl -X POST https://your-repl.replit.dev/api/users -H "Content-Type: application/json" -d '{"name":"Keenan Curran","username":"keenan"}'
```

## Verification in 2 Minutes

1. **Upload core files** (2-3 minutes)
2. **Run npm install** (1-2 minutes)
3. **Start application** (`npm run dev`)
4. **Check preview** - Should see status dashboard immediately
5. **Click "Full Application"** - Complete interface should load

## Success = Working Preview

The key indicator of successful migration is the preview window displaying content immediately without the blank screen issue.

## Emergency Fallback

If migration has issues, the original project server is still functional at the API level. The application can be accessed directly at specific routes while troubleshooting the new environment.