"use strict";
var BaseAdapter = require('./base');
var md5 = require('md5');

module.exports = class GoingOutTLVAdapter extends BaseAdapter {
	visibleSelector(){
		return '#main';	
	}

	getItems(documents){
		var $ = documents.$;

		var items = $('.results tr[itemscope]')
			.toArray()
			.map(tr => {
				var $tr = $(tr);
				var $a0 = $tr.find('> td').eq(0).find('a');
				var $td1 = $tr.find('> td').eq(1);
				var title = $td1.find('.result_event_title').text();
				var desc = $td1.find('> span').text();
				var $td2 = $tr.find('> td').eq(2);
				var time = $td2.find('b').text();
				$td2.find('b').remove();
				time = `${$td2.text()} ${time}`
				var $td3 = $tr.find('> td').eq(3);
				var location = `${$td3.find('b').text()} ${$td3.find('span').text()}`;
				var $td4 = $tr.find('> td').eq(4);
				var price = $td4.find('b').text();
				var ticketsUrl = $td4.find('a').attr('href');
				var ticketsUrl = ticketsUrl ? `http://goingout.co.il${ticketsUrl}` : '';
				var itemData = {
					text: (
`${title.trim()}
${desc.trim()}
${time.trim()}
${price.trim()}
${location.trim()}`),
					ticketsUrl: ticketsUrl,
					url: `http://goingout.co.il${$a0.attr('href')}`,
					img: `http://goingout.co.il${$a0.find('img').attr('src')}`
				}
				
				var id = md5(JSON.stringify(itemData));
				itemData.id = id;

				return itemData;
			});
		if (items.length === 0) {
			this.writeError(`${this.toString()}: No items were found in Page

${$.html()}`);
		}

		return items;
	}

	getPageUrl(i) {
		return `${this.url}&p=${i}`;
	}

	formatItem(item, i) {
		return (
`===================
${item.img}
${item.text}
<${item.url}|View Event>
<${item.ticketsUrl}|Buy Tickets>
`.trim())
	}
}