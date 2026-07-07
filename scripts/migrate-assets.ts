/**
 * JMC Assets Migration Script
 * Reads images and pdfs from public/assets/ and uploads them to the Supabase "media" bucket,
 * and inserts rows into the media_assets table.
 *
 * Run with:
 *   npx dotenv -e .env -- npx tsx scripts/migrate-assets.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg':
    case '.jfif': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.pdf': return 'application/pdf';
    default: return 'application/octet-stream';
  }
}

async function uploadDirectory(dirName: string, assetType: 'image' | 'document') {
  const fullPath = path.join(ROOT, 'public/assets', dirName);
  console.log(`\n📂  Scanning directory: ${fullPath}`);

  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  Directory not found: ${fullPath}`);
    return;
  }

  // Recursive directory read
  function getFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getFiles(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    }
    return fileList;
  }

  const files = getFiles(fullPath);

  for (const filePath of files) {
    const relativePath = path.relative(path.join(ROOT, 'public/assets'), filePath);
    // Replace Windows backslashes with forward slashes for the bucket path
    const bucketPath = relativePath.split(path.sep).join('/');
    const fileName = path.basename(filePath);
    
    console.log(`  ⏳  Uploading ${bucketPath}...`);

    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = getMimeType(fileName);

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(bucketPath, fileBuffer, {
        contentType: mimeType,
        upsert: true
      });

    if (uploadError) {
      console.error(`  ❌  Failed to upload ${bucketPath}: ${uploadError.message}`);
      continue;
    }

    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(bucketPath);

    const publicUrl = publicUrlData.publicUrl;

    const { data: existing } = await supabase
      .from('media_assets')
      .select('id')
      .eq('name', fileName)
      .eq('type', assetType)
      .maybeSingle();

    if (!existing) {
      const { error: dbError } = await supabase
        .from('media_assets')
        .insert({ 
          name: fileName,
          url: publicUrl,
          type: assetType
        });

      if (dbError) {
        console.error(`  ❌  Failed to insert DB record for ${bucketPath}: ${dbError.message}`);
      } else {
        console.log(`  ✅  Migrated ${bucketPath}`);
      }
    } else {
      console.log(`  ✅  Already in DB: ${bucketPath}`);
    }
  }
}

(async () => {
  console.log('🚀  JMC Assets Migration');
  console.log(`    Supabase: ${supabaseUrl}`);

  await uploadDirectory('images', 'image');
  await uploadDirectory('pdfs', 'document');

  console.log('\n🎉  Assets Migration complete!\n');
})();
