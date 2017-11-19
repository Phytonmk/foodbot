
const server = 'http://91.225.131.180:3000';

const TelegramBot = require('node-telegram-bot-api');
const token = '404391918:AAFEFPhVCoVNAqobWug2zLY1W3XoMo4rlhw';
const bot = new TelegramBot(token, {polling: true});
const axios = require('axios');

bot.on('message', msg => {
	const chatId = msg.chat.id;
	axios(server + '/api/recipe_with_ingredients/' + msg.text).then((response) => {
		if (response.data.split('\n').length == 0) {
			bot.sendMessage(chatId, 'I haven\'t found anything');
		} else {
			bot.sendMessage(chatId, 'Wov!', {reply_markup: {inline_keyboard: [[{text: 'Let\'s start!', callback_data: '0|' + msg.text}]]}});
		}
	});
});
bot.on('callback_query', msg => {
	const chatId = msg.message.chat.id;
	let data = msg.data.split('|');
	let number = data[0];
	data.splice(0, 1);
	data = data.join('|');
	axios(server + '/api/recipe_with_ingredients/' + data).then((response) => {
		console.log(response.data.split(/\r\n\r\n/g), number);
		if (response.data.split(/\r\n\r\n/g)[number]) {
			// axios('http://api.voicerss.org/?key=dfe5ce71acd342018bfbd4a9b1e91f48&hl=en-us&src=' + data[number]).then((response) => {
				if (response.data.split(/\r\n\r\n/g)[number * 1 + 1]) {
					bot.sendVoice(chatId, 'http://api.voicerss.org/?key=dfe5ce71acd342018bfbd4a9b1e91f48&hl=en-us&src=' + response.data.split(/\r\n\r\n/g)[number] + ' ', {reply_markup: {inline_keyboard: [[{text: 'Next!', callback_data: (number + 1) + '|' + data.join(/\n\n/g)}]]}}).catch(console.log);
				} else {
					bot.sendVoice(chatId, 'http://api.voicerss.org/?key=dfe5ce71acd342018bfbd4a9b1e91f48&hl=en-us&src=' + response.data.split(/\r\n\r\n/g)[number] + ' ', {caption: 'Completed!'}).catch(console.log);
				}
			// });
		}
	}).catch(console.log)
})