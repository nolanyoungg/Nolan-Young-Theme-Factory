const fs=require('node:fs');
fs.copyFileSync('assets/css/site.css','assets/css/bundle.css');
fs.copyFileSync('assets/js/site.js','assets/js/bundle.js');
