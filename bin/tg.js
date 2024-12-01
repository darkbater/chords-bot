class Tg{
	button(text, callback){
		const opts = {
			reply_markup: {
				inline_keyboard: 
				[
					[{text:text, callback_data:callback}]
				]
				
				}
			};
	return opts;
	}
}

module.exports = Tg;

