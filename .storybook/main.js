const path = require('path')

module.exports = {
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\,css&/,
      use: [
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [require('tailwindcss'), require('autoprefixer')],
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    })
    config.module.rules.push({
      test: /\.less$/,
      loaders: [
        'style-loader',
        'css-loader',
        // https://github.com/SolidZORO/next-plugin-antd-less/issues/30
        {
          loader: 'less-loader', // should not be ^8.0.0
          options: {
            lessOptions: { javascriptEnabled: true },
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    })
    config.resolve.alias = {
      ...config.resolve.alias,
      '@c': path.resolve(__dirname, '../components/'),
      '@lib': path.resolve(__dirname, '../lib/'),
      '@h': path.resolve(__dirname, '../hooks/'),
      '@t': path.resolve(__dirname, '../types/'),
      '@': path.resolve(__dirname, '../'),
    }
    config.resolve.extensions.push('.ts', '.tsx')
    return config
  },
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
}
