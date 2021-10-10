import { Date, Document, model, Schema, SchemaTypeOptions, ObjectId } from "mongoose"
import { Organization, User } from ".."

export interface Discussion extends Document {
	_id: Schema.Types.ObjectId | string
	title: string
	description: string
	organizationId: Schema.Types.ObjectId | string
	organization?: Organization[]
	startDate: SchemaTypeOptions<Date> | string
	endDate: SchemaTypeOptions<Date> | string
	participantIds: SchemaTypeOptions<ObjectId[]> | string[]
	participants?: User[]
	viewerIds: SchemaTypeOptions<ObjectId[]> | string[]
	viewers?: User[]
	isLive?: boolean
	createdAt: Date
	updatedAt: Date
}

const schema = new Schema<Discussion>(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		startDate: { type: Schema.Types.Date },
		organizationId: {
			type: Schema.Types.ObjectId,
			ref: "Organization",
			required: true,
		},
		endDate: { type: Schema.Types.Date },
		isLive: { type: Boolean, default: false },
		participantIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
		viewerIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
	},
	{ timestamps: true },
)

schema.virtual("organization", {
	ref: "Organization",
	localField: "organizationId",
	foreignField: "_id",
	justOne: true,
})

schema.virtual("participants", {
	ref: "User",
	localField: "participantIds",
	foreignField: "_id",
})

schema.virtual("viewers", {
	ref: "User",
	localField: "viewerIds",
	foreignField: "_id",
})

export const DiscussionModel = model<Discussion>("Discussion", schema)
