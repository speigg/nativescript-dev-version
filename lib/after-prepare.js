var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Promise = require('bluebird');
var AndroidManifest = require('androidmanifest');
var iOSPList = require('plist');

module.exports = function ($logger, $projectData, $usbLiveSyncService) {
	var appPackage = require($projectData.projectFilePath);	
	var appVersion = appPackage.nativescript && appPackage.nativescript.version || appPackage.version;
	if (!appVersion) {
		$logger.warn('Nativescript version is not defined. Skipping set native package version.');
		return;
	}
	var platformService = $injector.resolve('platformService');
	var platformsData = $injector.resolve('platformsData');
	return Promise.each(platformService.getPreparedPlatforms($projectData), function (platform) {
		var platformData = platformsData.getPlatformData(platform);
		if (platform == 'android') {
			var manifest = new AndroidManifest().readFile(platformData.configurationFilePath)
			manifest.$('manifest').attr('android:versionCode', appVersion.replace(/\./g, ''))
			manifest.$('manifest').attr('android:versionName', appVersion);
			manifest.writeFile(platformData.configurationFilePath);
		}
		else if (platform == 'ios') {
			var plist = iOSPList.parse(fs.readFileSync(platformData.configurationFilePath, 'utf8'));
			plist.CFBundleShortVersionString = appVersion;
			plist.CFBundleVersion = appVersion;
			fs.writeFileSync(platformData.configurationFilePath, iOSPList.build(plist));
		}		
	});
}
