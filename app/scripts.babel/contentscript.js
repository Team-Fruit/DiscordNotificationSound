'use strict';

(() => {
	class Core {
		constructor() {
			this.observer = new MutationObserver((records) => {
				if (records.length === 0) {
					return;
				}

				const addedNodes = records.reduce((prev, current) => {
					return prev.concat(Array.from(current.addedNodes));
				}, []);

				if (addedNodes.length === 0) {
					return;
				}
				this.process($(addedNodes));
			});

			//	設定
			this.server1 = '';
			this.server2 = '';
			this.server3 = '';

			this._defaultSelector = '.rtc-connection-status>[class^="description-"]>[class^="channel-"]';
		}

		get defaultSelector() {
			return this._defaultSelector;
		}

		get defaultSettings() {
			return {
				server1: '',
				server2: '',
				server3: ''
			}
		}

		loadSettings(defaults, callback = null) {
			chrome.storage.local.get(defaults, (items) => {
				this.server1 = items.server1;
				this.server2 = items.server2;
				this.server3 = items.server3;

				if (callback) {
					callback();
				}
			});

			chrome.storage.onChanged.addListener((changes, namespace) => {
				if (namespace === 'local') {
					if (changes.server1) {
						this.server1 = changes.server1.newValue;
					}
					if (changes.server2) {
						this.server2 = changes.server2.newValue;
					}
					if (changes.server3) {
						this.server3 = changes.server3.newValue;
					}
				}
			});
		}

		ready() {
			let defaults = this.defaultSettings;
			this.loadSettings(defaults, () => {
				this.process();
			});
		}
		
		observe() {
			let options = {
				characterData: true,
				childList: true,
				subtree: true
			};
			this.observer.observe($('body').get(0), options);
		}
		
		disconnect() {
			this.observer.disconnect();
		}
		
		process(elements = null) {
			//	Disconnect Observer
			this.disconnect();
			
			/**
			 *	置き換え処理
			 */
			let self = this;

			//	置き換えする対象が指定されていない場合はデフォルトのセレクタを使用
			//	指定されている場合は要素に対してfind
			if (elements === null) {
				//	Default
				elements = $(this.defaultSelector);
			} else {
				elements = elements.find(this.defaultSelector);
			}

			elements.each((index, element) => {
				let serverURL = $(element).prop('href');
				if (serverURL !== undefined) {
					let serverIds = serverURL.match(/channels\/(\d+)\/\d+/)
					if (serverIds.length > 1) {
						let serverId = serverIds[1];
						switch (serverId) {
							case self.server1:
								chrome.runtime.sendMessage({ servertype: 1 });
								break;
							case self.server2:
								chrome.runtime.sendMessage({ servertype: 2 });
								break;
							case self.server3:
								chrome.runtime.sendMessage({ servertype: 3 });
								break;
							default:
								chrome.runtime.sendMessage({ servertype: 0 });
								break;
						}
					}
				}
			});
			
			//	Reconnect
			this.observe();
		}
	}
	
	const core = new Core;
	core.ready();
})();
