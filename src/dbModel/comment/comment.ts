import { FilterQuery } from "mongoose"
import { checkAndGetObjectId } from "../../utils/utils"
import { Comment, CommentModel } from "./schema"

class CommentDbModel {
	async findAll({
		id,
		answerId,
		userId,
	}: {
		id?: string
		answerId?: string
		userId?: string
	} = {}) {
		const tokenFindFilter: FilterQuery<Comment> = {}
		if (id) tokenFindFilter._id = checkAndGetObjectId(id)
		if (answerId) tokenFindFilter.answerId = checkAndGetObjectId(answerId)
		if (userId) tokenFindFilter.userId = checkAndGetObjectId(userId)

		return CommentModel.find(tokenFindFilter).lean()
	}

	async findById(commentId: string) {
		return CommentModel.findById(commentId).lean()
	}

	async create(comment: Partial<Comment>) {
		return CommentModel.create({
			...comment,
		})
	}
	async deleteById(commentId: string) {
		return CommentModel.deleteOne({ commentId }).lean()
	}
}

export const useCommentDbModel = () => new CommentDbModel()
