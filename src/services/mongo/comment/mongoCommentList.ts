import { parseIsoDate } from "../../../utils/utils"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export type Comment = {
	id: string
	answerId: string
	userId: string
	content: string
	createdAt: string
	modifiedAt: string
}

export async function mongoCommentList({
	id,
	answerId,
	userId,
}: {
	id?: string
	answerId?: string
	userId?: string
} = {}): Promise<Comment[]> {
	const tokenFindFilter: any = {}
	if (id) tokenFindFilter._id = checkAndGetObjectId(id)
	if (answerId) tokenFindFilter.answerId = answerId
	if (userId) tokenFindFilter.userId = userId

	const db = await mongoRunner()

	const queryBuilder = db.collection(collection.comments).find(tokenFindFilter)

	queryBuilder.sort("createdAt")

	const userList = await queryBuilder.toArray()
	return userList.map((el) => {
		return {
			id: el._id,
			answerId: el.answerId,
			userId: el.userId,
			content: el.content,
			createdAt: parseIsoDate(el.createdAt),
			modifiedAt: parseIsoDate(el.modifiedAt),
		}
	})
}
