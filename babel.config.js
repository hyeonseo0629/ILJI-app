module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
          },
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
          ]
        }
      ],
      'react-native-reanimated/plugin',
      ['styled-components', { ssr: true, displayName: true, preprocess: false }]
    ]
  };
};
