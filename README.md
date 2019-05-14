# Nativescript hook plugin to maintain native app version

This plugin takes the `version` property from `package.json` (either `./package.json` or `./app/package.json`) and puts on the specific platform resources: `AndroidManifest.xml` file for the Android sources, and `Info.plist` for iOS sources.

This plugin is mainly a fork of [jacargentina/nativescript-dev-version](https://github.com/jacargentina/nativescript-dev-version), with the great ideas from [speigg/nativescript-dev-version](https://github.com/speigg/nativescript-dev-version/tree/patch-1) and [simplec-dev/nativescript-dev-version](https://github.com/simplec-dev/nativescript-dev-version).

## How to use

```
$ tns plugin add nativescript-dev-version
```

The above command installs this module and installs the necessary NativeScript hooks.

Then, specify and maintain the desired release version on the `./package.json` file under the `nativescript.version` property, for example:

```json
{
  "nativescript": {
    "id": "org.nativescript.MySampleApp",
    "version": "1.2.3"
    ...
  },
  ...
}
```

or in `./app/package.json`:

```json
{
  ...
  "version": "1.2.3"
}
```

When running `tns prepare ...` the hooks will take care of the native resources, and your app will get the `1.2.3` version number!
