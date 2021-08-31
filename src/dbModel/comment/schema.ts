import { model, Schema, Document, Date } from "mongoose"

export interface Comment extends Document {
	answerId: Schema.Types.ObjectId
	userId: Schema.Types.ObjectId
	content: string
	createdAt: Date
	updatedAt: Date
}

const schema = new Schema<Comment>(
	{
		content: { type: String, required: true },
		answerId: { type: Schema.Types.ObjectId, ref: "Answer", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true },
)

export const CommentModel = model<Comment>("Comment", schema)
