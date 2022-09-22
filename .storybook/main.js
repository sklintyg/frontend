module.exports = {
  stories: ['../packages/*/src/**/*.stories.mdx', '../packages/*/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/preset-scss'],
  framework: '@storybook/react',
  webpackFinal: async (config, { configType }) => {
    config.node = {
      ...config.node,
      fs: 'empty',
      assert: false,
      buffer: false,
      constants: false,
      crypto: false,
      domain: false,
      events: false,
      http: false,
      https: false,
      os: false,
      path: 'empty',
      punycode: false,
      process: false,
      querystring: false,
      stream: false,
      string_decoder: false,
      sys: false,
      timers: false,
      tty: false,
      url: false,
      util: false,
      vm: false,
      zlib: false,
    }

    return config
  },
}
