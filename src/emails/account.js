/** @format */

const mailgun = require('mailgun-js')
require('dotenv').config()
const DOMAIN = process.env.MAILGUN_DOMAIN_NAME
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN})
// const data = {
// 	from: 'Excited User <me@samples.mailgun.org>',
// 	to: '619pavanrko@gmail.com',
// 	subject: 'Hello',
// 	text: 'Testing Mailgun!',
// }
// mg.messages().send(data, function (error, body) {
// 	if (error) throw new Error(error.message)
// })

const sendWelcomeEmail = function (email, name) {
	const data = {
		to: email,
		from: 'Ghana <chindukuripavan@gmail.com>',
		subject: 'Thanks for joining in! Welcome.',
		text: `Welcome to the app, ${name}. Let me know if you have any questions`,
	}
	mg.messages().send(data, function (error, body) {
		if (error) throw new Error(error.message)
	})
}
const sendCancellationEmail = function (email, name) {
	const data = {
		to: email,
		from: 'Ghana <me@samples.mailgun.org>',
		subject: 'Sorry! To see you go.',
		text: `Goodbye!, ${name}. Hope to see you back sometime soon`,
	}
	mg.messages().send(data, function (error, body) {
		if (error) throw new Error(error.message)
	})
}

module.exports = {
	sendWelcomeEmail,
	sendCancellationEmail,
}
