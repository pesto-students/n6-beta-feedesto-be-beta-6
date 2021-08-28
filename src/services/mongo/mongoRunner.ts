import configs from "../../core/configs"
import { mongoClient } from "./mongoClient"

export async function mongoRunner() {
	const client = await mongoClient()
	return client.db(configs.mongodb.name)
}
