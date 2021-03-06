import { FilterQuery } from "mongoose"
import { isUndefined } from "lodash"
import { checkAndGetObjectId } from "../../utils/utils"
import { User, UserModel } from "./schema"

class UserDbModel {
	async findAll({
		organizationId,
		googleUserId,
	}: {
		organizationId?: string
		googleUserId?: string
	} = {}) {
		const tokenFindFilter: FilterQuery<User> = {}
		if (!isUndefined(googleUserId)) tokenFindFilter.googleUserId = googleUserId
		if (!isUndefined(organizationId))
			tokenFindFilter.organizationId = checkAndGetObjectId(organizationId)

		return UserModel.find(tokenFindFilter).populate("organization").lean()
	}

	async findById(userId: string) {
		return UserModel.findById(userId).populate("organization").lean()
	}

	async findByIdAndUpdate(userId: string, update: Partial<User>) {
		return UserModel.findByIdAndUpdate(userId, update, {
			new: true,
		}).lean()
	}

	async create(user: Partial<User>) {
		return UserModel.create({
			...user,
			isVerified: false,
		})
	}
	async deleteById(userId: string) {
		return UserModel.deleteOne({ _id: userId }).lean()
	}
}

export const useUserDbModel = () => new UserDbModel()
