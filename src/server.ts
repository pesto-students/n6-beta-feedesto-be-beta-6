import { NotFoundError, sendResponseError, WebApiServer } from "@hkbyte/webapi"
import apiRoutes from "./controller/apis/routes"
import configs from "./utils/configs"
import { initiateMongoClient } from "./db"

import { agenda } from "./agenda"
import bugsnag from "./bugsnag"

import eventEmitter from "./eventEmitter"
import { sendMail } from "./mailer"

import frontEndWebsocket from "./socket"

const middleware = bugsnag.getPlugin("express")

const server = new WebApiServer(configs.server.port, { cors: true, helmet: true })

if (middleware?.requestHandler) server.server.use(middleware.requestHandler)

server.addWebApis(...apiRoutes)

server.addMiddlewares((_req, res, next) => {
	sendResponseError(res, new NotFoundError("Request API not found"), {})
	next()
})

server.start().then((port) => {
	initiateMongoClient().then((db) => {
		console.log(`Database connected: ${db.connection.name}`)
	})

	//schedule jobs here
	agenda.on("ready", async () => {
		//listen for events and perform some action like emit to socket or schedule jobs
		eventEmitter.on("startDiscussion", ({ object, time }: any) => {
			if (time) {
				agenda.schedule(new Date(time), "startDiscussion", {
					discussionId: object._id,
				})
			}
		})

		eventEmitter.on("endDiscussion", ({ object, time }: any) => {
			if (time) {
				agenda.schedule(new Date(time), "endDiscussion", {
					discussionId: object._id,
				})
			}
		})
		eventEmitter.on("sendMail", async ({ object }: any) => {
			if (object) {
				await sendMail(object)
			}
		})

		eventEmitter.on(
			"emitToFrontEndClient",
			({ topic, model, object, action }: any) => {
				frontEndWebsocket.emit(topic, { model, object, action })
			},
		)
	})

	console.log(`Server listening on port: ${port}`)
})

if (middleware?.errorHandler) server.server.use(middleware.errorHandler)

export default server
