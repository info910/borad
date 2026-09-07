import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const SC = '/tmp/claude-0/-home-user-borad/fc39655e-b796-5e21-9fff-baca10337414/scratchpad';
const Q  = '/home/user/borad/quotes/';

// Chromium renders header/footer as their own document — it never sees the page's
// styles, so the footer needs its own copy of the face or it falls back to a
// system font (which is what pdffonts kept flagging).
const inter = fs.readFileSync('/home/user/almajaltech-website/fonts/Inter-latin-400.woff2').toString('base64');

const footer = (ink, dim) => `
<style>
@font-face{font-family:'Inter';font-style:normal;font-weight:400;
  src:url(data:font/woff2;base64,${inter}) format('woff2');}
</style>
<div style="width:100%;font-family:'Inter',sans-serif;font-size:7.5pt;
     color:${dim};padding:0 11mm;display:flex;justify-content:space-between;
     align-items:center;direction:ltr;-webkit-print-color-adjust:exact;">
  <span>Q-2026-012</span>
  <span style="color:${ink}">almajaltech.com</span>
  <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
</div>`;

function wrap(theme) {
  const body = fs.readFileSync(Q + 'spanish-school-jeddah.html', 'utf8');
  const out = `${SC}/pdf-${theme}.html`;
  fs.writeFileSync(out, `<!doctype html><html lang="ar" dir="rtl" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box}body{font:14px system-ui;margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>${body}</body></html>`);
  return 'file://' + out;
}

const b = await chromium.launch();
for (const [theme, suffix, ink, dim] of [
  ['light', '',      '#5A6B80', '#8A94A3'],
  ['dark',  '-dark', '#9AA9BF', '#6E7C90'],
]) {
  const p = await b.newPage();
  await p.goto(wrap(theme), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(900);
  const path = `${Q}almajaltech-Q-2026-012-spanish-school-jeddah${suffix}.pdf`;
  await p.pdf({
    path, format: 'A4', printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: footer(ink, dim),
    margin: { top: '13mm', bottom: '15mm', left: '11mm', right: '11mm' },
  });
  await p.close();
  console.log(theme, '->', path.split('/').pop());
}
await b.close();
