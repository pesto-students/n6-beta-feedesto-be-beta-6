import { ForbiddenError, InternalServerError } from "@hkbyte/webapi"
import { mongoAnswerList } from "../answer/mongoAnswerList"
import { collection } from "../collections"
import { fetchDiscussions } from "../discussion"
import { mongoRunner } from "../mongoRunner"

export async function mongoCommentAdd({
	content,
	answerId,
	userId,
}: {
	answerId: string
	userId: string
	content: string
}): Promise<string> {
	const [answer] = await mongoAnswerList({ id: answerId })
	const discussionId = answer.discussionId

	const [discussion] = await fetchDiscussions({
		id: discussionId,
		participantId: userId,
	})
	if (!discussion) {
		throw new ForbiddenError("User is not allowed to add comment to this Discussion")
	}

	const db = await mongoRunner()
	const insertComment = await db.collection(collection.comments).insertOne({
		content,
		answerId,
		userId,
		createdAt: new Date(),
		modifiedAt: new Date(),
	})
	if (!insertComment?.insertedId) {
		throw new InternalServerError("Something went wrong: unable to add Comment")
	}
	return insertComment.insertedId.toString()
}
