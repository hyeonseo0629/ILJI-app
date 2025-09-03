module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // react-native-reanimated 플러그인을 추가합니다.
      "react-native-reanimated/plugin",
    ],
  };
};
