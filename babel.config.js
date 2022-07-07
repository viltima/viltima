module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./app'],
          extensions: ['.jsx', '.js', '.ts', '.tsx', 'json'],
          alias: {
            app: './app',
            underscore: 'lodash'
          }
        }
      ],
      ["module:react-native-dotenv", {
        "envName": "react-native-dotenv",
        "moduleName": "@env",
        "path": ".env",
        "blocklist": null,
        "allowlist": null,
        "safe": true,
        "allowUndefined": false,
        "verbose": false
      }]
    ]
  };
};
