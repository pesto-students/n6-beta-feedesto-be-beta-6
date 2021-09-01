import isUndefined from "lodash/isUndefined"

import { Discussion, DiscussionModel } from "./schema"

import { checkAndGetObjectId } from "../../services/mongo/utils"

class DiscussionDbModel {
	async findAll({
		id,
		participantId,
		viewerId,
		organizationId,
	}: {
		id?: string
		participantId?: string
		viewerId?: string
		organizationId?: string
	}) {
		const tokenFindFilter: any = {}
		if (id) tokenFindFilter._id = checkAndGetObjectId(id)
		if (participantId) tokenFindFilter.participantIds = { $elemMatch: participantId }
		if (viewerId) tokenFindFilter.viewerIds = { $elemMatch: participantId }
		if (organizationId) tokenFindFilter.organizationId = organizationId

		return DiscussionModel.find({ tokenFindFilter }).lean()
	}

	async findById(discussionId: string) {
		return DiscussionModel.findById(discussionId).lean()
	}
	async findByIdAndUpdate(discussionId: string, update: Discussion) {
		const tokenUpdate: any = {}
		if (!isUndefined(update.title)) tokenUpdate.title = update.title
		if (!isUndefined(update.description)) tokenUpdate.description = update.description
		if (!isUndefined(update.upvoteIds)) tokenUpdate.upvoteIds = update.upvoteIds
		if (!isUndefined(update.downvoteIds)) tokenUpdate.upvoteIds = update.upvoteIds

		if (!isUndefined(update.startDate))
			tokenUpdate.startDate = new Date(update.startDate.toString())
		if (!isUndefined(update.endDate))
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
