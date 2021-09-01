import { FilterQuery } from "mongoose"
import { checkAndGetObjectId } from "../../utils/utils"
import { Answer, AnswerModel } from "./schema"

class AnswerDbModel {
	async findAll({
		id,
		discussionId,
		userId,
	}: {
		id?: string
		discussionId?: string
		userId?: string
	} = {}) {
		const tokenFindFilter: FilterQuery<Answer> = {}
		if (id) tokenFindFilter._id = checkAndGetObjectId(id)
		if (discussionId) tokenFindFilter.discussionId = discussionId
		if (userId) tokenFindFilter.userId = userId

		return AnswerModel.find(tokenFindFilter).sort({ upvoteIds: -1 }).lean()
	}

	async findById(answerId: string) {
		return AnswerModel.findById(answerId).lean()
	}

	async create(answer: Partial<Answer>) {
		return AnswerModel.create({
			...answer,
		})
	}
	async deleteById(answerId: string) {
		return AnswerModel.deleteOne({ answerId }).lean()
	}
}

export const useAnswerDbModel = () => new AnswerDbModel()
