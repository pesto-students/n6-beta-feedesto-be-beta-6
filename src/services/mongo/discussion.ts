import { InternalServerError, InvalidArgumentError } from "@hkbyte/webapi"
import _ from "lodash"
import { LeanDocument } from "mongoose"
import { useDiscussionDbModel } from "../../dbModel"
import { Discussion } from "../../dbModel"

export async function fetchDiscussions({
	_id,
	participantId,
	viewerId,
	organizationId,
}: {
	_id?: string
	participantId?: string
	viewerId?: string
	organizationId?: string
} = {}): Promise<LeanDocument<Discussion>[]> {
	const discussionModel = useDiscussionDbModel()

	if (_id) {
		const discussion = await discussionModel.findById(_id)
		return discussion ? [discussion] : []
	}

	if (participantId) {
		return discussionModel.findAll({ participantId })
	}

	if (viewerId) {
		return discussionModel.findAll({ viewerId })
	}

	if (organizationId) {
		return discussionModel.findAll({ organizationId })
	}

	return discussionModel.findAll()
}

export async function addDiscussion({
	title,
	description,
	startDate,
	organizationId,
	endDate,
	participantIds,
	viewerIds,
}: {
	title: string
	description: string
	startDate: string
	organizationId: string
	endDate: string
	participantIds: string[]
	viewerIds: string[]
}): Promise<string> {
	const discussionModel = useDiscussionDbModel()

	const insertDiscussion = await discussionModel.create({
		title,
		description,
		startDate,
		endDate,
		organizationId,
		participantIds,
		viewerIds,
	})
	if (!insertDiscussion) {
		throw new InternalServerError("Something went wrong: unable to add discussion")
	}

	return insertDiscussion._id.toString()
}

export async function updateDiscussion({
	_id,
	update,
}: {
	_id: string
	update: {
		title?: string
		description?: string
		startDate?: string
		endDate?: string
	}
}) {
	const discussionModel = useDiscussionDbModel()

	if (!_id) {
		throw new InvalidArgumentError("Filter missing for updating discussion")
	}

	const tokenUpdate: Partial<Discussion> = {}
	if (!_.isUndefined(update.title)) tokenUpdate.title = update.title
	if (!_.isUndefined(update.description)) tokenUpdate.description = update.description
	if (!_.isUndefined(update.startDate))
		tokenUpdate.startDate = new Date(update.startDate)
	if (!_.isUndefined(update.endDate)) tokenUpdate.endDate = new Date(update.endDate)

	await discussionModel.findByIdAndUpdate(_id, tokenUpdate)
}

export async function deleteDiscussion({ _id }: { _id: string }) {
	const discussionModel = useDiscussionDbModel()

	if (!_id) {
		throw new InvalidArgumentError("Filter missing for deleting discussion")
	}

	await discussionModel.deleteById(_id)
}
