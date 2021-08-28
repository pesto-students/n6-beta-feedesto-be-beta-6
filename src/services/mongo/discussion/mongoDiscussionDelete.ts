import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export async function mongoDiscussionDelete({ id }: { id: string }) {
	const db = await mongoRunner()

	const updateDiscussions = await db
		.collection(collection.discussions)
		.deleteOne({ _id: checkAndGetObjectId(id) })

	return updateDiscussions.result.ok
}
