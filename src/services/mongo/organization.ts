import {
	AlreadyExistError,
	InternalServerError,
	InvalidArgumentError,
} from "@hkbyte/webapi"
import isUndefined from "lodash/isUndefined"
import { useOrganizationDbModel } from "../../dbModel"

export async function fetchOrganizations({
	_id,
	name,
}: {
	_id?: string
	name?: string
} = {}) {
	const organizationModel = useOrganizationDbModel()

	if (_id) {
		return await organizationModel.findById(_id)
	}
	if (name) {
		return await organizationModel.findAll({ name })
	}

	return organizationModel.findAll()
}

export async function addOrganization({
	name,
	userId,
}: {
	name: string
	userId: string
}): Promise<string> {
	const organizationModel = useOrganizationDbModel()

	// Check for Duplicates
	const [organizationWithName] = await organizationModel.findAll({ name })
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

	return insertOrganization._id.toString()
}

export async function updateOrganization({
	_id,
	update,
}: {
	_id: string
	update: {
		userId?: string
		name?: string
	}
}) {
	const organizationModel = useOrganizationDbModel()

	if (!_id) {
		throw new InvalidArgumentError("Filter missing for updating organization")
	}

	const tokenFilter: any = {}

	tokenFilter._id = _id

	const tokenUpdate: any = { modifiedAt: new Date() }
	if (!isUndefined(update.name)) tokenUpdate.name = update.name
	if (!isUndefined(update.userId)) tokenUpdate.userId = update.userId

	await organizationModel.findByIdAndUpdate(_id, tokenUpdate)
}
