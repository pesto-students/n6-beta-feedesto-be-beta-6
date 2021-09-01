import { FilterQuery } from "mongoose"
import { Organization, OrganizationModel } from "./schema"

class OrganizationDbModel {
	async findAll({ name }: { name?: string } = {}) {
		const tokenFindFilter: FilterQuery<Organization> = {}
		if (name) tokenFindFilter.name = name

		return OrganizationModel.find(tokenFindFilter).lean()
	}
	async findById(organizationId: string) {
		return OrganizationModel.findById(organizationId).lean()
	}
	async findByIdAndUpdate(organizationId: string, update: Organization) {
		return OrganizationModel.findByIdAndUpdate(organizationId, update, {
			new: true,
		}).lean()
	}
	async create(organization: Partial<Organization>) {
		return OrganizationModel.create({
			...organization,
		})
	}
	async deleteById(organizationId: string) {
		return OrganizationModel.deleteOne({ organizationId }).lean()
	}
}

export const useOrganizationDbModel = () => new OrganizationDbModel()
