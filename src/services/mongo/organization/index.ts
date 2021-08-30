import {
	AlreadyExistError,
	InternalServerError,
	InvalidArgumentError,
} from "@hkbyte/webapi"
import _ from "lodash"
import { useOrganizationDbModel } from "../../../dbModel"
import { checkAndGetObjectId } from "../utils"

export async function addOrganization({
	name,
	userId,
}: {
	name: string
	userId: string
}): Promise<string> {
	const organizationModel = useOrganizationDbModel()

	// Check for Duplicates
	const organizationWithName = await organizationModel.findBy({ name })
	if (organizationWithName) {
		throw new AlreadyExistError(`Organization name: ${name} already exist`)
	}

	const insertOrganization = await organizationModel.create({
		name,
		userId,
	})
	if (!insertOrganization) {
		throw new InternalServerError("Something went wrong: unable to add organization")
	}

	return insertOrganization.id.toString()
}

export async function fetchOrganizations({
	id,
	name,
}: {
	id?: string
	name?: string
} = {}) {
	const organizationModel = useOrganizationDbModel()

	if (id) {
		return await organizationModel.findById(id)
	}
	if (name) {
		return await organizationModel.findBy({ name })
	}
}

export async function updateOrganization({
	id,
	update,
}: {
	id: string
	update: {
		userId?: string
		name?: string
	}
}) {
	const organizationModel = useOrganizationDbModel()

	if (!id) {
		throw new InvalidArgumentError("Filter missing for updating organization")
	}

	const tokenFilter: any = {}

	tokenFilter._id = checkAndGetObjectId(id)

	const tokenUpdate: any = { modifiedAt: new Date() }
	if (!_.isUndefined(update.name)) tokenUpdate.name = update.name
	if (!_.isUndefined(update.userId)) tokenUpdate.userId = update.userId

	await organizationModel.findByIdAndUpdate(id, tokenUpdate)
}
