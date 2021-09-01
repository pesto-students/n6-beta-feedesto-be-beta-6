import { NotFoundError, sendResponseError, WebApiServer } from "@hkbyte/webapi"
import apiRoutes from "./controller/apis/routes"
import configs from "./utils/configs"
import { initiateMongoClient } from "./db"

const server = new WebApiServer(configs.server.port, { cors: true, helmet: true })

server.addWebApis(...apiRoutes)

server.addMiddlewares((_req, res, next) => {
	sendResponseError(res, new NotFoundError("Request API not found"), {})
	next()
})

server.start().then((port) => {
	initiateMongoClient().then((db) => {
		console.log(`Database connected: ${db.connection.name}`)
	})
	console.log(`Server listening on port: ${port}`)
})

export default server
