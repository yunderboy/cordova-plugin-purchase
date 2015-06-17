/*
 * Copyright (C) 2012-2013 by Guillaume Charhon
 * Modifications 10/16/2013 by Brian Thurlow
 */
/*global cordova */

(function () {
	"use strict";

	// Generates a `fail` function that accepts an optional error code
	// in the first part of the error string.
	//
	// format: `code|message`
	//
	// `fail` function will be called with `message` as a first argument
	// and `code` as a second argument (or undefined). This ensures
	// backward compatibility with legacy code.
	var errorCb = function (fail) {
		return function (error) {
			if (!fail)
				return;
			var tokens = typeof error === 'string' ? error.split('|') : [error];
			if (tokens.length > 1 && /^[-+]?(\d+)$/.test(tokens[0])) {
				var code = tokens[0];
				var message = tokens[1];
				fail(message, +code);
			}
			else {
				fail(error);
			}
		};
	};

	var log = function (msg) {
		console.log("InAppPurchase[js]: " + msg);
	};

	var InAppPurchase = function () {
		this.options = {};
	};

	InAppPurchase.prototype.init = function (success, fail, options, skus) {
		if (!options)
			options = {};

		this.options = {
			showLog: options.showLog !== false
		};

		if (this.options.showLog) {
			log('setup ok');
		}

		var hasSKUs = false;
		//Optional Load SKUs to Inventory.
		if (typeof skus !== "undefined") {
			if (typeof skus === "string") {
				skus = [skus];
			}
			if (skus.length > 0) {
				if (typeof skus[0] !== 'string') {
					var msg = 'invalid productIds: ' + JSON.stringify(skus);
					if (this.options.showLog) {
						log(msg);
					}
					fail(msg, store.ERR_INVALID_PRODUCT_ID);
					return;
				}
				if (this.options.showLog) {
					log('load ' + JSON.stringify(skus));
				}
				hasSKUs = true;
			}
		}

		if (hasSKUs) {
			cordova.exec(success, errorCb(fail), "InAppPurchase", "init", [skus]);
		}
		else {
			//No SKUs
			cordova.exec(success, errorCb(fail), "InAppPurchase", "init", []);
		}
	};
	InAppPurchase.prototype.getLicenses = function (success, fail) {
		if (this.options.showLog) {
			log('getLicenses called!');
		}
		return cordova.exec(success, errorCb(fail), "InAppPurchase", "getLicenses", ["null"]);
	};
	InAppPurchase.prototype.buy = function (success, fail, productId) {
		if (this.options.showLog) {
			log('buy called!');
		}
		return cordova.exec(success, errorCb(fail), "InAppPurchase", "buy", [productId]);
	};
	InAppPurchase.prototype.subscribe = function (success, fail, productId) {
		if (this.options.showLog) {
			log('subscribe called!');
		}
		return cordova.exec(success, errorCb(fail), "InAppPurchase", "subscribe", [productId]);
	};
	InAppPurchase.prototype.consumePurchase = function (success, fail, productId, transId) {
		if (this.options.showLog) {
			log('consumePurchase called!');
		}
		return cordova.exec(success, errorCb(fail), "InAppPurchase", "consumePurchase", [productId, transId]);
	};
	InAppPurchase.prototype.getAvailableProducts = function (success, fail) {
		if (this.options.showLog) {
			log('getAvailableProducts called!');
		}
		return cordova.exec(success, errorCb(fail), "InAppPurchase", "getAvailableProducts", ["null"]);
	};
	InAppPurchase.prototype.getProductDetails = function (success, fail, skus) {
		if (this.options.showLog) {
			log('getProductDetails called!');
		}

		if (typeof skus === "string") {
			skus = [skus];
		}
		if (!skus.length) {
			// Empty array, nothing to do.
			return;
		} else {
			if (typeof skus[0] !== 'string') {
				var msg = 'invalid productIds: ' + JSON.stringify(skus);
				log(msg);
				fail(msg, store.ERR_INVALID_PRODUCT_ID);
				return;
			}
			if (this.options.showLog) {
				log('load ' + JSON.stringify(skus));
			}
			cordova.exec(success, errorCb(fail), "InAppPurchase", "getProductDetails", [skus]);
		}
	};



	window.inAppPurchase = new InAppPurchase();

	// That's for compatibility with the unified IAP plugin.
	try { store.windows = window.inAppPurchase; }
	catch (e) { }

})();
