import * as fs from 'fs';
import * as path from 'path';

// Define which columns should be converted from string to Date for each table
// Support both snake_case and camelCase formats
const DATE_COLUMNS = {
  sites: [
    'created_at',
    'updated_at',
    'last_published_at',
    'createdAt',
    'updatedAt',
    'lastPublishedAt',
  ],
  users: ['created_at', 'updated_at', 'createdAt', 'updatedAt'],
  counters: ['created_at', 'updated_at', 'createdAt', 'updatedAt'],
  emails: [
    'created_at',
    'updated_at',
    'failed_at',
    'sent_at',
    'createdAt',
    'updatedAt',
    'failedAt',
    'sentAt',
  ],
  email_click_events: [
    'created_at',
    'updated_at',
    'clicked_at',
    'createdAt',
    'updatedAt',
    'clickedAt',
  ],
  email_open_events: [
    'created_at',
    'updated_at',
    'opened_at',
    'createdAt',
    'updatedAt',
    'openedAt',
  ],
  site_pages: ['created_at', 'updated_at', 'createdAt', 'updatedAt'],
  site_blocks: ['created_at', 'updated_at', 'createdAt', 'updatedAt'],
  site_domains: ['created_at', 'updated_at', 'createdAt', 'updatedAt'],
  site_releases: ['created_at', 'updated_at', 'createdAt', 'updatedAt'],
  assets: ['created_at', 'updated_at', 'createdAt', 'updatedAt'],
};

// Helper function to convert snake_case to camelCase
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

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

function makeRequiredColumns(content: string): string {
  let transformed = content;

  // Make BaseEntity columns required in Insert types
  // Support both snake_case and camelCase
  const insertRequiredColumns = [
    'id',
    'created_at',
    'updated_at',
    'createdAt',
    'updatedAt',
  ];

  // Make required in Insert type (remove the ?)
  insertRequiredColumns.forEach((column) => {
    // More specific pattern to target only Insert sections
    const insertPattern = new RegExp(
      `(\\s*Insert:\\s*{[^}]*?)(\\s*)${column}\\?\\s*:\\s*(Date|number)(\\s*\\|\\s*null)?(\\s*,?)`,
      'g',
    );
    transformed = transformed.replace(insertPattern, `$1$2${column}: $3$4$5`);
  });

  // Make only id required in Update type, keep createdAt and updatedAt optional
  const updateRequiredColumns = ['id'];
  updateRequiredColumns.forEach((column) => {
    // More specific pattern to target only Update sections
    const updatePattern = new RegExp(
      `(\\s*Update:\\s*{[^}]*?)(\\s*)${column}\\?\\s*:\\s*(Date|number)(\\s*\\|\\s*null)?(\\s*,?)`,
      'g',
    );
    transformed = transformed.replace(updatePattern, `$1$2${column}: $3$4$5`);
  });

  return transformed;
}

function convertSnakeCaseToCamelCase(content: string): string {
  let transformed = content;

  // Convert all snake_case column names to camelCase in the generated types
  // This regex matches snake_case column names in the type definitions
  const snakeCasePattern =
    /(\s*)([a-z_]+):\s*(Date|number|string|boolean|Json|Database\["public"\]\["Enums"\]\["[^"]+"\])(\s*\|\s*null)?(\s*,?)/g;

  transformed = transformed.replace(
    snakeCasePattern,
    (match, spaces, columnName, type, nullable, comma) => {
      // Skip if it's already camelCase or if it's a special case
      if (!columnName.includes('_') || columnName === 'id') {
        return match;
      }
      const camelCaseName = snakeToCamel(columnName);
      return `${spaces}${camelCaseName}: ${type}${nullable || ''}${comma}`;
    },
  );

  // Also convert in the Insert and Update types
  const insertUpdatePattern =
    /(\s*)([a-z_]+)(\?)?\s*:\s*(Date|number|string|boolean|Json|Database\["public"\]\["Enums"\]\["[^"]+"\])(\s*\|\s*null)?(\s*,?)/g;

  transformed = transformed.replace(
    insertUpdatePattern,
    (match, spaces, columnName, optional, type, nullable, comma) => {
      // Skip if it's already camelCase or if it's a special case
      if (!columnName.includes('_') || columnName === 'id') {
        return match;
      }
      const camelCaseName = snakeToCamel(columnName);
      return `${spaces}${camelCaseName}${optional || ''}: ${type}${nullable || ''}${comma}`;
    },
  );

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
    let transformed = transformDateTypes(content);

    console.log('🔄 Converting snake_case to camelCase...');
    transformed = convertSnakeCaseToCamelCase(transformed);

    console.log('🔄 Making BaseEntity columns required...');
    transformed = makeRequiredColumns(transformed);

    console.log('💾 Writing transformed file...');
    fs.writeFileSync(filePath, transformed);

    console.log('✅ Successfully transformed supabase.type.ts');
    console.log('📝 Column names converted from snake_case to camelCase');
    console.log('📝 Date columns now use Date type instead of string');
    console.log(
      '📝 BaseEntity columns (id, createdAt, updatedAt) are required in Insert types, only id is required in Update types',
    );
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
