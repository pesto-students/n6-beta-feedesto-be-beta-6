import { parseIsoDate } from "../../../utils/utils"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export type Discussion = {
	id: string
	organizationId: string
	title: string
	description: string
	startDate: string
	endDate: string
	participantIds: string[]
	viewerIds: string[]
	createdAt: string
	modifiedAt: string
}

export async function mongoDiscussionList({
	id,
	participantId,
	viewerId,
	organizationId,
}: {
	id?: string
	participantId?: string
	viewerId?: string
	organizationId?: string
} = {}): Promise<Discussion[]> {
	const tokenFindFilter: any = {}
	if (id) tokenFindFilter._id = checkAndGetObjectId(id)
	if (participantId) tokenFindFilter.participantId = participantId
	if (viewerId) tokenFindFilter.viewerId = viewerId
	if (organizationId) tokenFindFilter.organizationId = organizationId

	const db = await mongoRunner()

	const queryBuilder = db.collection(collection.users).find(tokenFindFilter)

	queryBuilder.sort("createdAt")

	const userList = await queryBuilder.toArray()
	return userList.map((el) => {
		return {
			id: el._id,
			organizationId: el.organizationId,
			title: el.title,
			description: el.description,
			startDate: el.startDate,
			endDate: el.endDate,
			participantIds: el.participantIds,
			viewerIds: el.viewerIds,
			createdAt: parseIsoDate(el.createdAt),
			modifiedAt: parseIsoDate(el.modifiedAt),
		}
	})
}
