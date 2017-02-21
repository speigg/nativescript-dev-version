var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Promise = require('bluebird');
var AndroidManifest = require('androidmanifest');
var iOSPList = require('plist');

module.exports = function ($logger, $projectData, $usbLiveSyncService) {
	var appPackage = require($projectData.projectFilePath);	
	if (!appPackage.nativescript || !appPackage.nativescript.version) {
		$logger.warn('Nativescript version is not defined. Skipping set native package version.');
		return;
	}
	var platformService = $injector.resolve('platformService');
	var platformsData = $injector.resolve('platformsData');
	return Promise.each(platformService.getPreparedPlatforms(), function (platform) {
		var platformData = platformsData.getPlatformData(platform);
		if (platform == 'android') {
			var manifest = new AndroidManifest().readFile(platformData.configurationFilePath)
			manifest.$('manifest').attr('android:versionCode', appPackage.nativescript.version.replace('.', '', 'g'))
			manifest.$('manifest').attr('android:versionName', appPackage.nativescript.version);
			manifest.writeFile(platformData.configurationFilePath);
		}
		else if (platform == 'ios') {
			var plist = iOSPList.parse(fs.readFileSync(platformData.configurationFilePath, 'utf8'));
			plist.CFBundleShortVersionString = appPackage.nativescript.version;
			plist.CFBundleVersion = appPackage.nativescript.version;
			fs.writeFileSync(platformData.configurationFilePath, iOSPList.build(plist));
		}		
	});
}