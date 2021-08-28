import { ForbiddenError, InternalServerError } from "@hkbyte/webapi"
import { collection } from "../collections"
import { mongoAnswerList } from "../answer/mongoAnswerList"
import { mongoRunner } from "../mongoRunner"
import { mongoDiscussionList } from "../discussion/mongoDiscussionList"

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

	const [discussion] = await mongoDiscussionList({
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
