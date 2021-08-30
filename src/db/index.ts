import mongoose from "mongoose"
import configs from "../core/configs"

const { host, port, name } = configs.mongodb

export async function initiateMongoClient() {
	const url = `mongodb://${host}:${port}?retryWrites=false`
	return mongoose.connect(url, {
		dbName: name,
	})
}
