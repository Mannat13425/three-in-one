const { withAndroidManifest, AndroidConfig } = require('@expo/config-plugins');
const { getMainApplicationOrThrow, prefixAndroidKeys } = AndroidConfig.Manifest;

function getQueriesElement(androidManifest) {
    const { manifest } = androidManifest
    const queries = manifest["queries"]
    if (!queries) {
        throw new Error('queries element is missing from AndroidManifest.xml')
    }
    return queries
}

// Splitting this function out of the mod makes it easier to test.
function setCustomConfigAsync(config, androidManifest, attributes) {
    const queriesElement = getQueriesElement(androidManifest)
    addQuery(queriesElement)
    addPackage(queriesElement)
    const mainApplication = getMainApplicationOrThrow(androidManifest);
    addContentProvider(mainApplication, attributes);
    return androidManifest;
}

function addContentProvider(mainApplication, attributes) {
    let existingMetaDataItem;

    const newItem = {
        $: prefixAndroidKeys({
            name: 'com.facebook.FacebookContentProvider',
            authorities: `com.facebook.app.FacebookContentProvider${attributes.appID}`
        })
    };

    if (mainApplication['provider']) {
        existingMetaDataItem = mainApplication['provider'].filter(e => e.$['android:name'] === 'com.facebook.FacebookContentProvider');

        if (existingMetaDataItem.length) {
            existingMetaDataItem[0].$[`android:authorities`] = `com.facebook.app.FacebookContentProvider${attributes.appID}`;
        } else {
            mainApplication['provider'].push(newItem);
        }
    } else {
        mainApplication['provider'] = [newItem];
    }

    return mainApplication;
}

function addQuery(queriesElement) {
    let existingProviderItem;

    const newItem = {
        $: prefixAndroidKeys({
            authorities: 'com.facebook.katana.provider.PlatformProvider'
        })
    };

    if (queriesElement[0].provider) {
        existingProviderItem = queriesElement[0].provider.filter(e => e.$['android:authorities'] === 'com.facebook.katana.provider.PlatformProvider');

        if (existingProviderItem.length) {
            existingProviderItem[0].$[`android:authorities`] = 'com.facebook.katana.provider.PlatformProvider';
        } else {
            existingProviderItem['provider'].push(newItem);
        }
    } else {
        queriesElement[0].provider = [newItem];
    }

    return queriesElement;
}

function addPackage(queriesElement) {
    let existingProviderItem;

    const newItem = {
        $: prefixAndroidKeys({
            name: 'com.facebook.katana'
        })
    };

    if (queriesElement[0].package) {
        existingProviderItem = queriesElement[0].provider.filter(e => e.$['android:name'] === 'com.facebook.katana');

        if (existingProviderItem.length) {
            existingProviderItem[0].$[`android:name`] = 'com.facebook.katana';
        } else {
            existingProviderItem['package'].push(newItem);
        }
    } else {
        queriesElement[0].package = [newItem];
    }

    return queriesElement;
}

// <package android:name="com.facebook.katana" />

module.exports = function withAndroidMainActivityAttributes(config, attributes) {
    return withAndroidManifest(config, (config) => {
        config.modResults = setCustomConfigAsync(config, config.modResults, attributes);
        return config;
    });
};
