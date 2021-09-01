import { model, Schema, Document, Date, SchemaTypeOptions, ObjectId } from "mongoose"

export interface Comment extends Document {
	answerId: Schema.Types.ObjectId
	userId: Schema.Types.ObjectId
	content: string
	upvoteIds: SchemaTypeOptions<ObjectId> | string[]
	downvoteIds: SchemaTypeOptions<ObjectId> | string[]
	createdAt: Date
	updatedAt: Date
}

const schema = new Schema<Comment>(
	{
		content: { type: String, required: true },
		answerId: { type: Schema.Types.ObjectId, ref: "Answer", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		upvoteIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
		downvoteIds: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
	},
	{ timestamps: true },
)

export const CommentModel = model<Comment>("Comment", schema)
