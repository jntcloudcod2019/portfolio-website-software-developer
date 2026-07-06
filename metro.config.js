const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.experimentalImportBundleSupport = true;

module.exports = withNativeWind(config, { input: './global.css' });
