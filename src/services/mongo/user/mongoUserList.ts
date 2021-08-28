import configs from '../../../core/configs'
import { parseIsoDate } from '../../../utils/utils'
import { mongoClient, MongoCollections } from '../mongo.client'

export type User = {
	id: string
	name: string
	email: string
	organizationId: string
	isAdmin: boolean
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

	const MongoClient = await mongoClient()
	const db = MongoClient.db(configs.mongodb.name)

	const queryBuilder = db.collection(MongoCollections.USERS).find(tokenFindFilter, {
		projection: {
			name: 1,
			email: 1,
			organizationId: 1,
			isAdmin: 1,
			createdAt: 1,
			modifiedAt: 1,
		},
	})

	const userList = await queryBuilder.toArray()
	return userList.map((el) => {
		return {
			id: el._id,
			name: el.name,
			organizationId: el.organizationId,
			email: el.email,
			isAdmin: el.isAdmin,
			createdAt: parseIsoDate(el.createdAt),
			modifiedAt: parseIsoDate(el.modifiedAt),
		}
	})
}
