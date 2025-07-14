# Step-by-Step Migration Instructions

## Step 1: Download Migration Package

### Option A: Download via Replit File Manager
1. In current Replit project, navigate to `migration-export/` folder
2. Right-click on `migration-export` folder
3. Select "Download" to get a ZIP file containing all project files

### Option B: Download Individual Key Files
If bulk download isn't available, download these essential files individually:
- `migration-export/package.json`
- `migration-export/server/` (entire folder)
- `migration-export/client/` (entire folder) 
- `migration-export/shared/` (entire folder)
- `migration-export/drizzle.config.ts`
- `migration-export/.replit`
- `migration-export/database-backup.sql` (if created)

## Step 2: Create New Replit Project

1. Go to replit.com
2. Click "Create Repl"
3. Select "Node.js" template
4. Name it: "retail-restock-system-v2" or similar
5. Click "Create Repl"

## Step 3: Upload Files to New Project

### Upload Method 1: Drag & Drop
1. Extract the downloaded ZIP file on your computer
2. In new Replit project, drag the contents of `migration-export/` into the file tree
3. Confirm file structure matches original

### Upload Method 2: Manual Upload
1. Click the "+" button next to Files
2. Select "Upload file" or "Upload folder"
3. Upload each folder (server/, client/, shared/) individually
4. Upload individual files (package.json, drizzle.config.ts, etc.)

## Step 4: Install Dependencies

In the new Replit Shell, run:
```bash
npm install
```

Wait for all packages to install completely.

## Step 5: Set Up Database

### Automatic Database Creation
1. In new Replit project, Replit will automatically create a PostgreSQL database
2. The `DATABASE_URL` environment variable will be set automatically

### Import Data (if backup was created)
```bash
# If database-backup.sql was successfully created, run:
psql $DATABASE_URL < database-backup.sql
```

### Manual Data Setup (if backup failed)
```bash
# Run database migrations to create tables
npm run db:push

# Seed the database with initial data
npm run seed
```

## Step 6: Start Application

```bash
npm run dev
```

Look for these success messages:
- "Routes registered successfully"
- "Database connection successful"
- "Database storage verified - 6 users, 5 venues, 18 products found"
- "serving on port 5000"

## Step 7: Test Preview

1. Click the preview window in new Replit project
2. You should see the professional status dashboard with:
   - System status indicators (all green checkmarks)
   - "Access Application" buttons
   - Environment details at bottom

3. Click "Full Restock Application" button
4. Verify you can access the complete multi-step interface

## Step 8: Verify Core Functionality

### Test Database Connection
Visit: `https://your-new-repl-url.replit.dev/api/health`
Should return: `{"database":true,"storage":true,"apis":true,...}`

### Test User/Venue Data
Visit: `https://your-new-repl-url.replit.dev/api/users`
Should show 6 team members

Visit: `https://your-new-repl-url.replit.dev/api/venues`
Should show 5 venues

### Test Full Application
1. Access the full restock interface
2. Select a user (e.g., "Keenan Curran")
3. Select a venue (e.g., "Bru Cru")
4. Verify products load with par levels
5. Test quantity input and sales calculations

## Step 9: Environment Variables (if needed)

If you had custom environment variables in the original project:
1. Go to Secrets tab in new Replit project
2. Add any custom API keys or configuration
3. Restart the application

## Troubleshooting

### If Preview Still Shows Blank:
1. Check Shell for error messages
2. Verify all files uploaded correctly
3. Run `npm install` again
4. Try hard refresh (Ctrl+Shift+R)

### If Database Issues:
1. Check `DATABASE_URL` exists in environment
2. Run `npm run db:push` to recreate tables
3. Run `npm run seed` to add initial data

### If Missing Files:
1. Compare file structure with original project
2. Re-upload any missing folders
3. Verify package.json has all dependencies

## Expected Results

After successful migration:
- Preview window displays professional interface immediately
- All 5 venues (Bru Cru, All Sew, Golly Gosh, Kenrose Bakery, Boiler Room) accessible
- 18 products with authentic pricing from Unleashed API
- Cold brew special ordering logic working
- Automatic Unleashed order creation functional
- Mobile-responsive design working properly

## File Structure Verification

Your new project should have:
```
retail-restock-system-v2/
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── db.ts
│   └── services/unleashed.ts
├── client/
│   └── public/preview-fix.html
├── shared/
│   └── schema.ts
├── package.json
├── drizzle.config.ts
└── .replit
```

## Success Indicators

✓ Preview displays immediately without blank screen
✓ Professional status dashboard visible
✓ Full application accessible via button click
✓ All venues and products load correctly
✓ Health check returns all systems green
✓ Unleashed integration working

The migration should resolve the preview iframe issue completely while preserving all functionality.