"use strict";
var winston = require('winston');
var cheerio = require('cheerio');
var Firebase = require("firebase");
var request = require('request');

module.exports = class BaseAdapter {
	constructor(options){
		this.id = options.id;
		this.url = options.url;
		if (options.page > 1) {
			this.url = this.getPageUrl(options.url);	
		}
		this.additionalUrl = options.additionalUrl;
		if (options.page > 1) {
			this.additionalUrl = this.getPageUrl(options.additionalUrl);	
		}
		this.proxy = options.proxy;
		this.client = options.client;
		this.slackChannel = options.slackChannel;
		this.slackBot = options.slackBot;
		this.response = options.response;
		this.responseImages = options.responseImages;
		this.dontPostForReal = options.dontPostForReal;
		this.itemsUrl = options.itemsUrl;
		this.firebaseRef = new Firebase(options.itemsUrl);
		this.errorsRef = new Firebase(options.errorsUrl);
	}

	useWebdriver(){
		return false;
	}

	visibleSelector(){
		return null;
	}

	toString(){
		return `${this.constructor.name} - ${this.url} - ${this.slackChannel}`;
	}

	getDocumnet(){
		winston.info(`Adapter::${this.id}: getting document`);
		return new Promise((resolve) => {
			var html;
			if (this.useWebdriver()) {
				var clientPromise = this.client.init();
				if (this.proxy) {
					clientPromise = this.proxy(this.url, clientPromise);
				} else {
					clientPromise = clientPromise.url(this.url);
				}
				clientPromise
					.waitForExist(this.visibleSelector(), 60000)
					.then(() => winston.info(`Adapter::${this.id} : inside ${this.url}`))
					.getHTML('body', (err, bodyHtml) => {
						winston.info(`Adapter::${this.id} : Got HTML`)
						html = bodyHtml;
					})
					.end(() => {
						resolve(cheerio.load(html));
					});	
			} else {
				request(this.url, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						resolve(cheerio.load(body)) // Show the HTML for the Google homepage. 
					} else {
						resolve(cheerio.load('<div></div>'));
					}
				});
			}
			

		}).then(($) => {
			return new Promise((resolve) => {
				var html;
				if (this.additionalUrl) {
					if (this.useWebdriver()) {
						var clientPromise = this.client.init();
						if (this.proxy) {
							clientPromise = this.proxy(this.url, clientPromise);
						} else {
							clientPromise = clientPromise.url(this.url);
						}
						clientPromise
							.waitForExist(this.visibleSelector(), 60000)
							.then(() => winston.info(`Adapter::${this.id} : inside ${this.additionalUrl}`))
							.getHTML('body', (err, bodyHtml) => {
								html = bodyHtml;
							})
							.end(() => {
								resolve({
									$: $,
									$$: cheerio.load(html)
								});
							});	
					} else {
						request(this.url, function(error, response, body) {
							if (!error && response.statusCode == 200) {
								resolve({
									$: $,
									$$: cheerio.load(body)
								});
							} else {
								resolve({
									$: $,
									$$: cheerio.load('<div></div>')
								});
							}
						});
					}
					
				} else {
					resolve({
						$: $
					});
				}	
			});
		});
	}

	getItems(documents){
		return []
	}

	getPageUrl(i){
		return this.url;
	}

	writeError(message){
		return new Promise((resolve, reject) => {
			winston.error(`Adapter::${this.id} : ${message}`);
			var errorsUpdate = {};
			errorsUpdate[new Date().getTime()] = message
			this.errorsRef.update(errorsUpdate, resolve)
		});
	}

	filterNewItems(items){
		winston.info(`Adapter::${this.id} Items Found: ${JSON.stringify(items, null, '\t')}`);
		return new Promise((resolve, reject) => {
			this.firebaseRef.on('value', (snapshot) => {
				var itemsHash = snapshot.val() || {};
				var newItems = items
					.filter((item) => {
						return !itemsHash[item.id]
					});
				winston.info(`Adapter::${this.id} New Items: ${JSON.stringify(newItems, null, '\t')}`);
				resolve((newItems || []).reverse());
			}, reject);
		});
	}

	saveItems(items){
		return new Promise((resolve, reject) => {
			var updateHash = {};
			winston.info(`Adapter::${this.id} items length: ${items.length}`);
			this.firebaseRef.update(updateHash, resolve.bind(null, items));
			items.forEach((item) => {
				updateHash[item.id] = item;
			});
			winston.info(`Adapter::${this.id} Updating new items: ${JSON.stringify(updateHash, null, '\t')}`);
			this.firebaseRef.update(updateHash, resolve.bind(null, items));
		});
	}

	formatItems(items) {
		return items.map(this.formatItem, this);
	}

	formatItem(item, i) {
		return	`
${item.img}
${item.text}
${item.url}
`.trim();
	}

	run(){
		return this.getDocumnet()
			.then(this.getItems.bind(this))
			.then(this.filterNewItems.bind(this))
			.then(this.saveItems.bind(this))
			.then(this.formatItems.bind(this))
			.then(this.post.bind(this))
			.catch((error) => {
				winston.error(error.message || error.code);
			})
	}

	post(messages){
		if (messages && !Array.isArray(messages)){
			messages = [messages];
		}
		(messages || []).forEach(m => {
			if (this.slackBot && this.slackBot.postMessageToChannel) {
				if (!this.dontPostForReal) {
					this.slackBot.postMessageToChannel(this.slackChannel, m, {});	
				}
				winston.info(`Adapter::${this.id} Bot ${this.slackBot.name} posted: ${m}`);
			}
		});
	}
}