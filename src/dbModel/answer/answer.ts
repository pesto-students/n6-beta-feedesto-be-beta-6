import _ from "lodash"
import { FilterQuery, PopulateOptions, Types } from "mongoose"

import { checkAndGetObjectId } from "../../utils/utils"
import { Answer, AnswerModel } from "./schema"

const { ObjectId } = Types

class AnswerDbModel {
	async findAll({
		_id,
		pageNumber = 1,
		limit = 10,
		discussionId,
		userId,
	}: {
		_id?: string,
		pageNumber?: number
		limit?: number
		discussionId?: string
		userId?: string
	} = {}) {
		const tokenFindFilter: FilterQuery<Answer> = {}
		if (_id) tokenFindFilter._id = new ObjectId(_id)
		if (discussionId) tokenFindFilter.discussionId = new ObjectId(discussionId)
		if (userId) tokenFindFilter.userId = new ObjectId(userId)

		let skip = (pageNumber - 1) * limit;


		const query: any = [
			{ $match: tokenFindFilter },
			{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: 'userId'
				}
			},
			{ $unwind: '$userId' },
			{
				$lookup: {
					from: 'users',
					localField: 'upvoteIds',
					foreignField: '_id',
					as: 'upvoteIds'
				}
			},
			{ $unwind: '$upvoteIds' },
			{
				$lookup: {
					from: 'users',
					localField: 'downvoteIds',
					foreignField: '_id',
					as: 'downvoteIds'
				}
			},
			{ $unwind: '$downvoteIds' },
			{
				$lookup: {
					from: 'comments',
					let: { answerId: '$_id' },
					pipeline: [
						{ $match: { $expr: { $eq: ['$answerId', '$$answerId'] } } }
					],
					as: 'comments'
				}
			},
			{ $sort: { upvoteIds: -1 } },
			{
				$facet: {
					metadata: [{ $count: 'total' }, { $addFields: { pageNumber, limit, skip } }],
					documents: [
						{ $skip: skip },
						{ $limit: limit },]
				}
			},
			{
				$project: {
					metadata: { $ifNull: [{ $arrayElemAt: ['$metadata', 0] }, { count: 0, pageNumber, limit, skip }] },
					documents: 1,
				},
			}

		]

		// return AnswerModel.find(tokenFindFilter)
		// 	.populate(<PopulateOptions>{
		// 		path: "userId upvoteIds downvoteIds",
		// 	})
		// 	.populate(<PopulateOptions>{
		// 		path: "commentIds",
		// 		populate: {
		// 			path: "userId upvoteIds downvoteIds",
		// 		},
		// 	})
		// 	.sort({ upvoteIds: -1 })
		// 	.lean()

		return AnswerModel.aggregate(query).allowDiskUse(true)
	}

	async findById(answerId: string) {
		return AnswerModel.findById(answerId).lean()
	}

	async findByIdAndUpdate(discussionId: string, update: Partial<Answer>) {
		const tokenUpdate: Partial<Answer> = {}
		if (!_.isUndefined(update.content)) tokenUpdate.content = update.content
		if (!_.isUndefined(update.upvoteIds)) tokenUpdate.upvoteIds = update.upvoteIds
		if (!_.isUndefined(update.downvoteIds))
			tokenUpdate.downvoteIds = update.downvoteIds
		if (!_.isUndefined(update.commentIds)) tokenUpdate.commentIds = update.commentIds

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
