import { InternalServerError, InvalidArgumentError } from "@hkbyte/webapi"
import _ from "lodash"
import { ObjectID } from "mongodb"
import configs from "../../../core/configs"
import { mongoClient, MongoCollections } from "../mongo.client"

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
	if (id) {
		if (!ObjectID.isValid(id)) {
			throw new InternalServerError("Id is invalid")
		}
		tokenFilter._id = new ObjectID(id)
	}

	const tokenUpdate: any = { modifiedAt: new Date() }
	if (!_.isUndefined(update.name)) tokenUpdate.name = update.name
	if (!_.isUndefined(update.userId)) tokenUpdate.userId = update.userId

	const MongoClient = await mongoClient()
	const db = MongoClient.db(configs.mongodb.name)

	const updateOrganizations = await db
		.collection(MongoCollections.ORGANIZATIONS)
		.updateMany(tokenFilter, { $set: tokenUpdate })

	return updateOrganizations.result.ok
}
