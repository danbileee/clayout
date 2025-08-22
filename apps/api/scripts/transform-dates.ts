import * as fs from 'fs';
import * as path from 'path';

// Define which columns should be converted from string to Date for each table
const DATE_COLUMNS = {
  sites: ['createdAt', 'updatedAt', 'lastPublishedAt'],
  users: ['createdAt', 'updatedAt'],
  counters: ['createdAt', 'updatedAt'],
  emails: ['createdAt', 'updatedAt', 'failedAt', 'sentAt'],
  email_click_events: ['createdAt', 'updatedAt', 'clickedAt'],
  email_open_events: ['createdAt', 'updatedAt', 'openedAt'],
  site_pages: ['createdAt', 'updatedAt'],
  site_blocks: ['createdAt', 'updatedAt'],
  site_domains: ['createdAt', 'updatedAt'],
  site_releases: ['createdAt', 'updatedAt'],
};

function transformDateTypes(content: string): string {
  let transformed = content;

  // Replace date column types from string to Date
  Object.entries(DATE_COLUMNS).forEach(([tableName, columns]) => {
    columns.forEach((column) => {
      // Replace in Row type
      const rowPattern = new RegExp(
        `(\\s*${column}:\\s*)string(\\s*\\|\\s*null)?(\\s*,?)`,
        'g',
      );
      transformed = transformed.replace(rowPattern, `$1Date$2$3`);

      // Replace in Insert type
      const insertPattern = new RegExp(
        `(\\s*${column}\\?\\s*:\\s*)string(\\s*\\|\\s*null)?(\\s*,?)`,
        'g',
      );
      transformed = transformed.replace(insertPattern, `$1Date$2$3`);

      // Replace in Update type
      const updatePattern = new RegExp(
        `(\\s*${column}\\?\\s*:\\s*)string(\\s*\\|\\s*null)?(\\s*,?)`,
        'g',
      );
      transformed = transformed.replace(updatePattern, `$1Date$2$3`);
    });
  });

  return transformed;
}

function main() {
  try {
    const filePath = path.join(
      __dirname,
      '../../../packages/interface/src/types/supabase/supabase.type.ts',
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(
        '❌ supabase.type.ts file not found. Please run "supabase gen types typescript --local" first.',
      );
      process.exit(1);
    }

    console.log('🔄 Reading supabase.type.ts...');
    const content = fs.readFileSync(filePath, 'utf8');

    console.log('🔄 Transforming date types...');
    const transformed = transformDateTypes(content);

    console.log('💾 Writing transformed file...');
    fs.writeFileSync(filePath, transformed);

    console.log('✅ Successfully transformed date types in supabase.type.ts');
    console.log('📝 Date columns now use Date type instead of string');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
