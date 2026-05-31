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
      
      content = content.replace(/bg-white\/ /g, 'bg-white/10 ');
      content = content.replace(/bg-white\/'/g, 'bg-white/10\'');
      content = content.replace(/bg-whiteborder/g, 'bg-white/40 border');
      content = content.replace(/bg-white\"/g, 'bg-white/40\"');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}
processDir('c:/Users/naman/Downloads/mits-club-management-system-(ccms) (8)/mits-club-management-system-(ccms) (7)/components');
console.log('Fixed broken bg-white replacements');
