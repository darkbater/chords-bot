/**TODO
 * - перехватчик ошибок при подключении к бд
 * - перенести подключение к боту в отдельный класс. tg
 * - абстрагировать tg от chords
 * 
 */

console.log('start');

const tbot = require('node-telegram-bot-api');
// true
// const token = "7993252916:AAHtL7zoT9D9GnycnUZe_wW1sBzCYEX1Nuo"
// test
const token = "7556693722:AAGBc0AM4LqbPorZw7TpUAodXmJTHfYxC2k"
const token_observer = "7571196011:AAFB3yO1jBbMblbO3YwPusUKuMLjt9uggd8"

const jimp = require("jimp");
process.env["NTBA_FIX_350"] = 1;
const chords_bot = new tbot(token, {  polling: {autoStart: true,interval: 1000,} });

// Класс приложения
const Chords = require('./bin/chords');
const chords = new Chords(chords_bot);

// Класс логгера
const Logger = require('./bin/logger');
const logger = new Logger(token_observer);

const fs = require("fs");


/**
 * chordsHTMLBolder
 * @param {text} 
 * @returns text
 * Подсветка аккордов для экспорта в html
 */
function chordsHTMLBolder(text) {
	let markedText="a"
	const lines= text.split("\n");
	// const Pattern = /[0-9]/i;
	for (let line of lines){
		if (/[а-я]/.test(line)) {
			logger.log('Есть русские:'+line)
			markedText += line + "\n"
			}
		else{
			if (line.length>1) markedText += "<b>"+line+"</b>\n";
				else markedText +="\n"
			// logger.log('aaaqaaa')
			logger.log('Нет русских:'+ line);
		}
		// logger.log()
		}
	return markedText;
}



/**Перехватчик api */
/**Перехват комманд (текста) */
chords_bot.on('text', async data => {
			const text = data.text

			/// Проверка на upset
			/// 1-> >1 строки 2-> пытаемся парсить первую строку
			/// 1->

			/// Если пришёл текст длиннее одной строки
			if (/[\n\r]/.test(text)){
				// logger.log("		Ентеры")
				logger.log(">1  строки (nc)");
				/// Парсим первую строку, в поисках названия песни и группы
				const regex =  /^(:?([^\r\n]*)\*([^\r\n]*))(?:\r?\n([\s\S]*))?[\r\n]*$/;
    			const match = text.match(regex);
				/// Если это заголовок и текст
				if (match) {
					logger.log("Заголовок и текст");
					logger.log(match);
					chords.upset(match[2],match[3], match[4]);

					return;
				}
				
			
			/// Если строка одна
			} else {
				logger.log("1  строка");
				
				/// Проверяем не запрос ли на редактирование
				const rxEdit =  /^(:?([^\r\n]*)\*([^\r\n]*))[\r\n]*$/;
    			const match = text.match(rxEdit);
				if (match) {
					logger.log("Запрос на редактирование");
					return;

					}

				/// Проверяем не пришла ли команда.
				if (/^[\w\d_/]*$/.test(text)){
					logger.log("комманда!");
					/// Коммутатор комманд
					switch (true) {
						/// Полный писок песен
						case text == '/list':
							logger.log('/list !!!')

							const list = chords.list(data.chat.id)

					
							break;
						default:
							break;
					}





					}
				}

			// then

			// Создание/обновление песни в базе

			});// callback on text




/**Перехват колбеков от кнопок */
chords_bot.on('callback_query', async data => {
		logger.log("Коллбек от кнопки")
		logger.log(data)

		/// Если это запрос текста песни
		const match_song=data.data.match(/^song_(\d*)$/)
		if (match_song){
			const song_number = match_song[1];
			logger.log('ПЕСНЯ')
			logger.log(song_number)
			chords.song(data.from.id, song_number)
			}

		/// Если запрос на исходник, для редактирования песни
		const match_edit=data.data.match(/^edit_(\d*)$/)
		if (match_edit){
			const edit_number = match_edit[1];
			logger.log('ПЕСНЯ')
			logger.log(edit_number)
			chords.edit(data.from.id, edit_number)
			}



		// get_songs_{int}
		// Получаем станицу песен
		
		// get_songs_{char}
		// Получаем станицу песен по первой букве

		})//callback_query


		
		/* Подключение системы логирования, файл ./modules/log.js
		Следующее регистрирует логгер экспортированный в файле log.js,
в качестве функции верхнего уровня log.*/
// const log = require('./bin/logger');

// Логирование неотловленных исключений, посредстом прослушивания
// событий uncaughtException и unhandledRejection.
process.on('uncaughtException', (err) => {
     logger.error("uncaughtException:",err);
     process.exit(1);
     });
process.on('unhandledRejection', (err) => {
     logger.error("unhandledRejection:",err);
     process.exit(1);
     });

logger.log('started');