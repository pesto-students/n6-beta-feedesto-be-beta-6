import {
	AlreadyExistError,
	InternalServerError,
	InvalidArgumentError,
} from "@hkbyte/webapi"
import _ from "lodash"
import { LeanDocument } from "mongoose"
import { User } from "../../dbModel/user/schema"
import { useUserDbModel } from "../../dbModel/user/user"
import { checkAndGetObjectId } from "../../utils/utils"

export async function fetchUsers({
	id,
	googleUserId,
	organizationId,
}: {
	id?: string
	googleUserId?: string
	organizationId?: string
} = {}): Promise<LeanDocument<User>[]> {
	const userModel = useUserDbModel()

	if (id) {
		const user = await userModel.findById(id)
		return user ? [user] : []
	}

	if (googleUserId) {
		const users = await userModel.findAll({ googleUserId })
		return users
	}

	if (organizationId) {
		return userModel.findAll({ organizationId })
	}

	return userModel.findAll()
}

export async function addUser({
	name,
	email,
	googleUserId,
	organizationId,
	isAdmin = false,
}: {
	name: string
	email: string
	googleUserId: string
	organizationId: string
	isAdmin?: boolean
}): Promise<string> {
	const userModel = useUserDbModel()

	// Check for Duplicates
	const [user] = await userModel.findAll({ googleUserId })

	if (user) {
		throw new AlreadyExistError(`User with this account already exist`)
	}

	const insertUser = await userModel.create({
		name,
		email,
		googleUserId,
		organizationId: checkAndGetObjectId(organizationId),
		isAdmin,
	})
	if (!insertUser) {
		throw new InternalServerError("Something went wrong: unable to add user")
	}

	return insertUser.id.toString()
}

export async function updateUser({
	id,
	update,
}: {
	id: string
	update: {
		name?: string
		isVerified?: boolean
	}
}) {
	const userModel = useUserDbModel()

	if (!id) {
		throw new InvalidArgumentError("Filter missing for updating user")
	}

	const tokenUpdate: Partial<User> = {}
	if (!_.isUndefined(update.name)) tokenUpdate.name = update.name
	if (!_.isUndefined(update.isVerified)) {
		tokenUpdate.isVerified = update.isVerified
		if (update.isVerified) {
			tokenUpdate.verifiedAt = new Date().toISOString()
		}
	}

	await userModel.findByIdAndUpdate(id, tokenUpdate)
}

export async function deleteUser({ id }: { id: string }) {
	const userModel = useUserDbModel()

	if (!id) {
		throw new InvalidArgumentError("Filter missing for deleting user")
	}

	await userModel.deleteById(id)
}
