import _ from "lodash"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export async function mongoUserUpdate({
	id,
	update,
}: {
	id: string
	update: {
		name?: string
		isVerified?: boolean
	}
}) {
	const tokenUpdate: any = { modifiedAt: new Date() }
	if (!_.isUndefined(update.name)) tokenUpdate.name = update.name
	if (!_.isUndefined(update.isVerified)) tokenUpdate.isVerified = update.isVerified

	const db = await mongoRunner()

	const updateUsers = await db
		.collection(collection.users)
		.updateMany({ _id: checkAndGetObjectId(id) }, { $set: tokenUpdate })

	return updateUsers.result.ok
}
