const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = { mode: 'production', entry: path.resolve(__dirname, '../src/js/main.js'), output: { path: path.resolve(__dirname, '../assets/js'), filename: 'bundle.js', clean: false }, module: { rules: [{ test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] }] }, plugins: [new MiniCssExtractPlugin({ filename: '../css/bundle.css' })] };
