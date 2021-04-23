const path = require('path')

module.exports = {
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@c": path.resolve(__dirname, '../components/'),
      "@lib": path.resolve(__dirname, '../lib/'),
      "@h": path.resolve(__dirname, '../hooks/'),
      "@t": path.resolve(__dirname, '../types/'),
      "@": path.resolve(__dirname, '../'),
    };
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ] 
}