/**TODO
 * - перехватчик ошибок при подключении к бд
 * - перенести подключение к боту в отдельный класс. tg
 * 
 * 
 */

// Класс приложения
const Chords = require('./chords');
const chords = new Chords();

console.log('start');

const tbot = require('node-telegram-bot-api');
const token = "7993252916:AAHtL7zoT9D9GnycnUZe_wW1sBzCYEX1Nuo"

const jimp = require("jimp");
process.env["NTBA_FIX_350"] = 1;
const chords_bot = new tbot(token, {  polling: {autoStart: true,interval: 1000,} });

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



/**Перехватчик api */
/**Перехват комманд (текста) */
chords_bot.on('text', async data => {
			const text = data.text
			/// Проверка на команды

			/// else
			/// Поисковый запрос | Пришла одна строка !не команда!


			/// Проверка на upset
			/// 1-> >1 строки 2-> пытаемся парсить первую строку
			/// 1->

			/// Если пришёл текст длиннее одной строки
			if (/[\n\r]/.test(text)){
				// console.log("		Ентеры")
				console.log(">1  строки (nc)");
				/// Парсим первую строку, в поисках названия песни и группы
				const regex =  /^(:?([^\r\n]*)\*([^\r\n]*))(?:\r?\n([\s\S]*))?[\r\n]*$/;
    			const match = text.match(regex);
				/// Если это заголовок и текст
				if (match) {
					console.log("Заголовок и текст");
					console.log(match);
					chords.upset(match[2],match[3], match[4]);

					return;
				}
				
			
			/// Если строка одна
			} else {
				console.log("1  строка");
				
				/// Проверяем не запрос ли на редактирование
				const rxEdit =  /^(:?([^\r\n]*)\*([^\r\n]*))[\r\n]*$/;
    			const match = text.match(rxEdit);
				if (match) {
					console.log("Запрос на редактирование");
					return;

					}
				/// Проверяем не пришла ли команда.
				if (/^[\w\d_]*$/.test(text)){
					console.log("комманда!");
					}
				}

			// then

			// Создание/обновление песни в базе

			});// callback on text




/**Перехват колбеков от кнопок */
chords_bot.on('callback_query', async data => {
		// get_song_{int}
		// Получаем станицу песен
		
		// get_gong_{char}
		// Получаем станицу песен по первой букве

		})//callback_query





