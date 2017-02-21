var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Promise = require('bluebird');
var AndroidManifest = require('androidmanifest');
var iOSPList = require('plist');

module.exports = function ($logger, $projectData, $usbLiveSyncService) {
	var appPackage = require($projectData.projectFilePath);	
	if (!appPackage.nativescript || !appPackage.nativescript.version) {
		console.log('Nativescript version is not defined. Skipping set native package version.');
		return;
	}
	var platformsData = $injector.resolve('platformsData');
	return Promise.each(platformsData.platformsNames, function (platform) {
		var platformData = platformsData.getPlatformData(platform);
		if (platform == 'android') {
			var manifest = new AndroidManifest().readFile(platformData.configurationFilePath)
			manifest.$('manifest').attr('android:versionCode', appPackage.nativescript.version)
			manifest.$('manifest').attr('android:versionName', appPackage.nativescript.version);
			manifest.writeFile(platformData.configurationFilePath);
		}
		else if (platform == 'ios') {
			var info = iOSPList.parse(fs.readFileSync(platformData.configurationFilePath, 'utf8'));

		}		
	});
}
