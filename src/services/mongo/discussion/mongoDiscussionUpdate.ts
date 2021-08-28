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
	if (!_.isUndefined(update.title)) tokenUpdate.name = update.title
	if (!_.isUndefined(update.description)) tokenUpdate.isVerified = update.description
	if (!_.isUndefined(update.startDate))
		tokenUpdate.isVerified = new Date(update.startDate)
	if (!_.isUndefined(update.endDate)) tokenUpdate.isVerified = new Date(update.endDate)

	const db = await mongoRunner()

	const updateDiscussions = await db
		.collection(collection.discussions)
		.updateMany({ _id: checkAndGetObjectId(id) }, { $set: tokenUpdate })

	return updateDiscussions.result.ok
}
