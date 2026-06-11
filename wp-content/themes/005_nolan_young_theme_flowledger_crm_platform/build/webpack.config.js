const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
fs.mkdirSync(path.join(root, 'assets/css'), { recursive: true });
fs.mkdirSync(path.join(root, 'assets/js'), { recursive: true });
fs.copyFileSync(path.join(root, 'src/scss/main.scss'), path.join(root, 'assets/css/bundle.css'));
fs.copyFileSync(path.join(root, 'src/js/main.js'), path.join(root, 'assets/js/bundle.js'));
console.log('Built generated compiled assets.');

