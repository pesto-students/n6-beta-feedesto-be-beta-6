import { model, Schema } from "mongoose"

export interface Organization {
	id: string
	name: string
	userId: string
	createdAt: string
	modifiedAt: string
}

const schema = new Schema<Organization>({
	id: { type: String, required: true },
	name: { type: String, required: true },
	userId: { type: String, required: true },
	createdAt: { type: String, required: true },
	modifiedAt: { type: String, required: true },
})

export const OrganizationModel = model<Organization>("Organization", schema)
