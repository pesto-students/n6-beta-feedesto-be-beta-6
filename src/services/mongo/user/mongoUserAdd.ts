import { AlreadyExistError, InternalServerError } from "@hkbyte/webapi"
import { collection } from "../collections"

import { mongoRunner } from "../mongoRunner"
import { mongoUserList } from "./mongoUserList"

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
	const db = await mongoRunner()

	// Check for Duplicates
	const [[userWithEmail]] = await Promise.all([mongoUserList({ email })])

	if (userWithEmail) {
		throw new AlreadyExistError(`User email: ${email} already exist`)
	}

	const insertUser = await db.collection(collection.users).insertOne({
		name,
		email,
		organizationId,
		isAdmin,
		isVerified: false,
		createdAt: new Date(),
		modifiedAt: new Date(),
	})
	if (!insertUser?.insertedId) {
		throw new InternalServerError("Something went wrong: unable to add user")
	}
	return insertUser.insertedId.toString()
}
