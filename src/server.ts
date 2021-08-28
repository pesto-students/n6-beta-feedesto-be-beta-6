import { express, NotFoundError, sendResponseError, WebApiServer } from '@hkbyte/webapi'
import apiRoutes from './controller/apis/routes'
import configs from './core/configs'

const server = new WebApiServer(configs.server.port, { cors: true, helmet: true })

server.addMiddlewares(express.static('static'))
server.addWebApis(...apiRoutes)

server.addMiddlewares((_req, res, next) => {
	sendResponseError(res, new NotFoundError('Request API not found'), {})
	next()
})

server.start().then((port) => {
	console.log(`Server listening on port: ${port}`)
})

export default server
