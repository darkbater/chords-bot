const { Pool } = require('pg');
// const Tg = require('./tg');
// const tg = new Tg();

/**
 * chordsHTMLBolder
 * @param {text} 
 * @returns text
 * Подсветка аккордов для экспорта в html
 */
function chordsHTMLBolder(text) {
	let markedText=""
	const lines= text.split("\n");
	// const Pattern = /[0-9]/i;
	for (let line of lines){
		if (/[а-я]/.test(line)) {
			// logger.log('Есть русские:'+line)
			markedText += line + "\n"
			}
		else{
			if (line.length>1) markedText += "<b>"+line+"</b>\n";
				else markedText +="\n"
			// logger.log('aaaqaaa')
			// logger.log('Нет русских:'+ line);
		}
		// logger.log()
		}
	return markedText;
}


class Chords {

	test(){
		this.log.log("test");
	}

	upset(song, group, text){
		this.log.log("upset",text);
		const sql = `INSERT INTO songs (song_name, group_name, song_text)
						VALUES ('${song}', '${group}', '${text}')
						ON CONFLICT (song_name, group_name)
						DO UPDATE SET
    					song_text = EXCLUDED.song_text`;
		this.log.log(sql)
		const res = this.pg.query(sql, (err, result)=>{
			const t = this
			if(!err){
				const sql_get_id = `select id from songs where song_name='${song}' and group_name='${group}'`;
				this.pg.query(sql_get_id, (err,result)=>{
					this.log.log('Получем ID');
					// this.log.log(result);
					// this.log.log(sql_get_id);
					const id=result.rows[0].id
					this.log.log("IIIDDD",id);
					const text_b = chordsHTMLBolder(text);
					const html = text_b;
					// const html = `<!-- document.html -->
					// 	<!DOCTYPE html>
					// 	<html lang="ru">
					// 	<head>
					// 		<meta charset="UTF-8">
					// 		<meta name="viewport" content="width=device-width, initial-scale=1.0">
					// 		<title>Документ HTML</title>
					// 	</head>
					// 	<body style="font-family: monospace;white-space: pre;">${text_b}</body>
					// 	</html>`;
					// this.log.log(html);
					// t.log.log(`${id}.html<<<<<`);
					// t.log.log(`${id}.html<<<<<`);
					this.fs.writeFile(`data/${id}.html`, html, function(error){
						if(error){  // если ошибка
							return t.log.log('!!!!!!!!!!егорка!!!!!!!!!!!!!');
							return t.log.log(error);
						} else
						t.log.log(`Файл ${id}.html успешно записан`);
					})
	

					})

				// this.log.log('Билдим кэш html');
				// this.log.log(result);
				
				// const id=2
				// this.log.log('id');
				
				
				// this.log.log('Билдим кэш html');
				// this.log.log('2 Билдим кэш html');
				// let t=this
				// this.log.log('3 Билдим кэш html');
			}
					
				// this.log.log(result);
			// this.log.log(err);
			});
		
		
		this.log.log('returned')
	}

	html(chat, id){
		this.log.log("html", id);
		
		this.log.log(`>data/${id}.html<`);
		
		try {
			// const documentPath = path.join(__dirname, `data/${id}.html`);

			const hhtt=this.fs.readFileSync(`data/${id}.html`,'utf8');
			this.log.log(`data/${id}.html[[[[[[[[[[[[[]]]]]]]]]]]]]`)
			// this.cb.sendMessage(chat, hhtt, {parse_mode: "HTML"})
			this.cb.sendMessage(chat, hhtt, {parse_mode: 'HTML'});
			this.log.log(hhtt)
			// this.cb.sendMessage(chat, "hhtt", {parse_mode: "HTML"})
			// this.cb.sendDocument(chat, this.fs.createReadStream(`data/${id}.html`));
			this.log.log('no error')
		} catch (error) {
			this.log.log('error')
			this.log.log(error)
		}
			
		// this.log.log("sended");



		// const sql = `INSERT INTO songs (song_name, group_name, song_text)
						// VALUES ('${song}', '${group}', '${text}')
						// ON CONFLICT (song_name, group_name)
						// DO UPDATE SET
    					// song_text = EXCLUDED.song_text`;
		// this.log.log(sql)
		// const res = this.pg.query(sql, (err, result)=>{
			// if(!err)
				// this.log.log(result);
			// this.log.log(err);
			// });
		
		// this.log.log('returned')
	}

	list(chat){
		this.pg.query('SELECT id, song_name, group_name FROM songs ORDER BY song_name', (err, res)=>{
			if(err) {
				console.error('Error connecting to the database', err.stack);
			  } else {
				  var items = []
				  res.rows.forEach((item,i)=>{
						// console.log(item);
						//   this.log.log(i,item)
						items.push([{text:item.song_name+"("+item.group_name+")", callback_data:"song_"+item.id}])
					})
					// console.log(items)
					const opts = {
						reply_markup: {
						  inline_keyboard: items
						  
					  }
				  };
						  console.log(items);
				// this.log.log(chat+'<<<<<!');
				this.cb.sendMessage(chat, 'Выберите песню:', opts);
				//   tbot.send(opts)
			  }

			})
	}
	group(chat, group_name){

		console.log(group_name);

		// return;
		this.pg.query(`SELECT id, song_name FROM songs WHERE group_name='${group_name}' ORDER BY song_name`, (err, res)=>{
			if(err) {
				console.error('Error connecting to the database', err.stack);
			  } else {
				  var items = []
				  res.rows.forEach((item,i)=>{
						// console.log(item);
						//   this.log.log(i,item)
						items.push([{text:item.song_name, callback_data:"song_"+item.id}])
					})
					// console.log(items)
					const opts = {
						reply_markup: {
						  inline_keyboard: items
						  
					  }
				  };
						  console.log(items);
				// this.log.log(chat+'<<<<<!');
				this.cb.sendMessage(chat, 'Выберите песню:', opts);
				//   tbot.send(opts)
			  }

			})
	}

