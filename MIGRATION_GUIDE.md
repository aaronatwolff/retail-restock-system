# Replit Project Migration Guide

## Current Status
- Application fully functional (APIs, database, Unleashed integration working)
- Preview iframe corrupted despite comprehensive debugging attempts
- All core features operational but not visible in Replit preview

## Migration Steps

### 1. Download Project Files
Export these essential files from current project:
- `server/` directory (all backend code)
- `client/public/preview-fix.html` (working application)
- `shared/schema.ts` (database schema)
- `package.json` and `package-lock.json`
- `drizzle.config.ts`
- `replit.md` (project documentation)
- `.replit` configuration file

### 2. Create New Replit Project
1. Create new Node.js project in Replit
2. Upload all downloaded files maintaining directory structure
3. Install dependencies: `npm install`

### 3. Database Migration
Current database data (preserve these):
- 6 users (team members)
- 5 venues (Bru Cru, All Sew, Golly Gosh, Kenrose Bakery, Boiler Room)
- 18 products with authentic pricing
- 79 venue-product mappings with par levels

**Migration Command:**
```bash
# Export current database
pg_dump $DATABASE_URL > backup.sql

# In new project, import
psql $DATABASE_URL < backup.sql
```

### 4. Environment Variables to Transfer
- `DATABASE_URL` (will be auto-generated in new project)
- Unleashed API credentials (if configured)
- Any other custom environment variables

### 5. Verification Checklist
- [ ] Server starts successfully (`npm run dev`)
- [ ] Preview displays correctly in new environment
- [ ] Database connection working
- [ ] All 5 venues load with products
- [ ] Unleashed integration functional
- [ ] Health check passes (`/api/health`)

## Core Application Features to Verify

### Multi-step Restock Workflow
- Setup: User and venue selection
- Inventory: Product quantities with par levels
- Sales & Orders: Shopify pricing, WOLFF32 reorder pricing
- Complete: Unleashed order creation with RETAIL prefix

### Special Logic
- Cold brew 7081: Individual units trigger 7084 multi-pack orders when ≤1 remaining
- Pricing: Shopify AUD for sales display, WOLFF32 for reorder calculations
- Customer mapping: All venues linked to Unleashed customer codes

### Database Schema
```sql
-- Core tables to verify
SELECT COUNT(*) FROM users;      -- Should be 6
SELECT COUNT(*) FROM venues;     -- Should be 5  
SELECT COUNT(*) FROM products;   -- Should be 18
SELECT COUNT(*) FROM venue_products; -- Should be 79
```

## Advantages of Migration
- Fresh Replit environment without iframe corruption
- Clean preview window functionality
- Faster development without debugging environment issues
- Reliable deployment capabilities

## Files Already Prepared for Migration
All code is clean and ready for transfer. The application architecture is solid - only the Replit environment is problematic.

## Alternative: Export as GitHub Repo
Consider pushing to GitHub first, then importing to new Replit project for version control benefits.

---

**Recommendation**: Proceed with migration to new Replit project for immediate resolution of preview issues.