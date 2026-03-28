const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Work around macOS Watchman permission issues by forcing Node file watching.
config.resolver = config.resolver || {};
config.resolver.useWatchman = false;

module.exports = config;
