import { ForbiddenError, InternalServerError } from "@hkbyte/webapi"
import { collection } from "../collections"
import { fetchDiscussions } from "../discussion"
import { mongoRunner } from "../mongoRunner"

export async function mongoAnswerAdd({
	content,
	discussionId,
	userId,
}: {
	discussionId: string
	userId: string
	content: string
}): Promise<string> {
	const [discussion] = await fetchDiscussions({
		id: discussionId,
		participantId: userId,
	})
	if (!discussion) {
		throw new ForbiddenError("User is not allowed to answer to this Discussion")
	}

	const db = await mongoRunner()
	const insertAnswer = await db.collection(collection.answers).insertOne({
		content,
		discussionId,
		userId,
		createdAt: new Date(),
		modifiedAt: new Date(),
	})
	if (!insertAnswer?.insertedId) {
		throw new InternalServerError("Something went wrong: unable to add Answer")
	}
	return insertAnswer.insertedId.toString()
}
