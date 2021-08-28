import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export async function mongoCommentDelete({ id }: { id: string }) {
	const db = await mongoRunner()

	const updateComments = await db
		.collection(collection.comments)
		.deleteOne({ _id: checkAndGetObjectId(id) })

	return updateComments.result.ok
}
