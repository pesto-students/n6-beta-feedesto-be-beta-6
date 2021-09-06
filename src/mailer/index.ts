import nodemailer from "nodemailer"

import SMTPTransport from "nodemailer"

import configs from "../utils/configs"

export function sendMail(data: { email: string; text: string }) {
	return new Promise((resolve, reject) => {
		let mailOptions = {
			from: '"Feedesto" <feedestoofficial@gmail.com>',
			to: data.email,
			subject: "Verification status on feedesto",
			html: `<b><u>Congrats you have been verified "${data.text}"</u></b>`,
		}

		nodemailer
			.createTransport({
				host: "smtp-relay.sendinblue.com",
				port: 587,
				secure: false,

				auth: {
					pass: configs.mailer.pass,
					user: configs.mailer.user,
				},
			} as SMTPTransport.TransportOptions)
			.sendMail(mailOptions, (err, info) => {
				if (err) {
					console.log("eee", err)
					reject(err)
				} else {
					console.log("info", info)

					resolve(info)
				}
			})
	})
}