	groups(chat){
		this.pg.query('SELECT DISTINCT group_name FROM songs ORDER BY group_name', (err, res)=>{
			if(err) {
				console.error('Error connecting to the database', err.stack);
			  } else {
				  var items = []
				  res.rows.forEach((item,i)=>{
						// console.log(item);
					//   this.log.log(i,item)
					  items.push([{text:item.group_name, callback_data:"group_"+Buffer.from(item.group_name).toString('base64')}])
					  })
				console.log(items)
				  const opts = {
					  reply_markup: {
						  inline_keyboard: items
						  
					  }
				  };
				// this.log.log(chat+'<<<<<!');
				this.cb.sendMessage(chat, 'Выберите песню:', opts);
				//   tbot.send(opts)
			  }

			})
	}

	//	Вывод исходника
	edit(chat, song_id){
		this.pg.query(`SELECT song_name, group_name, song_text FROM songs where id='${song_id}'`, (err, res)=>{
				if(err) {
					console.error('Error connecting to the database', err.stack);
				} else {
					this.log.log('выводим исходник')
					this.cb.sendMessage(chat, `${res.rows[0].song_name}*${res.rows[0].group_name}\n${res.rows[0].song_text}`)

				}
			});
		}
	///	Вывод песни
	song(chat, song_id){
		this.log.log(chat,song_id)
		this.pg.query(`SELECT id, song_name, group_name, song_text FROM songs where id='${song_id}'`, (err, res)=>{
			if(err) {
				console.error('Error connecting to the database', err.stack);
			} else {

				this.log.log('выводим песню')
				this.log.log(res)
				
				
				// this.cb.sendMessage(chat, '<pre>\n'+res.rows[0].song_text+'</pre>', {parse_mode: "HTML"})
				// return
				
				// this.cb.sendMessage(chat, this.tg.button(`[html]', 'song_html_${song_id}`));
				// this.cb.sendMessage(chat, '<pre>\n'+res.rows[0].song_text+'</pre>', {parse_mode: "HTML"})

				// this.log.log('выводим ссылку на html')
				// this.cb.sendMessage(chat, '[html]]', {
				// 	reply_markup: {
				// 		inline_keyboard: 
				// 		[
				// 			[{text:'[html]', callback_data:`song_html_${song_id}`}]
				// 		]
						
				// 		}
				// 	});
				// this.cb.sendMessage(chat, `\`\`\`\n${res.rows[0].song_text}\`\`\``, {parse_mode: 'markdown'});
				this.cb.sendMessage(chat, '```\n'+res.rows[0].song_text+'```', {
					parse_mode: "markdown",
					reply_markup: {
						inline_keyboard: 
						[
							[{text:'[html]', callback_data:`song_html_${song_id}`},
							{text:'[edit]', callback_data:`song_edit_${song_id}`}]
						]
						}
					});

				// if( !( data = fs.readFileSync("hello.txt"))){
					// this.log.log('Такого html ещё нет')
					// }

				try {

					if (this.fs.existsSync("data/"+song_id+".html")){
						this.log.log("!!!!!!!");
					}
					else{
						const text = this.fs.readFileSync("data/"+song_id+".html");
						this.log.log(text);

					}
					
				} catch (error) {
					this.log.log(error)
					
				}

				// this.log.log("Есть html " + "data/"+song_id+".html");
					// chords_bot.sendDocument(data.message.chat.id, song_id+".html");
				// } else this.log.log("Нет html " + "data/"+song_id+".html");


				// chords_bot.sendDocument(data.message.chat.id, "doc.pdf");
				//   this.cb.sendMessage(chat, song_id)

			}
		});
	}
	//	Вывод песни с подсветкой, без точности
	song_marked(chat, song_id){
		this.log.log(chat,song_id)
		this.pg.query(`SELECT id, song_name, group_name, song_text FROM songs where id='${song_id}'`, (err, res)=>{
			if(err) {
				console.error('Error connecting to the database', err.stack);
			} else {
				this.log.log(res)

				this.cb.sendMessage(chat, '<pre>\n'+res.rows[0].song_text+'</pre>', {parse_mode: "HTML"})
				//   this.cb.sendMessage(chat, song_id)

			}
		});
		

	}

	search(){

	}

	// upsert(str:$text){

	// }

	// connect(){
		
	// }
	
	
	constructor(cb) {
		const Logger = require('./logger');
		this.log=new Logger()
		// this.pg = 
		this.cb=cb;
		
		
		const Tg = require('./tg');
		this.tg = new Tg();

		this.log.log("Конструктор Chords. Запуск.")
		// this.fs=new ;
		this.fs=require('fs')

// Подключение postger
	this.pg=new Pool({
		user: 'postgres',
		password: 'postgres',
		host: 'localhost',
		database: 'chords-bot',
		port: 5432,
		});

	}
}

module.exports = Chords;