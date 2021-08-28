import { AlreadyExistError, InternalServerError } from "@hkbyte/webapi"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { mongoOrganizationList } from "./mongoOrganizationList"

export async function mongoOrganizationAdd({
	name,
	userId,
}: {
	name: string
	userId?: string
}): Promise<string> {
	const db = await mongoRunner()

	// Check for Duplicates
	const [[organizationWithName]] = await Promise.all([mongoOrganizationList({ name })])

	if (organizationWithName) {
		throw new AlreadyExistError(`Organization name: ${name} already exist`)
	}

	const insertOrganization = await db.collection(collection.organizations).insertOne({
		name,
		userId,
		createdAt: new Date(),
		modifiedAt: new Date(),
	})
	if (!insertOrganization?.insertedId) {
		throw new InternalServerError("Something went wrong: unable to add organization")
	}
	return insertOrganization.insertedId.toString()
}
