const path = require('path')

module.exports = {
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              ident: 'postcss',
              plugins: [
                require('postcss-import'),
                require('tailwindcss'),
                require('postcss-nested'), // or require('postcss-nesting')
                require('autoprefixer'),
              ],
            },
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
      "@v": path.resolve(__dirname, "../views/"),
      '@': path.resolve(__dirname, '../'),
    }
    config.resolve.extensions.push('.ts', '.tsx')
    return config
  },
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', 'storybook-css-modules-preset', 'storybook-dark-mode'],
}
