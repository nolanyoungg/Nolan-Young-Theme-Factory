const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class RemoveProductionMapsPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('RemoveProductionMapsPlugin', () => {
      if (compiler.options.mode !== 'production') {
        return;
      }

      [
        path.resolve(__dirname, '../assets/js/bundle.js.map'),
        path.resolve(__dirname, '../assets/css/bundle.css.map')
      ].forEach((mapPath) => {
        if (fs.existsSync(mapPath)) {
          fs.rmSync(mapPath);
        }
      });
    });
  }
}

module.exports = (env, argv) => ({
  mode: argv.mode || 'production',
  devtool: argv.mode === 'development' ? 'source-map' : false,
  entry: path.resolve(__dirname, '../src/js/main.js'),
  output: {
    path: path.resolve(__dirname, '../assets/js'),
    filename: 'bundle.js',
    clean: false
  },
  watchOptions: {
    ignored: ['**/node_modules/**', '**/.git/**'],
    poll: 1000
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '../css/bundle.css' }),
    new RemoveProductionMapsPlugin()
  ]
});
