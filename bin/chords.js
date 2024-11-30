const { Pool } = require('pg');
class Chords {

	test(){
		console.log("test");
	}

	upset(song, group, text){
		console.log("upset",text);
		const sql = `INSERT INTO songs (song_name, group_name, song_text)
						VALUES ('${song}', '${group}', '${text}')
						ON CONFLICT (song_name, group_name)
						DO UPDATE SET
    					song_text = EXCLUDED.song_text`;
		console.log(sql)
		const res = this.pg.query(sql, (err, result)=>{
			if(!err)
				console.log(result);
			// console.log(err);
			});
		
		console.log('returned')
	}

	list(chat){
		this.pg.query('SELECT id, song_name, group_name FROM songs', (err, res)=>{
			if(err) {
				console.error('Error connecting to the database', err.stack);
			  } else {
				  var items = []
				  res.rows.forEach((item,i)=>{
					  console.log(i,item)
					  items.push([{text:item.song_name+"("+item.group_name+")", callback_data:"song_"+item.id}])
					  })
				  // console.log(items)
				  const opts = {
					  reply_markup: {
						  inline_keyboard: 
						  items
						  
					  }
				  };
				console.log(chat+'<<<<<!');
				this.cb.sendMessage(chat, 'Выберите песню:', opts);
				//   tbot.send(opts)
			  }

			})
	}

	//	Вывод песни
	song(chat, song_id){
		console.log(chat,song_id)
		this.pg.query(`SELECT id, song_name, group_name, song_text FROM songs where id='${song_id}'`, (err, res)=>{
			if(err) {
				console.error('Error connecting to the database', err.stack);
			} else {
				console.log(res)
				this.cb.sendMessage(chat, '<pre>\n'+res.rows[0].song_text+'</pre>', {parse_mode: "HTML"})
				// if( !( data = fs.readFileSync("hello.txt"))){
					// console.log('Такого html ещё нет')
					// }

				try {

					if (this.fs.existsSync("data/"+song_id+".html")){
						console.log("!!!!!!!");
					}
					else{
						const text = this.fs.readFileSync("data/"+song_id+".html");
						console.log(text);

					}
					
				} catch (error) {
					console.log(error)
					
				}

				// console.log("Есть html " + "data/"+song_id+".html");
					// chords_bot.sendDocument(data.message.chat.id, song_id+".html");
				// } else console.log("Нет html " + "data/"+song_id+".html");


				// chords_bot.sendDocument(data.message.chat.id, "doc.pdf");
				//   this.cb.sendMessage(chat, song_id)

			}
		});
	}
	//	Вывод песни с подсветкой, без точности
	song_marked(chat, song_id){
		console.log(chat,song_id)
		this.pg.query(`SELECT id, song_name, group_name, song_text FROM songs where id='${song_id}'`, (err, res)=>{
			if(err) {
				console.error('Error connecting to the database', err.stack);
			} else {
				console.log(res)

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
		this.log=new Logger("")
		// this.pg = 
		this.cb=cb;

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