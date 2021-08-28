import { MongoClient } from "mongodb"
import configs from "../../core/configs"

const { host, port } = configs.mongodb
export async function mongoClient() {
	const url = `mongodb://${host}:${port}?retryWrites=false`
	return MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
}
