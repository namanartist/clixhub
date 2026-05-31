const fs = require('fs');
const path = require('path');
function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix trailing slash on bg colors
      content = content.replace(/bg-([a-z0-9-]+)\/([^0-9a-zA-Z]|$)/g, 'bg-$1/10$2');
      
      // Fix missing closing quote before closing brace for known color classes
      // e.g. : 'bg-slate-50}  => : 'bg-slate-50'}
      content = content.replace(/:\s*'([^']*)'([^']*)}/g, (match, p1, p2) => {
          if (!p2.includes("'") && !match.includes("}")) {
              // Not a great regex, let's just do targeted fixes
          }
          return match;
      });
      
      // Targeted missing quotes fix
      // 'bg-slate-50} -> 'bg-slate-50'}
      content = content.replace(/bg-([a-z0-9-]+)}/g, 'bg-$1\'}');
      
      // 'bg-white} -> 'bg-white'}
      content = content.replace(/bg-white}/g, 'bg-white\'}');
      
      // 'bg-white/10} -> 'bg-white/10'}
      content = content.replace(/bg-white\/10}/g, 'bg-white/10\'}');
      
      // bg-slate-950border-slate-800 -> bg-slate-950/10 border-slate-800
      content = content.replace(/([a-z0-9])border-slate/g, '$1 border-slate');
      content = content.replace(/([a-z0-9])shadow-/g, '$1 shadow-');

      // 'bg-slate-50border-slate-100' -> 'bg-slate-50/10 border-slate-100'

      // Actually, a lot of bg-slate-50border happened because 'bg-slate-50 border' was replaced by something else? 
      // bg-slate-50 border -> bg-slate-50border? No, bg-slate-50 ' was replaced by something.
      
      // Let's just fix the unterminated string literals specifically:
      // text-[#1B2559]'} -> is correct.
      // What if it is: 'bg-white/40 border-slate-100} -> 'bg-white/40 border-slate-100'}
      content = content.replace(/([a-z0-9-]+)\s*}/g, (match, p1, offset, string) => {
          // check if we are inside a template literal that opened a single quote
          // It's too complex.
          return match;
      });

      // Simple fix: any class string missing a quote
      content = content.replace(/(\?|:)\s*'([^']{2,40})}/g, "$1 '$2'}");

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}
processDir('c:/Users/naman/Downloads/mits-club-management-system-(ccms) (8)/mits-club-management-system-(ccms) (7)/components');
console.log('Fixed syntax errors');
