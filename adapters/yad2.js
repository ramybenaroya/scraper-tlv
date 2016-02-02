"use strict";
var BaseAdapter = require('./base');

module.exports = class Yad2Adapter extends BaseAdapter {
	visibleSelector(){
		return '#menu_strip';	
	}

	getItems(documents){
		var $ = documents.$;
		var $$ = documents.$$;

		var items = $('#main_table tr[id^="tr_Ad_"]')
			.toArray()
			.map(tr => {
				var $tr = $(tr);
				var id = $tr.attr('id');
				var _lastIndex = id.lastIndexOf('_');
				id = id.substring(_lastIndex + 1, id.length);
				return {
					id: id,
					text: $tr.text().replace(/\s+/g, "~").split('~').join(' '),
					url: `http://www.yad2.co.il/Nadlan/rent_info.php?NadlanID=${id}`,
					img: null
				}
			});
		if (items.length === 0) {
			this.writeError(`${this.toString()}: No items were found in Page

${$.html()}`);
		}
		
		if ($$) {
			items.forEach((item) => {
				var img = $$('.gallery_block_body[onclick*="\'' + item.id +'\'"]').find('img').attr('src');
				if (img) {
					item.img = img;
				}
			});	
		}

		return items;
	}

	getPageUrl(i) {
		return `${this.url}&Page=${i+1}`;
	}
}