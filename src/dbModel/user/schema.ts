import { model, Schema, Document, Date } from "mongoose"

export interface User extends Document {
	name: string
	email: string
	googleUserId: string
	organizationId: Schema.Types.ObjectId
	isAdmin?: boolean
	isVerified?: boolean
	createdAt: Date
	updatedAt: Date
}

const schema = new Schema<User>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		googleUserId: { type: String, required: true },
		organizationId: {
			type: Schema.Types.ObjectId,
			ref: "Organization",
			required: true,
		},
		isAdmin: { type: Boolean, default: false },
		isVerified: { type: Boolean, default: false },
	},
	{ timestamps: true },
)

export const UserModel = model<User>("User", schema)
