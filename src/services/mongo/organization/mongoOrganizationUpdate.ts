import { InvalidArgumentError } from "@hkbyte/webapi"
import _ from "lodash"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export async function mongoOrganizationUpdate({
	id,
	update,
}: {
	id?: string
	update: {
		userId?: string
		name?: string
	}
}) {
	if (!id) {
		throw new InvalidArgumentError("Filter missing for updating organization")
	}

	const tokenFilter: any = {}

	tokenFilter._id = checkAndGetObjectId(id)

	const tokenUpdate: any = { modifiedAt: new Date() }
	if (!_.isUndefined(update.name)) tokenUpdate.name = update.name
	if (!_.isUndefined(update.userId)) tokenUpdate.userId = update.userId

	const db = await mongoRunner()

	const updateOrganizations = await db
		.collection(collection.organizations)
		.updateMany(tokenFilter, { $set: tokenUpdate })

	return updateOrganizations.result.ok
}
