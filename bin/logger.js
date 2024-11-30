class Logger {

	error(text, obj){

	this.log(text+JSON.stringify(obj, null, 8))
	}

	log(obj){
	const chat_id = "2032396892"
	if(typeof obj === 'string')
		this.tg.sendMessage(chat_id, obj)
	else this.tg.sendMessage(chat_id, JSON.stringify(obj, null, 4))


	}


	constructor(){
		const token = "7571196011:AAFB3yO1jBbMblbO3YwPusUKuMLjt9uggd8"
		const chat_id = "2032396892"
		const tbot = require('node-telegram-bot-api');
		this.tg = new tbot(token);
		console.log(this.tg)
		this.tg.on('text', async data => {
			console.log('------------------------------------------------------------')
			this.tg.sendMessage(chat_id, 'xzcczxczx')
			console.log(data)
			console.log('------------------------------------------------------------')
			})

	}
}

module.exports = Logger;



