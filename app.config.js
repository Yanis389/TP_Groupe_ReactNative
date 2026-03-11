require("dotenv/config");

const appJson = require("./app.json");
const plugins = require("./app.plugins");

module.exports = ({ config }) => {
  const base = appJson.expo ?? appJson;
  const googleMapsApiKey = process.env.API_KEY_GOOGLE;

  return {
    ...base,
    ...config,
    android: {
      ...base.android,
      ...config.android,
      config: {
        ...base.android?.config,
        ...config.android?.config,
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
    ios: {
      ...base.ios,
      ...config.ios,
      config: {
        ...base.ios?.config,
        ...config.ios?.config,
        googleMapsApiKey,
      },
    },
    plugins,
  };
};
