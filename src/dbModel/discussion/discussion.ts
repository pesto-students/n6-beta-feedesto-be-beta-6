import isUndefined from "lodash/isUndefined"
import { FilterQuery } from "mongoose"
import eventEmitter from "../../eventEmitter"
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
		if (participantId) tokenFindFilter.participantIds = participantId
		if (viewerId) tokenFindFilter.viewerIds = viewerId
		if (organizationId)
			tokenFindFilter.organizationId = checkAndGetObjectId(organizationId)

		return DiscussionModel.find(tokenFindFilter).lean()
	}

	async findById(discussionId: string) {
		return DiscussionModel.findById(discussionId).lean()
	}

	async findByIdAndUpdate(discussionId: string, update: Partial<Discussion>) {
		const tokenUpdate: Partial<Discussion> = {}
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

	async findByIdAndUpdateStatus(discussionId: string, update: { isLive: boolean }) {
		return DiscussionModel.findByIdAndUpdate(
			discussionId,
			{ isLive: update.isLive },
			{
				new: true,
			},
		).lean()
	}

	async create(discussion: Partial<Discussion>) {
		const object = await DiscussionModel.create({
			...discussion,
		})
		if (discussion.startDate)
			eventEmitter.emit("startDiscussion", {
				topic: "discussion",
				model: "discussionDbModel",
				time: object.startDate,
				object,
				action: "create",
			})

		if (discussion.endDate)
			eventEmitter.emit("endDiscussion", {
				topic: "discussion",
				model: "discussionDbModel",
				time: object.endDate,
				object,
				action: "create",
			})

		return object
	}

	async deleteById(discussionId: string) {
		return DiscussionModel.deleteOne({ _id: discussionId }).lean()
	}
}

export const useDiscussionDbModel = () => new DiscussionDbModel()
