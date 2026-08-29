import fs from 'fs';
import path from 'path';

const root = path.resolve('src');
const exts = ['.jsx', '.js', '.tsx', '.ts'];

const replacements = [
  { from: /bg-gradient-to-br/g, to: 'bg-linear-to-br' },
  { from: /bg-gradient-to-r/g, to: 'bg-linear-to-r' },
  { from: /rounded-\[2\.8rem\]/g, to: 'rounded-5xl' },
  { from: /rounded-\[2\.5rem\]/g, to: 'rounded-3xl' },
  { from: /rounded-\[2rem\]/g, to: 'rounded-4xl' },
  { from: /rounded-\[2\.4rem\]/g, to: 'rounded-3xl' },
  { from: /rounded-\[2\.2rem\]/g, to: 'rounded-3xl' },
  { from: /rounded-\[1\.4rem\]/g, to: 'rounded-xl' },
  { from: /rounded-\[1\.2rem\]/g, to: 'rounded-xl' },
  { from: /rounded-\[1\.1rem\]/g, to: 'rounded-xl' },
  { from: /rounded-\[40px\]/g, to: 'rounded-3xl' },
  { from: /rounded-\[30px\]/g, to: 'rounded-2xl' },
  { from: /rounded-\[22px\]/g, to: 'rounded-xl' },
  // More aggressive normalizations
  { from: /bg-gradient-to-bl/g, to: 'bg-linear-to-bl' },
  { from: /bg-gradient-to-b/g, to: 'bg-linear-to-b' },
  { from: /bg-gradient-to-t/g, to: 'bg-linear-to-t' },
  { from: /bg-gradient-to-tr/g, to: 'bg-linear-to-tr' },
  { from: /bg-gradient-to-l/g, to: 'bg-linear-to-l' },
  { from: /rounded-\[1rem\]/g, to: 'rounded-lg' },
  { from: /rounded-\[28px\]/g, to: 'rounded-3xl' },
  { from: /rounded-\[32px\]/g, to: 'rounded-4xl' },
  { from: /rounded-r-\[32px\]/g, to: 'rounded-r-4xl' },
  { from: /rounded-\[0\.5rem\]/g, to: 'rounded-sm' },
  { from: /rounded-\[12px\]/g, to: 'rounded-md' },
  { from: /rounded-\[10px\]/g, to: 'rounded-md' },
  { from: /rounded-\[8px\]/g, to: 'rounded-sm' },
  { from: /rounded-\[6px\]/g, to: 'rounded-sm' },
  { from: /rounded-\[2px\]/g, to: 'rounded-sm' },
  { from: /text-\[14px\]/g, to: 'text-sm' },
  { from: /text-\[13px\]/g, to: 'text-sm' },
  { from: /text-\[12px\]/g, to: 'text-xs' },
  { from: /leading-\[18px\]/g, to: 'leading-5' },
  { from: /leading-\[20px\]/g, to: 'leading-6' },
  { from: /p-\[10px\]/g, to: 'p-2' },
  { from: /m-\[10px\]/g, to: 'm-2' },
  { from: /w-\[100%\]/g, to: 'w-full' },
  { from: /h-\[100%\]/g, to: 'h-full' },
  { from: /h-\[350px\]/g, to: 'h-87.5' },
  { from: /h-\[340px\]/g, to: 'h-85' },
  { from: /h-\[320px\]/g, to: 'h-80' },
  { from: /h-\[300px\]/g, to: 'h-75' },
  { from: /h-\[450px\]/g, to: 'h-112.5' },
  { from: /h-\[500px\]/g, to: 'h-125' },
  { from: /h-\[650px\]/g, to: 'h-162.5' },
  { from: /w-\[820px\]/g, to: 'w-205' },
  { from: /w-\[360px\]/g, to: 'w-90' },
  { from: /w-\[340px\]/g, to: 'w-85' },
  { from: /w-\[300px\]/g, to: 'w-75' },
  { from: /w-\[450px\]/g, to: 'w-112.5' },
  { from: /w-\[500px\]/g, to: 'w-125' },
  { from: /max-w-\[1600px\]/g, to: 'max-w-400' },
  { from: /max-h-\[320px\]/g, to: 'max-h-80' },
  { from: /bg-\[var\(--bg\)\]/g, to: 'bg-(--bg)' },
  { from: /bg-\[var\(--surface\)\]/g, to: 'bg-(--surface)' },
  { from: /text-\[var\(--text\)\]/g, to: 'text-(--text)' },
  { from: /text-\[var\(--muted\)\]/g, to: 'text-(--muted)' },
  { from: /hover:bg-\[var\(--surface-strong\)\]/g, to: 'hover:bg-(--surface-strong)' },
  { from: /border-\[var\(--border\)\]/g, to: 'border-(--border)' },
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!exts.includes(path.extname(entry.name))) continue;
    let code = fs.readFileSync(full, 'utf8');
    let changed = false;
    for (const r of replacements) {
      if (r.from.test(code)) {
        code = code.replace(r.from, r.to);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(full, code, 'utf8');
      console.log('Patched', full);
    }
  }
}

walk(root);
console.log('Normalization complete.');
