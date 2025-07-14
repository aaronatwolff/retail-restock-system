#!/bin/bash
# Project Export Script for Migration

echo "Creating migration package..."

# Create export directory
mkdir -p migration-export

# Copy essential application files
cp -r server/ migration-export/
cp -r client/ migration-export/
cp -r shared/ migration-export/
cp package.json migration-export/
cp package-lock.json migration-export/
cp drizzle.config.ts migration-export/
cp tsconfig.json migration-export/
cp tailwind.config.ts migration-export/
cp postcss.config.js migration-export/
cp vite.config.ts migration-export/
cp .replit migration-export/
cp replit.md migration-export/
cp MIGRATION_GUIDE.md migration-export/

# Copy documentation
cp *.md migration-export/ 2>/dev/null || true

echo "Files copied to migration-export/"
echo "Project size: $(du -sh migration-export/ | cut -f1)"
echo "File count: $(find migration-export/ -type f | wc -l)"

# Create database export (if available)
if [ ! -z "$DATABASE_URL" ]; then
    echo "Exporting database..."
    pg_dump $DATABASE_URL > migration-export/database-backup.sql 2>/dev/null || echo "Database export failed - will need manual migration"
fi

echo "Migration package ready in migration-export/"
echo "Ready for new Replit project import"