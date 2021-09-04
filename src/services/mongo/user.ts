import {
	AlreadyExistError,
	InternalServerError,
	InvalidArgumentError,
} from "@hkbyte/webapi"
import _ from "lodash"
import { LeanDocument } from "mongoose"
import { User } from "../../dbModel"
import { useUserDbModel } from "../../dbModel"
import { checkAndGetObjectId } from "../../utils/utils"

export async function fetchUsers({
	_id,
	googleUserId,
	organizationId,
}: {
	_id?: string
	googleUserId?: string
	organizationId?: string
} = {}): Promise<LeanDocument<User>[]> {
	const userModel = useUserDbModel()

	if (_id) {
		const user = await userModel.findById(_id)
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
	googleAvatarUrl,
	organizationId,
	isAdmin = false,
}: {
	name: string
	email: string
	googleUserId: string
	googleAvatarUrl?: string
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
		googleAvatarUrl,
		organizationId: checkAndGetObjectId(organizationId),
		isAdmin,
	})
	if (!insertUser) {
		throw new InternalServerError("Something went wrong: unable to add user")
	}

	return insertUser._id.toString()
}

export async function updateUser({
	_id,
	update,
}: {
	_id: string
	update: {
		name?: string
		isVerified?: boolean
	}
}) {
	const userModel = useUserDbModel()

	if (!_id) {
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

	await userModel.findByIdAndUpdate(_id, tokenUpdate)
}

export async function deleteUser({ _id }: { _id: string }) {
	const userModel = useUserDbModel()

	if (!_id) {
		throw new InvalidArgumentError("Filter missing for deleting user")
	}

	await userModel.deleteById(_id)
}
