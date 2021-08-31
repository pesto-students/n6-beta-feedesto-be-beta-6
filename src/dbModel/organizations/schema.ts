import { Date, Document, model, Schema } from "mongoose"

export interface Organization extends Document {
	name: string
	userId: string
	createdAt: Date
	updatedAt: Date
}

const schema = new Schema<Organization>(
	{
		name: { type: String, required: true },
		userId: { type: String, required: true },
	},
	{ timestamps: true },
)

export const OrganizationModel = model<Organization>("Organization", schema)
