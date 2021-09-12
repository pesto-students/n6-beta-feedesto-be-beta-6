import { InvalidArgumentError } from "@hkbyte/webapi"
import { Environment } from "../src/utils/enums"
import config from "../src/utils/configs"
import mongoose from "mongoose"
import { initiateMongoClient } from "../src/db"

export async function cleanDatabase() {
	if (config.server.environment != Environment.TEST) {
		throw new InvalidArgumentError("Environment is not set to test mode")
	}
	const instance = await mongoose.connect("mongodb://localhost:27017/mongo2")
	await instance.connection.dropDatabase()
	await instance.connection.close()

	await initiateMongoClient().then((db) => {
		console.log(`Database connected: ${db.connection.name}`)
	})
}
