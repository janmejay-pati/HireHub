import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const port = process.env.PORT || '4173';
const base = `http://127.0.0.1:${port}`;
const pages = [
  '/recruiter/applicants',
  '/recruiter/candidates',
  '/recruiter/interviews',
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const outDir = path.resolve('scripts', 'snapshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const route of pages) {
    const url = `${base}${route}`;
    console.log('Capturing', url);
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(outDir, `${route.replace(/\//g, '_')}.png`), fullPage: true });
      console.log('Saved snapshot for', route);
    } catch (err) {
      console.error('Failed to capture', route, err.message);
    }
  }

  await browser.close();
  console.log('Visual regression snapshots complete.');
})();
