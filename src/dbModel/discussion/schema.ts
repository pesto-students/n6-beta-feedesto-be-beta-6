import { Date, Document, model, Schema, SchemaTypeOptions, ObjectId } from "mongoose"

export interface Discussion extends Document {
	_id: Schema.Types.ObjectId | string
	title: string
	description: string
	organizationId: Schema.Types.ObjectId | string
	startDate: SchemaTypeOptions<Date> | string
	endDate: SchemaTypeOptions<Date> | string
	participantIds: SchemaTypeOptions<ObjectId[]> | string[]
	viewerIds: SchemaTypeOptions<ObjectId[]> | string[]
	upvoteIds: SchemaTypeOptions<ObjectId[]> | string[]
	downvoteIds: SchemaTypeOptions<ObjectId[]> | string[]
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
		upvoteIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
		downvoteIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
	},
	{ timestamps: true },
)

export const DiscussionModel = model<Discussion>("Discussion", schema)
