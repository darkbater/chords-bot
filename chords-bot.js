// import postgresql from 'pg';
// import os from 'os';
// from chords import chords;
const Chords = require('./chords');
const chords = new Chords();

// chords.test();

// process.exit(0);

const { Client } = require('pg');
const pg=new Client({
	user: 'postgres',
	password: 'postgres',
	host: 'localhost',
	database: 'chords-bot',
	port: 5432,
})

// onst tbot = require('node-telegram-bot-api');
// const chords_bot = new tbot(token, {  polling: {autoStart: true,interval: 1000,} });

	console.log('start');

pg.connect()

const tbot = require('node-telegram-bot-api');
const token = "7993252916:AAHtL7zoT9D9GnycnUZe_wW1sBzCYEX1Nuo"
const jimp = require("jimp");
process.env["NTBA_FIX_350"] = 1;
const chords_bot = new tbot(token, {  polling: {autoStart: true,interval: 1000,} });

/**
 * @param {text} 
 * @returns text
 * Подсветка аккордов для экспорта в html
 */

function chordsBolder(text) {
	let markedText="a"
	const lines= text.split("\n");
	// const Pattern = /[0-9]/i;
	for (let line of lines){
		if (/[а-я]/.test(line)) {
			console.log('Есть русские:'+line)
			markedText += line + "\n"
			}
		else{
				if (line.length>1) markedText += "<b>"+line+"</b>\n";
					else markedText +="\n"
				// console.log('aaaqaaa')
				console.log('Нет русских:'+ line);
			}
		// console.log()
		}
	return markedText;
}



chords_bot.on('callback_query', async data => {
	// console.log(`SELECT * FROM songs WHERE id=${data.data};`)
	console.log(data)

	pg.query(`SELECT * FROM songs WHERE id=${data.data};`, (err, res)=>{
		// console.log(res.rows)
		let text = res.rows[0].text;
		// console.log(text)

		// chords_bot.sendMessage(data.chat.id, res.rows[0].text);
		chords_bot.sendMessage(data.message.chat.id, "<pre>\n" + chordsBolder(text) + "\n</pre>",
			{parse_mode: "HTML"});
		chords_bot.sendDocument(data.message.chat.id, "doc.html");
		chords_bot.sendDocument(data.message.chat.id, "doc.pdf");
		console.log("<pre>\n" + chordsBolder(text) + "\n</pre>")
		})
	})//callback_query
chords_bot.on('text', async data => {
	// Проверяем пришла ли песня, с первой строкой на дообавление.
		//Да - проверяем, есть ли такая
			//Есть - обновляем
			//Нет - добавляем


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

	case '/test':

		var items = [];
		var rows = [{
				id: 1,
				name: 'aaaa',
			},
			{
				id: 2,
				name: 'bbb',
				
				}
			];
		rows.forEach((item,i)=>{
			items.push([{text:item.name, callback_data:item.id}])
			items.push([{text:item.name, callback_data:item.id}])
			})
		const opts = {
			reply_markup: {
				inline_keyboard: 
					items
			}
		}
		chords_bot.sendMessage(data.chat.id, 'Выберите пункт:', opts);

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
			chords_bot.send

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
