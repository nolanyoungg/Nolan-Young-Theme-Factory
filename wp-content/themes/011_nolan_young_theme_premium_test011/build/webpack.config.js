const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'source-map',
    entry: path.resolve(__dirname, '../src/js/main.js'),
    output: {
      path: path.resolve(__dirname, '../assets/js'),
      filename: 'bundle.js',
      clean: false
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: !isProd }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: !isProd }
            }
          ]
        },
      ]
    },
    optimization: {
      minimize: isProd
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: '../css/bundle.css' })
    ]
  };
};
