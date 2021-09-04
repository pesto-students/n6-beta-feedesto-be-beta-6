import {
	AlreadyExistError,
	InternalServerError,
	InvalidArgumentError,
} from "@hkbyte/webapi"
import isUndefined from "lodash/isUndefined"
import { LeanDocument } from "mongoose"
import { User } from "../../dbModel"
import { useUserDbModel } from "../../dbModel"
import eventEmitter from "../../eventEmitter"
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

	const oldUser = await userModel.findById(_id)

	const tokenUpdate: Partial<User> = {}
	if (!isUndefined(update.name)) tokenUpdate.name = update.name
	if (!isUndefined(update.isVerified)) {
		tokenUpdate.isVerified = update.isVerified
		if (update.isVerified) {
			tokenUpdate.verifiedAt = new Date().toISOString()
		}
	}

	const user = await userModel.findByIdAndUpdate(_id, tokenUpdate)
	if (oldUser && !oldUser.isVerified && user && user.isVerified) {
		eventEmitter.emit("sendMail", {
			object: { email: user.email, text: `and can start using feedesto` },
		})
	}

	return user
}

export async function deleteUser({ _id }: { _id: string }) {
	const userModel = useUserDbModel()

	if (!_id) {
		throw new InvalidArgumentError("Filter missing for deleting user")
	}

	await userModel.deleteById(_id)
}
