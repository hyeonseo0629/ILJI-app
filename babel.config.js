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
      ['styled-components', { ssr: true, displayName: true, preprocess: false }],
      'react-native-reanimated/plugin'
    ]
  };
};
