import { isUndefined } from "lodash"
import { FilterQuery } from "mongoose"
import { checkAndGetObjectId } from "../../utils/utils"
import { Comment, CommentModel } from "./schema"

class CommentDbModel {
	async findAll({
		_id,
		answerId,
		userId,
	}: {
		_id?: string
		answerId?: string
		userId?: string
	} = {}) {
		const tokenFindFilter: FilterQuery<Comment> = {}
		if (!isUndefined(_id)) tokenFindFilter._id = checkAndGetObjectId(_id)
		if (!isUndefined(answerId))
			tokenFindFilter.answerId = checkAndGetObjectId(answerId)
		if (!isUndefined(userId)) tokenFindFilter.userId = checkAndGetObjectId(userId)

		return CommentModel.find(tokenFindFilter).lean()
	}

	async findById(commentId: string) {
		return CommentModel.findById(commentId).lean()
	}

	async findByIdAndUpdate(answerId: string, update: Partial<Comment>) {
		const tokenUpdate: Partial<Comment> = {}
		if (!isUndefined(update.content)) tokenUpdate.content = update.content
		if (!isUndefined(update.upvoteIds)) tokenUpdate.upvoteIds = update.upvoteIds
		if (!isUndefined(update.downvoteIds)) tokenUpdate.downvoteIds = update.downvoteIds

		return CommentModel.findByIdAndUpdate(answerId, tokenUpdate, {
			new: true,
		}).lean()
	}

	async create(comment: Partial<Comment>) {
		return CommentModel.create({
			...comment,
		})
	}
	async deleteById(commentId: string) {
		return CommentModel.deleteOne({ _id: commentId }).lean()
	}
}

export const useCommentDbModel = () => new CommentDbModel()
