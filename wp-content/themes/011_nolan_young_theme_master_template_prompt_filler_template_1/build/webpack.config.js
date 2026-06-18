const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
  mode: isProduction ? 'production' : 'development',
  entry: [path.resolve(__dirname, '../src/js/main.js'), path.resolve(__dirname, '../src/scss/main.scss')],
  output: {
    path: path.resolve(__dirname, '../assets/js'),
    filename: 'bundle.js',
    clean: false
  },
  devtool: isProduction ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin({ filename: '../css/bundle.css' })]
  };
};
