// import postgresql from 'pg';
// import os from 'os';
const { Client } = require('pg');
const pg=new Client({
	user: 'postgres',
	password: 'postgres',
	host: 'localhost',
	database: 'chords-bot',
	port: 5432,
	})

console.log('start');

pg.connect()

const tbot = require('node-telegram-bot-api');
const token = "7993252916:AAHtL7zoT9D9GnycnUZe_wW1sBzCYEX1Nuo"
const jimp = require("jimp");
process.env["NTBA_FIX_350"] = 1;
const chords_bot = new tbot(token, {  polling: {autoStart: true,interval: 1000,} });

chords_bot.on('callback_query', async data => {
	// console.log(`SELECT * FROM songs WHERE id=${data.data};`)
	console.log(data)

	pg.query(`SELECT * FROM songs WHERE id=${data.data};`, (err, res)=>{
		// console.log(res.rows)
		let text = res.rows[0].text;
		console.log(text)

		// chords_bot.sendMessage(data.chat.id, res.rows[0].text);
		chords_bot.sendMessage(data.message.chat.id, text);
		})
	})//callback_query
chords_bot.on('text', async data => {
		/// "Коммутатор" запросов
	// console.log(data.text)
	// console.log(data.chat)
	switch(data.text){
	case '/add':
		chords_bot.sendMessage(
		  data.chat.id,
		  "Добавь новую песню.\n"+
		  "В первой строке должны идти название группы, а через звёздочку название песни"
		)
		break;

	case '/list':
		pg.query('SELECT * FROM songs;', (err, res)=>{
			var items = []
			res.rows.forEach((item,i)=>{
				items.push([{text:item.name+"("+item.description+")", callback_data:item.id}])
				})
			console.log(items)
			const opts = {
				reply_markup: {
					inline_keyboard: 
						items
					
				}
			};
			chords_bot.sendMessage(data.chat.id, 'Выберите пункт:', opts);

			if(err) {
				console.error('Error connecting to the database', err.stack);
			  } else {
			  }
			})

		break;
	case '/start':
	case '/help':
	  chords_bot.sendMessage(
		data.chat.id,
		"Привет, *" + data.chat.username + "*\n"+
		"Введи группу и песню, что бы я попытался найти для тебя аккорды,\n"+
		"или воспользуйся справкой, что бы узнать о моих дополнительных возможностях."+
		"Прыятного использования!"
		,
		{parse_mode: "markdown"},
		);
	  }
	}) /// Текстовое
