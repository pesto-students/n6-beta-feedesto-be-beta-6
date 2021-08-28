import { AlreadyExistError, InternalServerError } from '@hkbyte/webapi'
import configs from '../../../core/configs'
import { mongoClient, MongoCollections } from '../mongo.client'
import { mongoOrganizationList } from './mongoOrganizationList'

export async function mongoOrganizationAdd({
	name,
	userId,
}: {
	name: string
	userId?: string
}): Promise<string> {
	const MongoClient = await mongoClient()
	const db = MongoClient.db(configs.mongodb.name)

	// Check for Duplicates
	const [[organizationWithName]] = await Promise.all([mongoOrganizationList({ name })])

	if (organizationWithName) {
		throw new AlreadyExistError(`Organization name: ${name} already exist`)
	}

	const insertOrganization = await db
		.collection(MongoCollections.ORGANIZATIONS)
		.insertOne({
			name,
			userId,
			createdAt: new Date(),
			modifiedAt: new Date(),
		})
	if (!insertOrganization?.insertedId) {
		throw new InternalServerError('Something went wrong: unable to add organization')
	}
	return insertOrganization.insertedId.toString()
}
