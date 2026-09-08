// Wraps the quote into a standalone page for almajaltech.com, adds the
// download strip and the related-links footer, and copies the PDFs beside it.
// Run from the quotes/ directory:  node build-site-page.mjs
import fs from 'fs';
import path from 'path';

const SITE = '/home/user/almajaltech-website';
const SLUG = 'q/spanish-school-2026-012-k7m3';
const OUT = path.join(SITE, SLUG);

const PDFS = [
  ['almajaltech-Q-2026-012-spanish-school-jeddah.pdf', 'النسخة الفاتحة', 'للطباعة والأرشفة'],
  ['almajaltech-Q-2026-012-spanish-school-jeddah-dark.pdf', 'النسخة الغامقة', 'للعرض على الشاشة'],
];

const LINKS = [
  ['/guarantee', 'ضمان الاسترجاع الذهبي', 'كيف نضمن حقكم إن لم تُنفَّذ الالتزامات'],
  ['/portfolio', 'أعمالنا', 'مشاريع سابقة بنفس التقنيات'],
  ['/services', 'الخدمات', 'نطاق ما ننفّذه بالتفصيل'],
  ['/faq', 'الأسئلة الشائعة', 'إجابات على ما يتكرر قبل التعاقد'],
  ['/terms', 'الشروط والأحكام', 'الإطار النظامي للتعامل'],
  ['/about', 'من نحن', 'عن المجال التقني وفريقه'],
  ['/contact', 'تواصل معنا', 'للاجتماع أو أي استفسار'],
];

const EXTRA_CSS = `
  /* ---------- site-only: downloads + related links ---------- */
  .dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1px;
    background: var(--line-hard);
    border: 1px solid var(--line-hard);
    border-top: 0;
    margin-bottom: 44px;
  }
  .dl a {
    background: var(--surface);
    padding: 16px 20px;
    text-decoration: none;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background .15s;
  }
  .dl a:hover { background: var(--brand-soft); }
  .dl .ic {
    width: 34px; height: 34px; flex: none;
    display: grid; place-items: center;
    border: 1px solid var(--line-hard);
    color: var(--brand-ink);
    font-family: var(--f-mono);
    font-size: 10px;
    letter-spacing: .04em;
  }
  .dl b { display: block; font-family: var(--f-display); font-weight: 700; font-size: 14px; }
  .dl small { display: block; font-size: 12px; color: var(--muted); }

  .rel { margin-top: 44px; }
  .rel h3 {
    font-family: var(--f-display); font-weight: 700; font-size: 16px;
    border-bottom: 2px solid var(--ink); padding-bottom: 8px; margin-bottom: 16px;
  }
  .rel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; }
  .rel-grid a {
    border: 1px solid var(--line);
    background: var(--surface);
    padding: 13px 16px;
    text-decoration: none;
    display: block;
    transition: border-color .15s, background .15s;
  }
  .rel-grid a:hover { border-color: var(--brand); background: var(--brand-soft); }
  .rel-grid b { display: block; font-family: var(--f-display); font-weight: 700; font-size: 14px; color: var(--ink); }
  .rel-grid small { display: block; font-size: 12.5px; color: var(--muted); margin-top: 2px; }
  .rel .home {
    margin-top: 16px; font-size: 13px; color: var(--muted);
    display: flex; flex-wrap: wrap; gap: 6px 18px;
  }
  .rel .home a { color: var(--brand-ink); }
`;

const dlStrip = `
  <div class="dl">
${PDFS.map(([f, t, s]) => `    <a href="${f}" download><span class="ic">PDF</span><span><b>${t}</b><small>${s}</small></span></a>`).join('\n')}
  </div>`;

const relBlock = `
  <section class="rel">
    <h3>روابط ذات صلة</h3>
    <div class="rel-grid">
${LINKS.map(([h, t, s]) => `      <a href="${h}"><b>${t}</b><small>${s}</small></a>`).join('\n')}
    </div>
    <div class="home">
      <a href="/">almajaltech.com</a>
      <span>info@almajaltech.com</span>
      <span dir="ltr">+966 55 992 1989</span>
    </div>
  </section>`;

let body = fs.readFileSync('spanish-school-jeddah.html', 'utf8');
const title = body.match(/<title>([^<]*)<\/title>/)[1];
body = body.replace(/<title>[^<]*<\/title>\s*/, '');
body = body.replace('</style>', EXTRA_CSS + '\n</style>');
// downloads sit right under the headline figures; related links close the page
body = body.replace('  <div class="vat">', dlStrip + '\n\n  <div class="vat">');
body = body.replace(/(\n<\/div>\s*)$/, relBlock + '\n\n</div>\n');

const page = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- عرض سعر خاص بعميل: لا يُفهرس ولا يُؤرشف -->
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<title>${title} · المجال التقني</title>
<meta name="description" content="عرض فني ومالي من المجال التقني للمدرسة الإسبانية بجدة — Q-2026-012.">
<link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
<style>*{margin:0;padding:0;box-sizing:border-box}img{max-width:100%}[hidden]{display:none!important}</style>
${body}
</body>
</html>
`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), page);
for (const [f] of PDFS) fs.copyFileSync(f, path.join(OUT, f));

console.log('page  ->', path.join(SLUG, 'index.html'), (page.length / 1024 | 0) + ' KB');
for (const [f] of PDFS) console.log('pdf   ->', path.join(SLUG, f));
console.log('url   -> https://almajaltech.com/' + SLUG + '/');
