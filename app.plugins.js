module.exports = [
  "expo-router",
  [
    "expo-splash-screen",
    {
      image: "./assets/images/splash-icon.png",
      imageWidth: 200,
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      dark: {
        backgroundColor: "#000000",
      },
    },
  ],
  [
    "expo-location",
    {
      locationAlwaysAndWhenInUsePermission:
        "Allow $(PRODUCT_NAME) to use your location.",
    },
  ],
  // react-native-maps 1.20.1 (Expo SDK 54) does not ship a config plugin.
];
