const { Client } = require('pg');
class Chords {

	test(){
		console.log("test");
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
	this.pg=new Client({
		user: 'postgres',
		password: 'postgres',
		host: 'localhost',
		database: 'chords-bot',
		port: 5432,
		});

	}
}

module.exports = Chords;