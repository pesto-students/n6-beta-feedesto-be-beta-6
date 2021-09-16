import { model, Schema, Document, Date, SchemaTypeOptions } from "mongoose"
import { Organization } from ".."

export interface User extends Document {
	name: string
	email: string
	googleUserId: string
	googleAvatarUrl?: string
	organization?: Organization
	organizationId: Schema.Types.ObjectId
	isAdmin?: boolean
	isVerified?: boolean
	verifiedAt: SchemaTypeOptions<Date> | string
	createdAt: Date
	updatedAt: Date
}

const schema = new Schema<User>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		googleUserId: { type: String, required: false },
		googleAvatarUrl: { type: String },
		organizationId: {
			type: Schema.Types.ObjectId,
			ref: "Organization",
			required: true,
		},
		isAdmin: { type: Boolean, default: false },
		isVerified: { type: Boolean, default: false },
		verifiedAt: { type: Date },
	},
	{ timestamps: true },
)

schema.virtual("organization", {
	ref: "Organization",
	localField: "organizationId",
	foreignField: "_id",
	justOne: true,
})

export const UserModel = model<User>("User", schema)
