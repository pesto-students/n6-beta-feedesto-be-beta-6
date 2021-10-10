import isUndefined from "lodash/isUndefined"
import { FilterQuery, PopulateOptions, Types } from "mongoose"
import { Answer, AnswerModel } from "./schema"

const { ObjectId } = Types

class AnswerDbModel {
	async findAll({
		_id,
		discussionId,
		userId,
	}: {
		_id?: string
		pageNumber?: number
		limit?: number
		discussionId?: string
		userId?: string
	} = {}) {
		const tokenFindFilter: FilterQuery<Answer> = {}
		if (!isUndefined(_id)) tokenFindFilter._id = new ObjectId(_id)
		if (!isUndefined(discussionId))
			tokenFindFilter.discussionId = new ObjectId(discussionId)
		if (!isUndefined(userId)) tokenFindFilter.userId = new ObjectId(userId)

		return AnswerModel.find(tokenFindFilter)
			.populate(<PopulateOptions[]>[
				{
					path: "user upvoters downvoters",
				},
				{
					path: "comments",
					populate: {
						path: "user upvoters downvoters",
					},
				},
			])
			.sort({ upvoteIds: -1 })
			.lean()

		// return AnswerModel.find().aggregate(query).allowDiskUse(true)
	}

	async findById(answerId: string) {
		return AnswerModel.findById(answerId).lean()
	}

	async findScoreByDiscussionId(discussionId: string) {
		const query = [
			{ $match: { discussionId: new ObjectId(discussionId) } },
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "userId",
				},
			},
			{ $unwind: "$userId" },
			{
				$addFields: {
					numberOfUpvotes: { $size: "$upvoteIds" },
					numberOfDownvotes: { $size: "$downvoteIds" },
					score: {
						$subtract: [{ $size: "$upvoteIds" }, { $size: "$downvoteIds" }],
					},
				},
			},
			{ $sort: { score: -1 } },
		]

		return AnswerModel.aggregate(query).allowDiskUse(true)
	}

	async findByIdAndUpdate(answerId: string, update: Partial<Answer>) {
		const tokenUpdate: Partial<Answer> = {}
		if (!isUndefined(update.content)) tokenUpdate.content = update.content
		if (!isUndefined(update.upvoteIds)) tokenUpdate.upvoteIds = update.upvoteIds
		if (!isUndefined(update.downvoteIds)) tokenUpdate.downvoteIds = update.downvoteIds
		if (!isUndefined(update.commentIds)) tokenUpdate.commentIds = update.commentIds

		return AnswerModel.findByIdAndUpdate(answerId, tokenUpdate, {
			new: true,
		}).lean()
	}

	async findByIdAndUpvoteOrDownvote(
		answerId: string,
		update: { upVoteId?: string; downVoteId?: string },
	) {
		const tokenUpdate: any = {}

		if (update.upVoteId)
			tokenUpdate.$addToSet = { upvoteIds: new ObjectId(update.upVoteId) }
		if (update.downVoteId)
			tokenUpdate.$addToSet = { downvoteIds: new ObjectId(update.downVoteId) }

		return AnswerModel.findByIdAndUpdate(answerId, tokenUpdate, {
			new: true,
		}).lean()
	}

	async create(answer: Partial<Answer>) {
		return AnswerModel.create({
			...answer,
		})
	}
	async deleteById(answerId: string) {
		return AnswerModel.deleteOne({ _id: answerId }).lean()
	}
}

export const useAnswerDbModel = () => new AnswerDbModel()
