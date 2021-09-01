import { Date, model, Schema, Document, SchemaTypeOptions, ObjectId } from "mongoose"

export interface Answer extends Document {
	discussionId: Schema.Types.ObjectId | string
	userId: Schema.Types.ObjectId | string
	content: string
	upvoteIds: SchemaTypeOptions<ObjectId> | string[]
	downvoteIds: SchemaTypeOptions<ObjectId> | string[]
	createdAt: Date
	updatedAt: Date
}

const schema = new Schema<Answer>(
	{
		content: { type: String, required: true },
		discussionId: { type: Schema.Types.ObjectId, ref: "Discussion", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		upvoteIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
		downvoteIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
	},
	{ timestamps: true },
)

export const AnswerModel = model<Answer>("Answer", schema)
