import { parseIsoDate } from "../../../utils/utils"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export type User = {
	id: string
	name: string
	email: string
	googleUserId: string
	organizationId: string
	isAdmin: boolean
	isVerified: boolean
	createdAt: string
	modifiedAt: string
}

export async function mongoUserList({
	id,
	googleUserId,
	organizationId,
}: {
	id?: string
	googleUserId?: string
	organizationId?: string
} = {}): Promise<User[]> {
	const tokenFindFilter: any = {}
	if (id) tokenFindFilter._id = checkAndGetObjectId(id)
	if (googleUserId) tokenFindFilter.googleUserId = googleUserId
	if (organizationId) tokenFindFilter.organizationId = organizationId

	const db = await mongoRunner()

	const queryBuilder = db.collection(collection.users).find(tokenFindFilter)

	const userList = await queryBuilder.toArray()
	return userList.map((el) => {
		return {
			id: el._id,
			name: el.name,
			organizationId: el.organizationId,
			email: el.email,
			googleUserId: el.googleUserId,
			isAdmin: el.isAdmin,
			isVerified: el.isVerified,
			createdAt: parseIsoDate(el.createdAt),
			modifiedAt: parseIsoDate(el.modifiedAt),
		}
	})
}
