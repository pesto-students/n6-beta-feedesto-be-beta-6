import _ from "lodash"
import { FilterQuery } from "mongoose"
import { checkAndGetObjectId } from "../../utils/utils"
import { Discussion, DiscussionModel } from "./schema"

class DiscussionDbModel {
	async findAll({
		_id,
		participantId,
		viewerId,
		organizationId,
	}: {
		_id?: string
		participantId?: string
		viewerId?: string
		organizationId?: string
	} = {}) {
		const tokenFindFilter: FilterQuery<Discussion> = {}
		if (_id) tokenFindFilter._id = checkAndGetObjectId(_id)
		if (participantId)
			tokenFindFilter.participantIds = { $elemMatch: { participantId } }
		if (viewerId) tokenFindFilter.viewerIds = { $elemMatch: { participantId } }
		if (organizationId) tokenFindFilter.organizationId = organizationId

		return DiscussionModel.find(tokenFindFilter).lean()
	}

	async findById(discussionId: string) {
		return DiscussionModel.findById(discussionId).lean()
	}

	async findByIdAndUpdate(discussionId: string, update: Partial<Discussion>) {
		const tokenUpdate: Partial<Discussion> = {}
		if (!_.isUndefined(update.title)) tokenUpdate.title = update.title
		if (!_.isUndefined(update.description))
			tokenUpdate.description = update.description
		if (!_.isUndefined(update.upvoteIds)) tokenUpdate.upvoteIds = update.upvoteIds
		if (!_.isUndefined(update.downvoteIds)) tokenUpdate.upvoteIds = update.upvoteIds

		if (!_.isUndefined(update.startDate))
			tokenUpdate.startDate = new Date(update.startDate.toString())
		if (!_.isUndefined(update.endDate))
			tokenUpdate.endDate = new Date(update.endDate.toString())

		return DiscussionModel.findByIdAndUpdate(discussionId, tokenUpdate, {
			new: true,
		}).lean()
	}

	async create(discussion: Partial<Discussion>) {
		return DiscussionModel.create({
			...discussion,
		})
	}

	async deleteById(discussionId: string) {
		return DiscussionModel.deleteOne({ discussionId }).lean()
	}
}

export const useDiscussionDbModel = () => new DiscussionDbModel()
