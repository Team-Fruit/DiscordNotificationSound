'use strict';

let tabSettings = {};

chrome.runtime.onMessage.addListener((request, sender) => {
    if (sender.tab) {
        tabSettings[sender.tab.id] = request.servertype;
    }
});

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        let tabSetting = tabSettings[details.tabId];
        if (tabSetting !== undefined && tabSetting > 0) {
            var new_url = chrome.extension.getURL(`assets/se${tabSetting}join.mp3`);
            return { redirectUrl: new_url }
        }
    },
    {
        urls: ['https://discordapp.com/assets/5dd43c946894005258d85770f0d10cff.mp3']
    },
    [
        'blocking'
    ]
);

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        let tabSetting = tabSettings[details.tabId];
        if (tabSetting !== undefined && tabSetting > 0) {
            var new_url = chrome.extension.getURL(`assets/se${tabSetting}quit.mp3`);
            return { redirectUrl: new_url }
        }
    },
    {
        urls: ['https://discordapp.com/assets/4fcfeb2cba26459c4750e60f626cebdc.mp3']
    },
    [
        'blocking'
    ]
);
