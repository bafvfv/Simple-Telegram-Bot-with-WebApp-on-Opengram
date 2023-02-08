const { Opengram, Markup, Extra } = require("opengram");
require("dotenv").config();

const axios = require("axios");

const fs = require("fs");

const mysql = require('mysql2/promise');

const bot = new Opengram(process.env.BOT_TOKEN);

/*
		If you doesn't have database, you can explore object with table of goods, 
		so forget about commands and after getting data from main button, 
		call into invoice 
			price: PRICE[`ctx.message.web_app_data.data`],
	*/
const PRICE = {
	'1': [{label: 'Pizza Margarita', amount: 6500000}],
	// and etc
};

//administrators id in telegram
const adminId = 1111111;

// link to your webApp
const web_link = "https://webapp.yourDomain.io"; 

// recording logs to hosting
bot.use(Opengram.log()); 

// starting bot command
bot.command('start', async (ctx) => {
	await ctx.reply('Hello, choose a food', Extra.markup( Markup.keyboard([
		Markup.webApp(`Menu`, `${web_link}`),
	])
	.resize()
	));
});

/* adding good to database in format:

/addGT 8Classic Burger20000burger.png

where /addGT - command,

8 - id of good,

Classic Burger - title of good,

20000 - cost of burger in Indonesian currency,

burger.png - name of good photo

So, if you use another currency or id, you must change slice() method params and id, name, picName variables.

*/
bot.command('addGT', async (ctx) => {
    let input = ctx.message.text.split(/(\d)/)
    let amount = input.slice(3, 12).join('')
    let id = input[1]
    let name = input[2]
    let picName = input[12]
    await mysql.createConnection({host: 'localhost', user: 'your_db_user', password: 'your_password', database: 'your_db'})
			.then(con => con.query(`insert into goods(id, price, title, pic) values(?, ?, ?, ?)`, [id, amount, name, picName]))
			.catch(console.log())
});


/* updating good cost in format:

/updGCost 8 75000

where /updGCost - command,

8 - id of good in database,

75000 - new cost of good in Indonesian currency

*/
bot.command('updGCost', async (ctx) => {
    let input = ctx.message.text.split(' ')
    let id = input[1]
    let amount = input[2]
    await mysql.createConnection({host: 'localhost', user: 'your_db_user', password: 'your_password', database: 'your_db'})
			.then(con => con.query(`update goods set price=? where id=?`, [amount, id]))
			.catch(console.log())
});

/* deleting a good in format:

/delGood 8

where /delGood - command,

8 - id of good in database

*/
bot.command('delGood', async (ctx) => {
	let input = ctx.message.text.split(' ')
	let id = input[1]
	await mysql.createConnection({host: 'localhost', user: 'your_db_user', password: 'your_password', database: 'your_db'})
			.then(con => con.query(`delete from goods where id=?`, [id]))
			.catch(console.log())
});


//  uploading photo to hosting
bot.on('photo', async (ctx) => {
    let fileId = ctx.message.photo.pop().file_id // taking photo from context
    let userId = ctx.message.from.id // telegram user id
    let title = ctx.message.caption // taking title of photo from caption
    if (userId === adminId) { // if photo sends admin - passing to upload photo
        await bot.telegram.getFileLink(fileId).then(url => {
            axios({url, responseType:'stream'}).then(response => {
                return new Promise((resolve, reject) => {
                    response.data.pipe(fs.createWriteStream(`/way_to_folder_where_your/webapp.yourDomain.io/${title}.png`)) 
                })
            })
        })
        await ctx.reply('Thanks, photo uploaded')
    }
    else {
        await ctx.reply('Sorry, you aren\'t admin')
    }
});

bot.on('web_app_data', async (ctx) => {
    let id = ctx.message.web_app_data.data
    await mysql.createConnection({host: 'localhost', user: 'your_db_user', password: 'your_password', database: 'your_db'})
        .then(con => con.query(`select price, title from goods where id=?`, [id]))
        .then(([rows, fields]) => {
            let cost = rows[0].price
            let name = rows[0].title
            console.log(cost, name)
            return ctx.replyWithInvoice(ctx.chat.id,
		        {
			        title:'yourTradeMark',
			        description:'Payment for food delivery',
			        provider_token: process.env.PROVIDER_TOKEN,
			        currency: 'IDR',
			        need_phone_number: true,
			        prices: [{ label: name, amount: 100 * cost }],
			        start_parameter: 'get_access',
			        payload: 'some_invoice'
		        }
	        )
        })
        .catch(console.log())
});

bot.on('pre_checkout_query', async (ctx) => {
	await ctx.answerPreCheckoutQuery(true);
});

bot.on('successful_payment', async (ctx) => {
	await ctx.reply(`Welldone ${ctx.from.first_name} - now send me your location`)
});

bot.on('location', async (ctx) => {
    await ctx.reply('Thanks for location.')
})

bot.launch({
	drop_pending_updates: true,
	webhook: {
        domain: 'https://yourDomain.io',
        port: 3006
    }
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop()) //('SIGINT'))
process.once('SIGTERM', () => bot.stop()) //('SIGTERM'))