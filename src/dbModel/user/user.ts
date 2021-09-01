import _ from "lodash"

import { User, UserModel } from "./schema"

class UserDbModel {
	async findAll({
		organizationId,
		googleUserId,
	}: {
		organizationId?: string
		googleUserId?: string
	} = {}) {
		const tokenFindFilter: any = {}
		if (googleUserId) tokenFindFilter.googleUserId = googleUserId
		if (organizationId) tokenFindFilter.organizationId = organizationId

		return UserModel.find({ tokenFindFilter }).lean()
	}

	async findById(userId: string) {
		return UserModel.findById(userId).lean()
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
		return UserModel.deleteOne({ userId }).lean()
	}
}

export const useUserDbModel = () => new UserDbModel()
