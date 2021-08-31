import isUndefined from "lodash/isUndefined"

import { User, UserModel } from "./schema"

class UserDbModel {
	async findAll({
		organizationId,
		googleUserId,
	}: {
		organizationId?: string
		googleUserId?: string
	}) {
		const tokenFindFilter: any = {}
		if (googleUserId) tokenFindFilter.googleUserId = googleUserId
		if (organizationId) tokenFindFilter.organizationId = organizationId

		return UserModel.find({ tokenFindFilter }).lean()
	}

	async findById(userId: string) {
		return UserModel.findById(userId).lean()
	}

	async findByIdAndUpdate(
		userId: string,
		update: {
			name?: string
			isVerified?: boolean
		},
	) {
		const tokenUpdate: any = {}
		if (isUndefined(update.name)) tokenUpdate.name = update.name
		if (isUndefined(update.isVerified)) tokenUpdate.isVerified = update.isVerified

		return UserModel.findByIdAndUpdate(userId, tokenUpdate, {
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
