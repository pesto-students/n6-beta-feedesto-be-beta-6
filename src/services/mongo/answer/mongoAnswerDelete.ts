import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export async function mongoAnswerDelete({ id }: { id: string }) {
	const db = await mongoRunner()

	const updateAnswers = await db
		.collection(collection.answers)
		.deleteOne({ _id: checkAndGetObjectId(id) })

	return updateAnswers.result.ok
}
