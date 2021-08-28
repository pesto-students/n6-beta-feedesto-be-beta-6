import { parseIsoDate } from "../../../utils/utils"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export type Answer = {
	id: string
	discussionId: string
	userId: string
	content: string
	createdAt: string
	modifiedAt: string
}

export async function mongoAnswerList({
	id,
	discussionId,
	userId,
}: {
	id?: string
	discussionId?: string
	userId?: string
} = {}): Promise<Answer[]> {
	const tokenFindFilter: any = {}
	if (id) tokenFindFilter._id = checkAndGetObjectId(id)
	if (discussionId) tokenFindFilter.discussionId = discussionId
	if (userId) tokenFindFilter.userId = userId

	const db = await mongoRunner()

	const queryBuilder = db.collection(collection.answers).find(tokenFindFilter)

	queryBuilder.sort("createdAt")

	const userList = await queryBuilder.toArray()
	return userList.map((el) => {
		return {
			id: el._id,
			discussionId: el.discussionId,
			userId: el.userId,
			content: el.content,
			createdAt: parseIsoDate(el.createdAt),
			modifiedAt: parseIsoDate(el.modifiedAt),
		}
	})
}
