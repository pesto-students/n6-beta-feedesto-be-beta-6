import { ObjectId } from "mongodb"
import configs from "../../../core/configs"
import { parseIsoDate } from "../../../utils/utils"
import { mongoClient, MongoCollections } from "../mongo.client"

export type Organization = {
	id: string
	name: string
	userId: string
	createdAt: string
	modifiedAt: string
}

export async function mongoOrganizationList({
	id,
	name,
}: {
	id?: string
	name?: string
} = {}): Promise<Organization[]> {
	const tokenFindFilter: any = {}
	if (id) tokenFindFilter._id = new ObjectId(id)
	if (name) tokenFindFilter.name = name

	const MongoClient = await mongoClient()
	const db = MongoClient.db(configs.mongodb.name)

	const queryBuilder = db
		.collection(MongoCollections.ORGANIZATIONS)
		.find(tokenFindFilter, {
			projection: {
				name: 1,
				userId: 1,
				createdAt: 1,
				modifiedAt: 1,
			},
		})

	const organizationList = await queryBuilder.toArray()
	return organizationList.map((el) => {
		return {
			id: el._id,
			name: el.name,
			userId: el.userId,
			createdAt: parseIsoDate(el.createdAt),
			modifiedAt: parseIsoDate(el.modifiedAt),
		}
	})
}
