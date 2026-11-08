import fs from 'fs';
import path from 'path';

try {
  const distDir = path.resolve('dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.log('dist/index.html does not exist yet');
    process.exit(0);
  }

  let html = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Find css files in dist/assets
  const assetsDir = path.join(distDir, 'assets');
  const assetFiles = fs.readdirSync(assetsDir);

  const cssFile = assetFiles.find((f) => f.endsWith('.css'));
  const jsFile = assetFiles.find((f) => f.endsWith('.js'));

  if (cssFile) {
    const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
    // Replace link rel="stylesheet"
    html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="\/assets\/[^"]*"[^>]*>/, `<style>${cssContent}</style>`);
  }

  if (jsFile) {
    const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');
    // Replace script module tag
    html = html.replace(/<script[^>]*type="module"[^>]*src="\/assets\/[^"]*"[^>]*><\/script>/, `<script type="module">${jsContent}</script>`);
  }

  // Save to public/rozana-hisaab.html so it can be downloaded directly from the server or saved
  const publicDir = path.resolve('public');
  fs.writeFileSync(path.join(publicDir, 'rozana-hisaab-mobile.html'), html);
  fs.writeFileSync(path.join(distDir, 'rozana-hisaab-mobile.html'), html);

  console.log('Successfully built single-file offline package: rozana-hisaab-mobile.html');
} catch (e) {
  console.error('Failed to bundle single-file HTML', e);
}
