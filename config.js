module.exports = {
	adapters: [
		{
			id: 'yad2_classic',
			adapter: 'yad2',
			url: 'http://www.yad2.co.il/Nadlan/rent.php?AreaID=49&City=&HomeTypeID=&fromRooms=3&untilRooms=4&fromPrice=4000&untilPrice=7000&PriceType=1&FromFloor=&ToFloor=&EnterDate=&Info=%E9%F4%E5&ImgOnly=1',
			additionalUrl: 'http://www.yad2.co.il/Nadlan/rentGallery.php?AreaID=49&City=&HomeTypeID=&fromRooms=3&untilRooms=4&fromPrice=4000&untilPrice=7000&PriceType=1&FromFloor=&ToFloor=&EnterDate=&Info=%E9%F4%E5&ImgOnly=1&GalleryView=1',
			slackChannel: 'testgiv',
			slackBot: 'yad2',
			itemsUrl: 'https://shiramy-scraper.firebaseio.com/channels/giv',
			dontPostForReal: false,
			proxy: 'proxysite',
			pages: 3,
			enabled: false
		},
		{
			id: 'going_out_tlv',
			adapter: 'goingOutTLV',
			url: 'http://www.goingout.co.il/search_results.php?city=1&type=0',
			slackChannel: 'recent',
			slackBot: 'tlv-bot',
			itemsUrl: 'https://going-out-tlv.firebaseio.com/channels/recent',
			pages: 3,
			enabled: true
		}
	],
	bots: [
		{
			name: 'yad2',
			token: 'xoxb-19514354836-cFCobeZyfApEnWxfDrCQXCh6'
		},
		{
			name: 'tlv-bot',
			token: 'xoxb-20147444883-XOzJ4ctYHizkqunZ2FYYM45h'
		}
	],
	adaptersCommon: {
		errorsUrl: 'https://shiramy-scraper.firebaseio.com/errors',
	},
	interval: 300000, //5 mins,
}
