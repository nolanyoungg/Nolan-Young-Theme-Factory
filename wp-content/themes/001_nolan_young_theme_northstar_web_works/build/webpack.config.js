const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src/js/main.js'),
  output: {
    path: path.resolve(__dirname, '../assets/js'),
    filename: 'bundle.js',
  },
};

