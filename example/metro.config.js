/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
var path = require("path");

function getWatchFolders() {
    return [path.resolve(__dirname, "..")];
}

module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false
            }
        })
    },
    watchFolders: getWatchFolders()
};
