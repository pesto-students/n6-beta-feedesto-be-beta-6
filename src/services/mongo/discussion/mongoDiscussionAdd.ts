import { InternalServerError } from "@hkbyte/webapi"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"

export async function mongoDiscussionAdd({
	title,
	description,
	startDate,
	endDate,
	participantIds,
	viewerIds,
}: {
	title: string
	description: string
	startDate: string
	endDate: string
	participantIds: string[]
	viewerIds: string[]
}): Promise<string> {
	const db = await mongoRunner()

	const insertDiscussion = await db.collection(collection.discussions).insertOne({
		title,
		description,
		startDate,
		endDate,
		participantIds,
		viewerIds,
		createdAt: new Date(),
		modifiedAt: new Date(),
	})
	if (!insertDiscussion?.insertedId) {
		throw new InternalServerError("Something went wrong: unable to add Discussion")
	}
	return insertDiscussion.insertedId.toString()
}
