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

export async function addCommentUpvote({
	commentId,
	userId,
}: {
	commentId: string
	userId: string
}) {
	const commentModel = useCommentDbModel()

	const [comment] = await fetchComments({ _id: commentId })
	if (!comment) {
		throw new InvalidArgumentError("Comment not found")
	}

	const findUserUpvoted = comment.upvoteIds.find((el: any) => el.toString() == userId)
	if (findUserUpvoted) {
		throw new InvalidArgumentError("User has already upvoted to this comment")
	}

	const updateCommentUpvotes = await commentModel.findByIdAndUpdate(commentId, {
		upvoteIds: [...comment.upvoteIds.map((el: any) => el.toString()), userId],
	})
	if (!updateCommentUpvotes) {
		throw new InternalServerError(
			"Something went wrong: unable to add comment upvote",
		)
	}
}

export async function addCommentDownvote({
	commentId,
	userId,
}: {
	commentId: string
	userId: string
}) {
	const commentModel = useCommentDbModel()

	const [comment] = await fetchComments({ _id: commentId })
	if (!comment) {
		throw new InvalidArgumentError("Comment not found")
	}

	const findUserUpvoted = comment.downvoteIds.find((el: any) => el.toString() == userId)
	if (findUserUpvoted) {
		throw new InvalidArgumentError("User has already downvoted to this comment")
	}

	const updateCommentUpvotes = await commentModel.findByIdAndUpdate(commentId, {
		downvoteIds: [...comment.downvoteIds.map((el: any) => el.toString()), userId],
	})
	if (!updateCommentUpvotes) {
		throw new InternalServerError(
			"Something went wrong: unable to add comment downvote",
		)
	}
}

export async function deleteComment({ _id }: { _id: string }) {
	const commentModel = useCommentDbModel()

	if (!_id) {
		throw new InvalidArgumentError("Filter missing for deleting comment")
	}

	await commentModel.deleteById(_id)
}
