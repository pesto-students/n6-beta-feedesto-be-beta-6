import _ from "lodash"
import { FilterQuery } from "mongoose"
import { checkAndGetObjectId } from "../../utils/utils"
import { Answer, AnswerModel } from "./schema"

class AnswerDbModel {
	async findAll({
		_id,
		discussionId,
		userId,
	}: {
		_id?: string
		discussionId?: string
		userId?: string
	} = {}) {
		const tokenFindFilter: FilterQuery<Answer> = {}
		if (_id) tokenFindFilter._id = checkAndGetObjectId(_id)
		if (discussionId) tokenFindFilter.discussionId = checkAndGetObjectId(discussionId)
		if (userId) tokenFindFilter.userId = checkAndGetObjectId(userId)

		return AnswerModel.find(tokenFindFilter).sort({ upvoteIds: -1 }).lean()
	}

	async findById(answerId: string) {
		return AnswerModel.findById(answerId).lean()
	}

	async findByIdAndUpdate(discussionId: string, update: Partial<Answer>) {
		const tokenUpdate: Partial<Answer> = {}
		if (!_.isUndefined(update.content)) tokenUpdate.content = update.content
		if (!_.isUndefined(update.upvoteIds)) tokenUpdate.upvoteIds = update.upvoteIds
		if (!_.isUndefined(update.downvoteIds)) tokenUpdate.upvoteIds = update.upvoteIds

		return AnswerModel.findByIdAndUpdate(discussionId, tokenUpdate, {
			new: true,
		}).lean()
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
