import _ from "lodash"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export async function mongoDiscussionUpdate({
	id,
	update,
}: {
	id: string
	update: {
		title?: string
		description?: string
		startDate?: string
		endDate?: string
	}
}) {
	const tokenUpdate: any = { modifiedAt: new Date() }
	if (!_.isUndefined(update.title)) tokenUpdate.title = update.title
	if (!_.isUndefined(update.description)) tokenUpdate.description = update.description
	if (!_.isUndefined(update.startDate))
		tokenUpdate.startDate = new Date(update.startDate)
	if (!_.isUndefined(update.endDate)) tokenUpdate.endDate = new Date(update.endDate)

	const db = await mongoRunner()

	const updateDiscussions = await db
		.collection(collection.discussions)
		.updateOne({ _id: checkAndGetObjectId(id) }, { $set: tokenUpdate })

	return updateDiscussions.result.ok
}
