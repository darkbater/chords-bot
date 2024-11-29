const { Pool } = require('pg');
class Chords {

	test(){
		console.log("test");
	}

	upset(song, group, text){
		console.log("upset",text);
		const sql = `INSERT INTO songs (song_name, group_name, song_text)
						VALUES ('${song}', '${group}', '${text}')
						ON CONFLICT (group_name)
						DO UPDATE SET
    					song_text = EXCLUDED.song_text`;
		console.log(sql)
		const res = this.pg.query(sql, (err, result)=>{
			if(!err)
				console.log(result);
			// console.log(err);
			});
		// console.log('query res',res)
		// res.then(()=>{console.log('cb!!!!')})
		
		console.log('returned')
	}

	list(){

	}

	song(){

	}

	search(){

	}

	// upsert(str:$text){

	// }

	// connect(){
		
	// }
	
	
	constructor(parameters) {
		this.pg = 



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