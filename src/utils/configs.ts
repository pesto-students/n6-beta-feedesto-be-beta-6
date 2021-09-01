import dotenv from "dotenv"
import { Environment } from "./enums"

dotenv.config()

export default {
	server: {
		environment: (process.env.NODE_ENV as Environment) ?? Environment.DEVELOPMENT,
		port: process.env.PORT,
		name: process.env.APP_NAME ?? "serverName",
	},
	mongodb: {
		host: process.env.MONGODB_HOST || "localhost",
		port: process.env.MONGODB_PORT ? +process.env.MONGODB_PORT : 27017,
		name: process.env.MONGODB_NAME ?? "mongo",
	},
}
