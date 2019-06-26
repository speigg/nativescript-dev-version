const fs = require('fs');
const Promise = require('bluebird');
const AndroidManifest = require('androidmanifest');
const iOSPList = require('plist');

module.exports = function dev($logger, $projectData) {
    const appPackage = require($projectData.projectFilePath);
    const appVersion =
        (appPackage.nativescript && appPackage.nativescript.version) ||
        appPackage.version;
    let appVersionNumber =
        (appPackage.nativescript && appPackage.nativescript.versionNumber) ||
        appPackage.versionNumber;
    if (!appVersion) {
        $logger.warn('Nativescript version is not defined. Skipping set native package version.');
        return;
    }
    const platformService = $injector.resolve('platformService');
    const platformsData = $injector.resolve('platformsData');
    return Promise.each(
        platformService.getPreparedPlatforms($projectData),
        (platform) => {
            const platformData = platformsData.getPlatformData(platform);
            if (platform == 'android') {
                const manifest = new AndroidManifest().readFile(platformData.configurationFilePath);

                // transforms e.g. "1.2.3" into 1002003.
                let versionCode = appVersion
                    .split('.')
                    .reduce(
                        (acc, v, i, a) =>
                            acc + v * Math.pow(10, (a.length - i - 1) * 2),
                        0
                    );

                if (appVersionNumber) {
                    versionCode = versionCode * 100 + appVersionNumber;
                }

                manifest.$('manifest').attr('android:versionCode', versionCode);
                manifest.$('manifest').attr('android:versionName', appVersion);
                manifest.writeFile(platformData.configurationFilePath);
            } else if (platform == 'ios') {
                if (!appVersionNumber) {
                    appVersionNumber = appVersion;
                }
                const plist = iOSPList.parse(fs.readFileSync(platformData.configurationFilePath, 'utf8'));
                plist.CFBundleShortVersionString = appVersion;
                plist.CFBundleVersion = appVersionNumber;
                fs.writeFileSync(
                    platformData.configurationFilePath,
                    iOSPList.build(plist)
                );
            }
        }
    );
};
