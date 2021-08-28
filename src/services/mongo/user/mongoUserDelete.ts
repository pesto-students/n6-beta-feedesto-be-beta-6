import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export async function mongoUserDelete({ id }: { id: string }) {
	const db = await mongoRunner()

	const updateUsers = await db
		.collection(collection.users)
		.deleteOne({ _id: checkAndGetObjectId(id) })

	return updateUsers.result.ok
}
