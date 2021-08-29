import { InternalServerError } from "@hkbyte/webapi"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"

export async function mongoDiscussionAdd({
	title,
	description,
	startDate,
	organizationId,
	endDate,
	participantIds,
	viewerIds,
}: {
	title: string
	description: string
	startDate: string
	organizationId: string
	endDate: string
	participantIds: string[]
	viewerIds: string[]
}): Promise<string> {
	const db = await mongoRunner()

	const insertDiscussion = await db.collection(collection.discussions).insertOne({
		title,
		description,
		startDate: new Date(startDate),
		endDate: new Date(endDate),
		participantIds,
		viewerIds,
		organizationId,
		createdAt: new Date(),
		modifiedAt: new Date(),
	})
	if (!insertDiscussion?.insertedId) {
		throw new InternalServerError("Something went wrong: unable to add Discussion")
	}
	return insertDiscussion.insertedId.toString()
}
