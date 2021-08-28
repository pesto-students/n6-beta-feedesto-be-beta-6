import _ from "lodash"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export async function mongoAnswerUpdate({
	id,
	update,
}: {
	id: string
	update: {
		content?: string
	}
}) {
	const tokenUpdate: any = { modifiedAt: new Date() }
	if (!_.isUndefined(update.content)) tokenUpdate.content = update.content

	const db = await mongoRunner()

	const updateAnswers = await db
		.collection(collection.answers)
		.updateMany({ _id: checkAndGetObjectId(id) }, { $set: tokenUpdate })

	return updateAnswers.result.ok
}
