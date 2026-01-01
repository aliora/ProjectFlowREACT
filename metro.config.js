// Polyfill for Node 18 compatibility with Expo SDK 54
console.log('Loading metro.config.js and applying polyfill...');
if (!Array.prototype.toReversed) {
    Object.defineProperty(Array.prototype, 'toReversed', {
        value: function () {
            return this.slice().reverse();
        },
        configurable: true,
        writable: true,
    });
}

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
