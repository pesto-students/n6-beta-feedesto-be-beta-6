import { Organization, OrganizationModel } from "./schema"

class OrganizationDbModel {
	async findAll() {
		return OrganizationModel.find({}).lean()
	}
	async findBy({ name }: { name?: string }) {
		return OrganizationModel.find({ name }).lean()
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
			createdAt: new Date().toISOString(),
			modifiedAt: new Date().toISOString(),
		})
	}
	async deleteById(organizationId: string) {
		return OrganizationModel.deleteOne({ organizationId }).lean()
	}
}

export const useOrganizationDbModel = () => new OrganizationDbModel()
