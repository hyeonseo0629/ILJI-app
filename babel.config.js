module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // reanimated 플러그인을 다시 추가합니다.
      "react-native-reanimated/plugin",
    ],
  };
};
