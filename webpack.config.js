const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: 'markdownItImageLightbox',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this',
    clean: true
  },
  externals: {
    'markdown-it': {
      commonjs: 'markdown-it',
      commonjs2: 'markdown-it',
      amd: 'markdown-it',
      root: 'markdownit'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
};