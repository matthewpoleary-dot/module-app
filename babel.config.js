// babel.config.js (Expo SDK 54)
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // put any other plugins here (if you add them later),
      // e.g. ['module-resolver', { root: ['./'] }],
      'react-native-reanimated/plugin', // <-- MUST be last
    ],
  };
};
