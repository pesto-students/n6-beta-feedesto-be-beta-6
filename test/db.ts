import { InvalidArgumentError } from "@hkbyte/webapi"
import { Environment } from "../src/utils/enums"
import config from "../src/utils/configs"
import mongoose from "mongoose"
import { initiateMongoClient } from "../src/db"
import configs from "../src/utils/configs"

const { host, port, name: dbName } = configs.mongodb

export async function cleanDatabase() {
	if (config.server.environment != Environment.TEST) {
		throw new InvalidArgumentError("Environment is not set to test mode")
	}
	const url = `mongodb://${host}:${port}?retryWrites=false`
	const instance = await mongoose.connect(url, { dbName })
	await instance.connection.dropDatabase()
	await instance.connection.close()

	await initiateMongoClient().then((db) => {
		console.log(`Database connected: ${db.connection.name}`)
	})
}
