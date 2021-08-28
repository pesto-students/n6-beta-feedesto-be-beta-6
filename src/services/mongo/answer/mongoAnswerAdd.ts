import { ForbiddenError, InternalServerError } from "@hkbyte/webapi"
import { collection } from "../collections"
import { mongoDiscussionList } from "../discussion/mongoDiscussionList"
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
	const [discussion] = await mongoDiscussionList({
		id: discussionId,
		participantId: userId,
	})

	if (!discussion) {
		throw new ForbiddenError("User is not allowed to answer to this Discussion")
	}

	const db = await mongoRunner()

	const insertAnswer = await db.collection(collection.discussions).insertOne({
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
