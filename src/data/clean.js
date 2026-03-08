import fs from 'fs';

const files = ['ps3.ts', 'ps4.ts', 'ps5.ts', 'pc.ts'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/^\s*gameplayYoutubeUrl:.*$\n?/gm, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Cleaned ${file}`);
  }
});
