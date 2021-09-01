import { InternalServerError, InvalidArgumentError } from "@hkbyte/webapi"
import _ from "lodash"
import { LeanDocument } from "mongoose"
import { useCommentDbModel } from "../../dbModel"
import { Comment } from "../../dbModel"
import { checkAndGetObjectId } from "../../utils/utils"

export async function fetchComments({
	_id,
	answerId,
	userId,
}: {
	_id?: string
	answerId?: string
	userId?: string
} = {}): Promise<LeanDocument<Comment>[]> {
	const commentModel = useCommentDbModel()

	if (_id) {
		const comment = await commentModel.findById(_id)
		return comment ? [comment] : []
	}

	if (answerId) {
		return commentModel.findAll({ answerId })
	}

	if (userId) {
		return commentModel.findAll({ userId })
	}

	return commentModel.findAll()
}

export async function addComment({
	content,
	answerId,
	userId,
}: {
	answerId: string
	userId: string
	content: string
}): Promise<string> {
	const commentModel = useCommentDbModel()

	const insertComment = await commentModel.create({
		content,
		answerId: checkAndGetObjectId(answerId),
		userId: checkAndGetObjectId(userId),
	})
	if (!insertComment) {
		throw new InternalServerError("Something went wrong: unable to add comment")
	}

	return insertComment._id.toString()
}

export async function deleteComment({ _id }: { _id: string }) {
	const commentModel = useCommentDbModel()

	if (!_id) {
		throw new InvalidArgumentError("Filter missing for deleting comment")
	}

	await commentModel.deleteById(_id)
}
