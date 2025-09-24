const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

// Create a path to a single transparent PNG
const TRANSPARENT_PNG = path.resolve(__dirname, "assets/transparent.png");

// Make sure you have this file: assets/transparent.png
// You can create a 1x1 transparent PNG using ImageMagick:
// convert -size 1x1 xc:transparent assets/transparent.png

const config = getDefaultConfig(__dirname);

// Add extra extensions if needed
config.resolver.sourceExts.push("sql");
config.resolver.assetExts = [...(config.resolver.assetExts || []), "png"];

// Redirect all missing PNGs to the transparent placeholder
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (_, name) => {
      if (name.endsWith(".png")) return TRANSPARENT_PNG;
      return name;
    },
  }
);

module.exports = withNativeWind(config, { input: "./global.css" });
