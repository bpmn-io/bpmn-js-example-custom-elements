import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  app: [
    'app/**/*.js'
  ],
  ignored: [
    'public'
  ],
  webpack: [
    'webpack.config.js'
  ]
};

export default [
  {
    ignores: files.ignored
  },
  ...bpmnIoPlugin.configs.browser.map(config => ({
    ...config,
    files: files.app
  })),
  ...bpmnIoPlugin.configs.node.map(config => ({
    ...config,
    files: files.webpack,
    languageOptions: {
      ...config.languageOptions,
      sourceType: 'commonjs'
    }
  }))
];
