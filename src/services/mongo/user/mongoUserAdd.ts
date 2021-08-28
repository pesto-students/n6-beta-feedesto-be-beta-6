import { AlreadyExistError, InternalServerError } from '@hkbyte/webapi'
import configs from '../../../core/configs'
import { mongoClient, MongoCollections } from '../mongo.client'
import { mongoUserList } from './mongoUserList'

export async function mongoUserAdd({
	name,
	email,
	organizationId,
	isAdmin = false,
}: {
	name: string
	email: string
	organizationId: string
	isAdmin?: boolean
}): Promise<string> {
	const MongoClient = await mongoClient()
	const db = MongoClient.db(configs.mongodb.name)

	// Check for Duplicates
	const [[userWithEmail]] = await Promise.all([mongoUserList({ email })])

	if (userWithEmail) {
		throw new AlreadyExistError(`User email: ${email} already exist`)
	}

	const insertUser = await db.collection(MongoCollections.USERS).insertOne({
		name,
		email,
		organizationId,
		isAdmin,
		createdAt: new Date(),
		modifiedAt: new Date(),
	})
	if (!insertUser?.insertedId) {
		throw new InternalServerError('Something went wrong: unable to add user')
	}
	return insertUser.insertedId.toString()
}
