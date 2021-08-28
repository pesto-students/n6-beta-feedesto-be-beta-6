import { parseIsoDate } from "../../../utils/utils"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"

export type User = {
	id: string
	name: string
	email: string
	organizationId: string
	isAdmin: boolean
	isVerified: boolean
	createdAt: string
	modifiedAt: string
}

export async function mongoUserList({
	email,
}: {
	email?: string
} = {}): Promise<User[]> {
	const tokenFindFilter: any = {}
	if (email) tokenFindFilter.email = email

	const db = await mongoRunner()

	const queryBuilder = db.collection(collection.users).find(tokenFindFilter)

	const userList = await queryBuilder.toArray()
	return userList.map((el) => {
		return {
			id: el._id,
			name: el.name,
			organizationId: el.organizationId,
			email: el.email,
			isAdmin: el.isAdmin,
			isVerified: el.isVerified,
			createdAt: parseIsoDate(el.createdAt),
			modifiedAt: parseIsoDate(el.modifiedAt),
		}
	})
}
